"use client";
import { useState, type CSSProperties, type ChangeEvent } from "react";
import type { MassarData } from "../../grading-sheet/types";
import type { CahierTextesConfig, CTLevel, Lang } from "../types";
import { parseMassarFile } from "../../grading-sheet/parser";
import Link from "next/link";

const INK = "#312E81";
const INDIGO = "#4338CA";
const INDIGO_LIGHT = "#EEF2FF";

type BlankClass = { name: string; count: number };
type LevelState = {
  name: string;
  classes: MassarData[];      // imported from Massar
  blanks: BlankClass[];       // manually added blank classes
  logPages: number;
};

const emptyLevel = (): LevelState => ({ name: "", classes: [], blanks: [], logPages: 8 });

export function CahierTextesTool() {
  const [lang, setLang] = useState<Lang | null>(null);
  const [mode, setMode] = useState<"massar" | "blank">("massar");
  const [levels, setLevels] = useState<LevelState[]>([emptyLevel(), emptyLevel()]);
  const [config, setConfig] = useState<Omit<CahierTextesConfig, "lang" | "levels">>({
    coverVariant: "male", subject: "", academy: "", directorate: "", school: "", prof: "", annee: "",
    showHolidays: true, showStudentLists: true, showCards: true, showStructure: true, showIndex: true, showLeaves: true,
    logSplit: "level",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isFr = lang === "fr";
  const T = (ar: string, fr: string) => (isFr ? fr : ar);

  const patchLevel = (i: number, patch: Partial<LevelState>) =>
    setLevels(prev => prev.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));
  const setLevelCount = (n: number) =>
    setLevels(prev => { const next = prev.slice(0, Math.max(1, n)); while (next.length < n) next.push(emptyLevel()); return next; });

  const importMassar = async (i: number, files: FileList | File[]) => {
    const arr = Array.from(files).filter(f => f.name.match(/\.(xlsx|xls)$/i));
    if (arr.length === 0) { setError(T("الملفات يجب أن تكون Excel (.xlsx)", "Fichiers Excel (.xlsx) requis")); return; }
    setError(null);
    try {
      const parsed = await Promise.all(arr.map(f => parseMassarFile(f)));
      setLevels(prev => prev.map((l, idx) => {
        if (idx !== i) return l;
        const existing = new Set(l.classes.map(c => c.meta.className));
        const add = parsed.filter(p => !existing.has(p.meta.className));
        return { ...l, classes: [...l.classes, ...add], name: l.name || parsed[0]?.meta.level || "" };
      }));
      setConfig(c => ({ ...c, prof: c.prof || parsed[0]?.meta.teacher || "", annee: c.annee || parsed[0]?.meta.year || "", subject: c.subject || parsed[0]?.meta.subject || "" }));
    } catch { setError(T("تعذّر قراءة أحد الملفات", "Lecture impossible")); }
  };

  const addBlank = (i: number) => patchLevel(i, { blanks: [...levels[i].blanks, { name: "", count: 40 }] });
  const patchBlank = (i: number, j: number, patch: Partial<BlankClass>) =>
    patchLevel(i, { blanks: levels[i].blanks.map((b, k) => (k === j ? { ...b, ...patch } : b)) });
  const rmBlank = (i: number, j: number) => patchLevel(i, { blanks: levels[i].blanks.filter((_, k) => k !== j) });
  const rmClass = (i: number, j: number) => patchLevel(i, { classes: levels[i].classes.filter((_, k) => k !== j) });

  const buildLevels = (): CTLevel[] =>
    levels.map(l => {
      const blankClasses: MassarData[] = l.blanks.map(b => ({
        meta: { school: "", academy: "", level: l.name, className: b.name || l.name, teacher: "", term: "", subject: "", year: "" },
        students: Array.from({ length: Math.max(0, Math.min(60, b.count)) }, (_, k) => ({ index: k + 1, code: "", name: "" })),
      }));
      // "massar" → real rosters with names; "blank" → empty-name rosters.
      const classes = mode === "massar" ? l.classes : blankClasses;
      return { name: l.name, classes, logPagesPerClass: l.logPages };
    });

  const totalClasses = levels.reduce((s, l) => s + (mode === "massar" ? l.classes.length : l.blanks.length), 0);
  const ready = lang !== null && totalClasses > 0;

  const handleDownload = async () => {
    if (!lang || !ready) return;
    setLoading(true); setError(null);
    try {
      const payloadConfig: CahierTextesConfig = { ...config, lang, levels: buildLevels() };
      const res = await fetch("/api/unit-plan-pdf", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool: "cahier-textes", payload: { config: payloadConfig } }),
      });
      if (!res.ok) throw new Error("fail");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = isFr ? "Cahier-de-textes.pdf" : "دفتر-النصوص.pdf"; a.click();
      URL.revokeObjectURL(url);
    } catch { setError(T("تعذّر إنشاء الملف", "Échec de génération")); }
    finally { setLoading(false); }
  };

  // ── Language gate ──
  if (lang === null) {
    return (
      <div style={pageStyle}>
        <nav style={navStyle}><div style={navInner}><Link href="/" style={backLink}>← الرئيسية</Link><span style={navTitle}>دفتر النصوص</span></div>
          <div style={{ height: 3, background: `linear-gradient(90deg, ${INK}, ${INDIGO})` }} /></nav>
        <div style={{ maxWidth: 620, margin: "80px auto 0", padding: "0 24px", textAlign: "center" }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>📖</div>
          <h1 style={{ fontSize: 30, fontWeight: 900, color: INK, margin: "0 0 8px" }}>دفتر النصوص</h1>
          <p style={{ fontSize: 15, color: "#64748B", margin: "0 0 32px" }}>اختر لغة الدفتر أولاً — ستُنتَج جميع الصفحات بهذه اللغة<br/><span style={{ fontSize: 13 }}>Choisissez d'abord la langue du cahier</span></p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            {([["ar", "العربية", "🇲🇦"], ["fr", "Français", "🇫🇷"]] as const).map(([l, label, flag]) => (
              <button key={l} onClick={() => setLang(l)} style={langBtn}>
                <span style={{ fontSize: 34 }}>{flag}</span>
                <span style={{ fontSize: 18, fontWeight: 900, color: INK }}>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <nav style={navStyle}><div style={navInner}><Link href="/" style={backLink}>← الرئيسية</Link><span style={navTitle}>دفتر النصوص</span></div>
        <div style={{ height: 3, background: `linear-gradient(90deg, ${INK}, ${INDIGO})` }} /></nav>

      <div style={heroStyle}>
        <span style={heroPill}>📖 {T("دفتر النصوص", "Cahier de textes")} — {isFr ? "Français" : "العربية"}</span>
        <h1 style={h1Style}>{T("دفتر النصوص", "Cahier de textes")}</h1>
        <p style={heroDesc}>{T("مقسوم حسب المستويات، بلوائح التلاميذ من مسار وسجل الدروس", "Divisé par niveaux, listes Massar et journal des séances")}</p>
        <button onClick={() => setLang(null)} style={changeLangBtn}>{T("تغيير اللغة", "Changer la langue")} ↺</button>
      </div>

      <div style={bodyStyle}>

        {/* Mode: filled from Massar vs blank */}
        <section style={cardStyle}>
          <div style={{ display: "flex", gap: 10 }}>
            {([["massar", T("📂 من مسار (بالأسماء)", "📂 Depuis Massar (avec noms)")], ["blank", T("📄 نسخة فارغة (بدون أسماء)", "📄 Version vierge (sans noms)")]] as const).map(([m, label]) => (
              <button key={m} onClick={() => { setMode(m); if (m === "blank") setLevels(prev => prev.map(l => l.blanks.length ? l : { ...l, blanks: [{ name: "", count: 40 }] })); }}
                style={{ flex: 1, padding: "12px", borderRadius: 12, border: mode === m ? `2px solid ${INK}` : "1.5px solid #E2E8F0", background: mode === m ? INK : "#fff", color: mode === m ? "#fff" : "#334155", fontWeight: 800, fontSize: 14, fontFamily: "Cairo, sans-serif", cursor: "pointer" }}>
                {label}
              </button>
            ))}
          </div>
        </section>

        {/* Levels */}
        <section style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
            <h2 style={secTitle}><span>🎚️</span> {T("المستويات", "Niveaux")}</h2>
            <div>
              <label style={{ ...miniLbl, marginLeft: 8 }}>{T("عدد المستويات", "Nombre de niveaux")}</label>
              <select style={{ ...inp, width: 80, display: "inline-block" }} value={levels.length} onChange={e => setLevelCount(Number(e.target.value))}>
                {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>

          {/* Log split: per level vs per class */}
          <div style={{ marginBottom: 14 }}>
            <label style={miniLbl}>{T("تقسيم سجل الدروس", "Découpage du journal")}</label>
            <div style={{ display: "flex", gap: 10 }}>
              {([["level", T("سجل موحّد لكل مستوى", "Un journal par niveau")], ["class", T("سجل مستقل لكل قسم", "Un journal par classe")]] as const).map(([v, label]) => {
                const on = config.logSplit === v;
                return (
                  <button key={v} onClick={() => setConfig(c => ({ ...c, logSplit: v }))}
                    style={{ flex: 1, padding: "10px", borderRadius: 10, border: on ? `2px solid ${INDIGO}` : "1.5px solid #E2E8F0", background: on ? INDIGO_LIGHT : "#fff", color: on ? INK : "#64748B", fontWeight: 700, fontSize: 12.5, cursor: "pointer", fontFamily: "Cairo, sans-serif" }}>
                    {on ? "✓ " : ""}{label}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {levels.map((lv, i) => (
              <div key={i} style={levelCard}>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-end", flexWrap: "wrap", marginBottom: 10 }}>
                  <div style={{ flex: 2, minWidth: 180 }}>
                    <label style={miniLbl}>{T(`اسم المستوى ${i + 1}`, `Niveau ${i + 1}`)}</label>
                    <input style={inp} value={lv.name} placeholder={T("مثال: الأولى إعدادي", "Ex: 1ère année")} onChange={e => patchLevel(i, { name: e.target.value })} />
                  </div>
                  <div style={{ width: 160 }}>
                    <label style={miniLbl}>{config.logSplit === "class" ? T("صفحات لكل قسم", "Pages / classe") : T("صفحات لكل مستوى", "Pages / niveau")}</label>
                    <input type="number" min={1} max={40} style={inp} value={lv.logPages} onChange={e => patchLevel(i, { logPages: Number(e.target.value) })} />
                  </div>
                  {mode === "massar" && (
                    <label style={importBtn}>
                      📂 {T("استيراد مسار", "Importer Massar")}
                      <input type="file" accept=".xlsx,.xls" multiple style={{ display: "none" }} onChange={(e: ChangeEvent<HTMLInputElement>) => e.target.files?.length && importMassar(i, e.target.files)} />
                    </label>
                  )}
                </div>

                {mode === "massar" ? (
                  <>
                    {lv.classes.map((c, j) => (
                      <div key={"c" + j} style={classRow}>
                        <span style={{ fontWeight: 800, color: INK, fontSize: 13 }}>📋 {c.meta.className || "—"}</span>
                        <span style={{ fontSize: 12, color: "#64748B" }}>{c.students.length} {T("تلميذ", "élèves")}</span>
                        <button style={rmBtn} onClick={() => rmClass(i, j)}>✕</button>
                      </div>
                    ))}
                    {lv.classes.length === 0 && (
                      <div style={{ fontSize: 12, color: "#94A3B8", fontWeight: 600 }}>{T("ارفع ملف مسار لملء لائحة أسماء التلاميذ", "Importez un fichier Massar pour remplir la liste des élèves")}</div>
                    )}
                  </>
                ) : (
                  <>
                    {lv.blanks.map((b, j) => (
                      <div key={"b" + j} style={{ display: "flex", gap: 8, alignItems: "flex-end", marginTop: 6 }}>
                        <div style={{ flex: 2 }}>
                          <label style={miniLbl}>{T("اسم القسم (فارغ)", "Classe (vierge)")}</label>
                          <input style={inp} value={b.name} placeholder={T(`القسم ${j + 1}`, `Classe ${j + 1}`)} onChange={e => patchBlank(i, j, { name: e.target.value })} />
                        </div>
                        <div style={{ width: 110 }}>
                          <label style={miniLbl}>{T("عدد التلاميذ", "Nb élèves")}</label>
                          <input type="number" min={1} max={60} style={inp} value={b.count} onChange={e => patchBlank(i, j, { count: Number(e.target.value) })} />
                        </div>
                        <button style={rmBtn} onClick={() => rmBlank(i, j)}>✕</button>
                      </div>
                    ))}
                    <button style={addBlankBtn} onClick={() => addBlank(i)}>+ {T("إضافة قسم", "Ajouter une classe")}</button>
                  </>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Config */}
        <section style={cardStyle}>
          <h2 style={secTitle}><span>⚙️</span> {T("الإعدادات", "Paramètres")}</h2>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 14 }}>
            <Field label={T("المادة", "Matière")}><input style={inp} value={config.subject} onChange={e => setConfig(c => ({ ...c, subject: e.target.value }))} /></Field>
            <Field label={T("اسم الأستاذ(ة)", "Enseignant(e)")}><input style={inp} value={config.prof} onChange={e => setConfig(c => ({ ...c, prof: e.target.value }))} /></Field>
            <Field label={T("الموسم الدراسي", "Année scolaire")}><input style={inp} value={config.annee} placeholder="2025/2026" onChange={e => setConfig(c => ({ ...c, annee: e.target.value }))} /></Field>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Field label={T("المديرية (اختياري)", "Direction (option.)")}><input style={inp} value={config.directorate} onChange={e => setConfig(c => ({ ...c, directorate: e.target.value }))} /></Field>
            <Field label={T("الغلاف", "Couverture")}>
              <select style={inp} value={config.coverVariant} onChange={e => setConfig(c => ({ ...c, coverVariant: e.target.value as "male" | "female" }))}>
                <option value="male">{T("نسخة أنيقة", "Élégante")}</option>
                <option value="female">{T("نسخة ناعمة", "Douce")}</option>
              </select>
            </Field>
          </div>

          <div style={{ marginTop: 8, fontSize: 12.5, fontWeight: 800, color: "#334155", marginBottom: 8 }}>{T("الأقسام المُدرَجة في الدفتر", "Sections incluses")}</div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {([
              ["showIndex", T("الفهرس ودليل الأقسام", "Sommaire")],
              ["showCards", T("البطاقة الشخصية/المهنية", "Fiches perso/pro")],
              ["showHolidays", T("جدول العطل", "Calendrier des congés")],
              ["showLeaves", T("جدول الرخص", "Congés du personnel")],
              ["showStructure", T("البنية التربوية + جدول الحصص", "Structure + Emploi du temps")],
              ["showStudentLists", T("لوائح التلاميذ", "Listes d'élèves")],
            ] as const).map(([key, label]) => {
              const on = config[key];
              return (
                <button key={key} onClick={() => setConfig(c => ({ ...c, [key]: !c[key] }))}
                  style={{ padding: "8px 14px", borderRadius: 10, border: on ? `2px solid ${INDIGO}` : "1.5px solid #E2E8F0", background: on ? INDIGO_LIGHT : "#fff", color: on ? INK : "#64748B", fontWeight: 700, fontSize: 12.5, cursor: "pointer", fontFamily: "Cairo, sans-serif" }}>
                  {on ? "✓ " : ""}{label}
                </button>
              );
            })}
          </div>
        </section>

        {error && <div style={errStyle}>{error}</div>}

        <button style={{ ...dlBtn, opacity: ready && !loading ? 1 : 0.5, cursor: ready && !loading ? "pointer" : "not-allowed" }} disabled={!ready || loading} onClick={handleDownload}>
          {loading ? T("جارٍ الإنشاء...", "Génération...") : `⬇  ${T("تحميل دفتر النصوص PDF", "Télécharger le Cahier PDF")}`}
        </button>
        {!ready && !loading && (
          <div style={{ textAlign: "center", fontSize: 12.5, color: "#94A3B8", fontWeight: 600 }}>
            {T("أضف قسماً واحداً على الأقل (استيراد مسار أو قسم فارغ) لتفعيل التحميل", "Ajoutez au moins une classe (Massar ou vierge) pour activer le téléchargement")}
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div style={{ flex: 1, minWidth: 160 }}><label style={miniLbl}>{label}</label>{children}</div>;
}

/* Styles */
const pageStyle: CSSProperties = { minHeight: "100vh", backgroundColor: "#F8FAFC", fontFamily: "Cairo, system-ui, sans-serif", direction: "rtl" };
const navStyle: CSSProperties = { position: "sticky", top: 0, zIndex: 40, backgroundColor: "rgba(255,255,255,0.95)", backdropFilter: "blur(16px)", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" };
const navInner: CSSProperties = { maxWidth: 820, margin: "0 auto", padding: "0 24px", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between" };
const backLink: CSSProperties = { fontSize: 13, fontWeight: 600, color: "#64748B", textDecoration: "none" };
const navTitle: CSSProperties = { fontSize: 14, fontWeight: 900, color: INK };
const langBtn: CSSProperties = { display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: "28px 44px", borderRadius: 18, border: `2px solid #E2E8F0`, background: "#fff", cursor: "pointer", boxShadow: "0 4px 16px rgba(0,0,0,0.05)", fontFamily: "Cairo, sans-serif" };
const heroStyle: CSSProperties = { background: `linear-gradient(150deg, #1E1B4B 0%, ${INK} 55%, ${INDIGO} 100%)`, padding: "34px 24px 44px", textAlign: "center", color: "#fff" };
const heroPill: CSSProperties = { display: "inline-block", fontSize: 12, fontWeight: 700, color: "#C7D2FE", background: "rgba(199,210,254,0.12)", border: "1px solid rgba(199,210,254,0.25)", borderRadius: 999, padding: "5px 16px", marginBottom: 12 };
const h1Style: CSSProperties = { fontSize: 32, fontWeight: 900, margin: "0 0 6px" };
const heroDesc: CSSProperties = { fontSize: 13.5, color: "rgba(255,255,255,0.6)", margin: "0 0 14px" };
const changeLangBtn: CSSProperties = { fontSize: 12, fontWeight: 700, color: "#C7D2FE", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(199,210,254,0.3)", borderRadius: 999, padding: "6px 16px", cursor: "pointer", fontFamily: "Cairo, sans-serif" };
const bodyStyle: CSSProperties = { maxWidth: 820, margin: "-18px auto 0", padding: "0 24px 56px", display: "flex", flexDirection: "column", gap: 16 };
const cardStyle: CSSProperties = { backgroundColor: "#fff", borderRadius: 20, padding: "22px 24px", border: "1px solid #E2E8F0", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" };
const secTitle: CSSProperties = { fontSize: 16, fontWeight: 900, color: INK, margin: 0, display: "flex", alignItems: "center", gap: 8 };
const levelCard: CSSProperties = { border: "1.5px solid #E2E8F0", borderRadius: 14, padding: "14px 16px", background: "#FCFCFF" };
const classRow: CSSProperties = { display: "flex", alignItems: "center", gap: 12, padding: "8px 12px", borderRadius: 10, background: INDIGO_LIGHT, marginTop: 6 };
const miniLbl: CSSProperties = { display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 5 };
const inp: CSSProperties = { width: "100%", padding: "10px 12px", borderRadius: 10, border: "1.5px solid #E2E8F0", fontSize: 14, fontFamily: "Cairo, sans-serif", color: "#0F172A", outline: "none", backgroundColor: "#FAFBFC" };
const importBtn: CSSProperties = { display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 16px", borderRadius: 10, background: INK, color: "#fff", fontWeight: 800, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap" };
const addBlankBtn: CSSProperties = { marginTop: 10, padding: "7px 14px", borderRadius: 9, border: `1.5px dashed ${INDIGO}`, background: "#fff", color: INDIGO, fontWeight: 700, fontSize: 12.5, cursor: "pointer", fontFamily: "Cairo, sans-serif" };
const rmBtn: CSSProperties = { width: 26, height: 26, borderRadius: 8, border: "1px solid #FCA5A5", background: "#FEF2F2", color: "#DC2626", cursor: "pointer", fontSize: 12, flexShrink: 0, marginRight: "auto" };
const errStyle: CSSProperties = { padding: "10px 14px", borderRadius: 10, background: "#FEF2F2", color: "#DC2626", fontSize: 13, fontWeight: 600 };
const dlBtn: CSSProperties = { width: "100%", padding: "16px", borderRadius: 14, border: "none", background: `linear-gradient(135deg, ${INK}, ${INDIGO})`, color: "#fff", fontSize: 16, fontWeight: 900, fontFamily: "Cairo, sans-serif", boxShadow: "0 6px 20px rgba(67,56,202,0.25)" };
