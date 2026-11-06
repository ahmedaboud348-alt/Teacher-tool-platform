import type { PhysicsChemistryLevelId } from "./types";

export type Domain = "matter" | "electricity" | "light" | "mechanics";

export type SubjectTrack = "general" | "international";

export type UnitDefinition = {
  id: string;
  domain: Domain;
  domainLabel: string;
  levelId: PhysicsChemistryLevelId;
  competency: string;
  values: string[];
  prerequisites: string[];
  lessonIds: string[];
  track?: SubjectTrack; // undefined = general (Arabic)
};

// ── Competencies (one per domain, fixed across levels) ──

const COMPETENCY: Record<Domain, string> = {
  matter:
    "القدرة على التعبئة المندمجة لمجموعة من المعارف والطرائق والتقنيات والمواقف وغيرها (تتعلق بالخواص الفيزيائية والكيميائية للمادة وبالتحولات الفيزيائية والكيميائية والنماذج المعبرة عنها والقوانين التي تؤطرها)، لحل وضعيات مشاكل ترتبط باستعمال الموارد الطبيعية وترشيدها أو بالحفاظ على الصحة والبيئة.",
  electricity:
    "القدرة على التعبئة المندمجة لمجموعة من المعارف والطرائق والتقنيات والمواقف وغيرها (تتضمن خاصيات التيار والتوتر الكهربائيين، ووظيفة ثنائي قطب في دارة أو تركيب كهربائي، والطاقة الكهربائية والقدرة الكهربائية، وبأخطار التيار الكهربائي) لحل وضعيات مشاكل ترتبط بنقل الطاقة الكهربائية وترشيدها، وبسلامة الإنسان والأدوات الكهربائية المستعملة في المنزل.",
  light:
    "القدرة على التعبئة المندمجة لمجموعة من المعارف والطرائق والتقنيات والمواقف وغيرها (تتعلق بانتشار الضوء والظواهر المرافقة له، وكيفية اشتغال بعض الأجهزة البصرية وتطبيقاتها) لحل وضعيات مشاكل ترتبط بسلامة العين، وتقويم البصر، ونقل الضوء.",
  mechanics:
    "القدرة على التعبئة المندمجة لمجموعة من المعارف والطرائق والتقنيات والمواقف وغيرها (تتعلق بمفهوم الحركة وتمييزها، وبالقوانين المؤطرة لها، وبالتأثيرات الميكانيكية المطبقة على مجموعة في حركة أو في توازن، وبأخطار السرعة)، لحل وضعيات مشاكل ترتبط بتنظيم الأشياء في المحيط، والحفاظ على صحة الجسم، وسلامة الإنسان.",
};

// ── Values (per domain) ──

const VALUES: Record<Domain, string[]> = {
  matter: [
    "تكريس حب المعرفة وطلب العلم والبحث والاكتشاف",
    "إعمال العقل واعتماد الفكر النقدي",
    "احترام البيئة الطبيعية والتعامل الإيجابي مع الثقافة الشعبية والموروث الثقافي والحضاري المغربي",
    "الإنتاجية والمردودية",
    "التفتح على مكاسب ومنجزات الحضارة الإنسانية المعاصرة",
    "المساهمة في تطوير العلوم والتكنولوجيا الجديدة",
    "تنمية القدرة على المشاركة الإيجابية في الشأن المحلي والوطني",
  ],
  electricity: [
    "تنمية الوعي بالواجبات والحقوق",
    "التحلي بروح المسؤولية والانضباط",
    "الاستقلالية في التفكير والممارسة",
    "المساهمة في تطوير العلوم والتكنولوجيا الجديدة",
    "تكريس حب المعرفة وطلب العلم والبحث والاكتشاف",
    "المبادرة والابتكار والإبداع",
    "الوعي بالزمن والوقت كقيمة أساسية في المدرسة وفي الحياة",
  ],
  light: [
    "تكريس حب المعرفة وطلب العلم والبحث والاكتشاف",
    "إعمال العقل واعتماد الفكر النقدي",
    "التفتح على مكاسب ومنجزات الحضارة الإنسانية المعاصرة",
    "تنمية الذوق الجمالي والإنتاج الفني والتكوين الحرفي في مجالات الفنون والتقنيات",
    "المساهمة في تطوير العلوم والتكنولوجيا الجديدة",
    "الثقة بالنفس والتفتح على الغير",
    "التفتح على التكوين المهني المستمر",
  ],
  mechanics: [
    "التحلي بروح المسؤولية والانضباط",
    "تنمية الوعي بالواجبات والحقوق",
    "إعمال العقل واعتماد الفكر النقدي",
    "تكريس حب المعرفة وطلب العلم والبحث والاكتشاف",
    "التنافسية الإيجابية",
    "تثمين العمل والاجتهاد والمثابرة",
    "التفاعل الإيجابي مع المحيط الاجتماعي على اختلاف مستوياته",
  ],
};

// ── Domain labels ──

const DOMAIN_LABEL: Record<Domain, string> = {
  matter: "المادة",
  electricity: "الكهرباء",
  light: "الضوء",
  mechanics: "الميكانيك",
};

// ── Unit definitions ──

export const UNIT_CATALOG: UnitDefinition[] = [
  // ═══════════════ الأولى إعدادي ═══════════════
  {
    id: "1ac-matter",
    domain: "matter",
    domainLabel: DOMAIN_LABEL.matter,
    levelId: "1ac",
    competency: COMPETENCY.matter,
    values: VALUES.matter,
    prerequisites: [
      "حالات المادة الثلاث (صلبة، سائلة، غازية)",
      "الماء في الطبيعة ودورته",
      "مفهوم الكتلة والحجم",
    ],
    lessonIds: [
      "pc-1ac-general-water",
      "pc-1ac-general-physical-transformations",
      "pc-1ac-general-mixtures",
      "pc-1ac-general-water-treatment",
    ],
  },
  {
    id: "1ac-electricity",
    domain: "electricity",
    domainLabel: DOMAIN_LABEL.electricity,
    levelId: "1ac",
    competency: COMPETENCY.electricity,
    values: VALUES.electricity,
    prerequisites: [
      "استعمالات الكهرباء",
      "بعض طرق إنتاج الطاقة الكهربائية",
      "مفهوم الدارة الكهربائية",
    ],
    lessonIds: [
      "pc-1ac-general-electricity-around-us",
      "pc-1ac-general-simple-electric-circuit",
      "pc-1ac-general-electrical-installations",
      "pc-1ac-general-direct-current",
      "pc-1ac-general-resistance-effect",
      "pc-1ac-general-nodes-law",
      "pc-1ac-general-electrical-safety",
    ],
  },

  // ═══════════════ الثانية إعدادي ═══════════════
  {
    id: "2ac-matter",
    domain: "matter",
    domainLabel: DOMAIN_LABEL.matter,
    levelId: "2ac",
    competency: COMPETENCY.matter,
    values: VALUES.matter,
    prerequisites: [
      "الحالات الفيزيائية للمادة والتحولات بينها",
      "مفهوم الجسم الخالص والخليط",
      "تقنيات فصل الخلائط (الترشيح، التقطير)",
      "معالجة المياه وتلوثها",
    ],
    lessonIds: [
      "pc-2ac-general-air-around-us",
      "pc-2ac-general-air-properties-components",
      "pc-2ac-general-molecules-atoms",
      "pc-2ac-general-combustion",
      "pc-2ac-general-chemical-reaction-concept",
      "pc-2ac-general-chemical-reaction-laws",
      "pc-2ac-general-natural-industrial-materials",
      "pc-2ac-general-air-pollution",
    ],
  },
  {
    id: "2ac-light",
    domain: "light",
    domainLabel: DOMAIN_LABEL.light,
    levelId: "2ac",
    competency: COMPETENCY.light,
    values: VALUES.light,
    prerequisites: [
      "مصادر الضوء الطبيعية والاصطناعية",
      "الرؤية والعين كمستقبل للضوء",
      "الظل والنور",
    ],
    lessonIds: [
      "pc-2ac-general-light-around-us",
      "pc-2ac-general-light-sources-receptors",
      "pc-2ac-general-light-colors-dispersion",
      "pc-2ac-general-light-propagation",
      "pc-2ac-general-rectilinear-propagation-applications",
      "pc-2ac-general-thin-lenses",
      "pc-2ac-general-optical-instruments",
    ],
  },
  {
    id: "2ac-electricity",
    domain: "electricity",
    domainLabel: DOMAIN_LABEL.electricity,
    levelId: "2ac",
    competency: COMPETENCY.electricity,
    values: VALUES.electricity,
    prerequisites: [
      "عناصر الدارة الكهربائية البسيطة ورموزها",
      "التركيب على التوالي والتوازي",
      "التيار الكهربائي المستمر وخاصياته (الشدة والتوتر)",
      "المقاومة الكهربائية وتأثيرها",
      "قانون العقد وقانون إضافية التوترات",
      "الوقاية من أخطار التيار الكهربائي",
    ],
    lessonIds: [
      "pc-2ac-general-alternating-current",
      "pc-2ac-general-home-electrical-installation",
    ],
  },

  // ═══════════════ الثالثة إعدادي ═══════════════
  {
    id: "3ac-matter",
    domain: "matter",
    domainLabel: DOMAIN_LABEL.matter,
    levelId: "3ac",
    competency: COMPETENCY.matter,
    values: VALUES.matter,
    prerequisites: [
      "مكونات الهواء وخصائصه",
      "الجزيئات والذرات والرموز الكيميائية",
      "الاحتراقات والتحولات الكيميائية",
      "مفهوم التفاعل الكيميائي وقوانينه",
      "المواد الطبيعية والصناعية",
    ],
    lessonIds: [
      "pc-3ac-general-materials-daily-life",
      "pc-3ac-general-atom-electricity",
      "pc-3ac-general-oxidation-air",
      "pc-3ac-general-reactions-solutions",
      "pc-3ac-general-environment-risk",
    ],
  },
  {
    id: "3ac-mechanics",
    domain: "mechanics",
    domainLabel: DOMAIN_LABEL.mechanics,
    levelId: "3ac",
    competency: COMPETENCY.mechanics,
    values: VALUES.mechanics,
    prerequisites: [
      "مفهوم المسافة والزمن",
      "وحدات القياس (المتر، الثانية، الكيلوغرام)",
      "مفاهيم أولية حول الحركة من الحياة اليومية",
    ],
    lessonIds: [
      "pc-3ac-general-motion-rest",
      "pc-3ac-general-mechanical-forces",
      "pc-3ac-general-force-concept",
      "pc-3ac-general-equilibrium-forces",
      "pc-3ac-general-weight-mass",
    ],
  },
  {
    id: "3ac-electricity",
    domain: "electricity",
    domainLabel: DOMAIN_LABEL.electricity,
    levelId: "3ac",
    competency: COMPETENCY.electricity,
    values: VALUES.electricity,
    prerequisites: [
      "الدارة الكهربائية وأنواع التراكيب",
      "شدة التيار والتوتر الكهربائيين ووحداتهما",
      "المقاومة الكهربائية",
      "قانون العقد وقانون إضافية التوترات",
      "التيار المتناوب الجيبي ومميزاته",
      "التركيب الكهربائي المنزلي والوقاية من أخطاره",
    ],
    lessonIds: [
      "pc-3ac-general-ohm-law",
      "pc-3ac-general-electric-power",
      "pc-3ac-general-electric-energy",
    ],
  },
];

export const LEVEL_LABELS: Record<PhysicsChemistryLevelId, string> = {
  "1ac": "الأولى إعدادي",
  "2ac": "الثانية إعدادي",
  "3ac": "الثالثة إعدادي",
};

// ═══════════════════════════════════════════════════════════════════════════
//  International track (French) — same domain structure, French framework texts
//  and the French international lesson catalogue.
// ═══════════════════════════════════════════════════════════════════════════

export const LEVEL_LABELS_FR: Record<PhysicsChemistryLevelId, string> = {
  "1ac": "1ère année collège",
  "2ac": "2ème année collège",
  "3ac": "3ème année collège",
};

const DOMAIN_LABEL_FR: Record<Domain, string> = {
  matter: "Matière",
  electricity: "Électricité",
  light: "Lumière",
  mechanics: "Mécanique",
};

const COMPETENCY_FR: Record<Domain, string> = {
  matter:
    "Capacité à mobiliser de manière intégrée un ensemble de savoirs, méthodes, techniques et attitudes (relatifs aux propriétés physiques et chimiques de la matière, aux transformations physiques et chimiques, aux modèles qui les décrivent et aux lois qui les régissent) pour résoudre des situations-problèmes liées à l'utilisation et à la gestion rationnelle des ressources naturelles, ou à la préservation de la santé et de l'environnement.",
  electricity:
    "Capacité à mobiliser de manière intégrée un ensemble de savoirs, méthodes, techniques et attitudes (portant sur les propriétés du courant et de la tension électriques, le rôle d'un dipôle dans un circuit ou une installation électrique, l'énergie et la puissance électriques, et les dangers du courant électrique) pour résoudre des situations-problèmes liées au transport et à la gestion rationnelle de l'énergie électrique, et à la sécurité des personnes et des appareils électriques domestiques.",
  light:
    "Capacité à mobiliser de manière intégrée un ensemble de savoirs, méthodes, techniques et attitudes (relatifs à la propagation de la lumière et aux phénomènes qui l'accompagnent, ainsi qu'au fonctionnement de certains instruments optiques et à leurs applications) pour résoudre des situations-problèmes liées à la protection de l'œil, à la correction de la vue et à la transmission de la lumière.",
  mechanics:
    "Capacité à mobiliser de manière intégrée un ensemble de savoirs, méthodes, techniques et attitudes (relatifs à la notion de mouvement et à sa caractérisation, aux lois qui le régissent, aux actions mécaniques exercées sur un système en mouvement ou en équilibre, et aux dangers de la vitesse) pour résoudre des situations-problèmes liées à l'organisation des objets dans l'environnement, à la préservation de la santé du corps et à la sécurité des personnes.",
};

const VALUES_FR: Record<Domain, string[]> = {
  matter: [
    "Cultiver l'amour du savoir, la recherche et la découverte",
    "Exercer la raison et adopter l'esprit critique",
    "Respecter l'environnement naturel et valoriser le patrimoine culturel et civilisationnel marocain",
    "La productivité et le rendement",
    "L'ouverture sur les acquis de la civilisation humaine contemporaine",
    "Contribuer au développement des sciences et des nouvelles technologies",
    "Développer la capacité de participation positive aux affaires locales et nationales",
  ],
  electricity: [
    "Développer la conscience des devoirs et des droits",
    "Faire preuve de responsabilité et de discipline",
    "L'autonomie dans la pensée et la pratique",
    "Contribuer au développement des sciences et des nouvelles technologies",
    "Cultiver l'amour du savoir, la recherche et la découverte",
    "L'initiative, l'innovation et la créativité",
    "La conscience du temps comme valeur essentielle à l'école et dans la vie",
  ],
  light: [
    "Cultiver l'amour du savoir, la recherche et la découverte",
    "Exercer la raison et adopter l'esprit critique",
    "L'ouverture sur les acquis de la civilisation humaine contemporaine",
    "Développer le goût esthétique et la production artistique",
    "Contribuer au développement des sciences et des nouvelles technologies",
    "La confiance en soi et l'ouverture sur autrui",
    "L'ouverture sur la formation professionnelle continue",
  ],
  mechanics: [
    "Faire preuve de responsabilité et de discipline",
    "Développer la conscience des devoirs et des droits",
    "Exercer la raison et adopter l'esprit critique",
    "Cultiver l'amour du savoir, la recherche et la découverte",
    "La compétitivité positive",
    "Valoriser le travail, l'effort et la persévérance",
    "L'interaction positive avec l'environnement social à ses différents niveaux",
  ],
};

const intUnit = (
  domain: Domain,
  levelId: PhysicsChemistryLevelId,
  prerequisites: string[],
  lessonIds: string[]
): UnitDefinition => ({
  id: `${levelId}-${domain}-int`,
  domain,
  domainLabel: DOMAIN_LABEL_FR[domain],
  levelId,
  competency: COMPETENCY_FR[domain],
  values: VALUES_FR[domain],
  prerequisites,
  lessonIds,
  track: "international",
});

export const UNIT_CATALOG_INTERNATIONAL: UnitDefinition[] = [
  // ─────────── 1AC ───────────
  intUnit("matter", "1ac",
    ["Les trois états de la matière (solide, liquide, gazeux)", "L'eau dans la nature et son cycle", "Les notions de masse et de volume"],
    ["pc-1ac-int-water", "pc-1ac-int-physical-transformations", "pc-1ac-int-mixtures", "pc-1ac-int-water-treatment"]),
  intUnit("electricity", "1ac",
    ["Les utilisations de l'électricité", "Quelques modes de production de l'énergie électrique", "La notion de circuit électrique"],
    ["pc-1ac-int-electricity-around-us", "pc-1ac-int-simple-electric-circuit", "pc-1ac-int-electrical-connections", "pc-1ac-int-direct-current", "pc-1ac-int-resistance-effect", "pc-1ac-int-nodes-law", "pc-1ac-int-electrical-safety"]),
  // ─────────── 2AC ───────────
  intUnit("matter", "2ac",
    ["Les états physiques de la matière et les transformations entre eux", "Les notions de corps pur et de mélange", "Les techniques de séparation des mélanges (filtration, distillation)", "Le traitement et la pollution de l'eau"],
    ["pc-2ac-int-air-around-us", "pc-2ac-int-air-properties-components", "pc-2ac-int-molecules-atoms", "pc-2ac-int-combustion", "pc-2ac-int-chemical-reaction-concept", "pc-2ac-int-chemical-reaction-laws", "pc-2ac-int-natural-industrial-materials", "pc-2ac-int-air-pollution"]),
  intUnit("light", "2ac",
    ["Les sources de lumière naturelles et artificielles", "La vision et l'œil comme récepteur de lumière", "L'ombre et la lumière"],
    ["pc-2ac-int-light-around-us", "pc-2ac-int-light-sources-receptors", "pc-2ac-int-light-colors-dispersion", "pc-2ac-int-light-propagation", "pc-2ac-int-rectilinear-propagation-applications", "pc-2ac-int-thin-lenses", "pc-2ac-int-optical-instruments"]),
  intUnit("electricity", "2ac",
    ["Les éléments du circuit électrique simple et leurs symboles", "Les montages en série et en dérivation", "Le courant électrique continu et ses propriétés (intensité et tension)", "La résistance électrique et son effet", "La loi des nœuds et la loi d'additivité des tensions", "La prévention des dangers du courant électrique"],
    ["pc-2ac-int-alternating-current", "pc-2ac-int-home-electrical-installation"]),
  // ─────────── 3AC ───────────
  intUnit("matter", "3ac",
    ["Les composants de l'air et ses propriétés", "Les molécules, les atomes et les symboles chimiques", "Les combustions et les transformations chimiques", "La notion de réaction chimique et ses lois", "Les matériaux naturels et industriels"],
    ["pc-3ac-int-materials-daily-life", "pc-3ac-int-atom-electricity", "pc-3ac-int-oxidation-air", "pc-3ac-int-reactions-solutions", "pc-3ac-int-environment-risk"]),
  intUnit("mechanics", "3ac",
    ["Les notions de distance et de temps", "Les unités de mesure (mètre, seconde, kilogramme)", "Des notions préliminaires sur le mouvement issues de la vie quotidienne"],
    ["pc-3ac-int-motion-rest", "pc-3ac-int-mechanical-forces", "pc-3ac-int-force-concept", "pc-3ac-int-equilibrium-forces", "pc-3ac-int-weight-mass"]),
  intUnit("electricity", "3ac",
    ["Le circuit électrique et les types de montages", "L'intensité du courant et la tension électriques et leurs unités", "La résistance électrique", "La loi des nœuds et la loi d'additivité des tensions", "Le courant alternatif sinusoïdal et ses caractéristiques", "L'installation électrique domestique et la prévention de ses dangers"],
    ["pc-3ac-int-ohm-law", "pc-3ac-int-electric-power", "pc-3ac-int-electric-energy"]),
];

export function getUnitsForLevel(levelId: PhysicsChemistryLevelId, track: SubjectTrack = "general"): UnitDefinition[] {
  const catalog = track === "international" ? UNIT_CATALOG_INTERNATIONAL : UNIT_CATALOG;
  return catalog.filter(u => u.levelId === levelId);
}

export function levelLabel(levelId: PhysicsChemistryLevelId, track: SubjectTrack = "general"): string {
  return track === "international" ? LEVEL_LABELS_FR[levelId] : LEVEL_LABELS[levelId];
}
