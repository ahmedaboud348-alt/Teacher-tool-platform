import type { PhysicsChemistryLevelId } from "./types";

export type Domain = "matter" | "electricity" | "light" | "mechanics";

export type UnitDefinition = {
  id: string;
  domain: Domain;
  domainLabel: string;
  levelId: PhysicsChemistryLevelId;
  competency: string;
  values: string[];
  prerequisites: string[];
  lessonIds: string[];
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

export function getUnitsForLevel(levelId: PhysicsChemistryLevelId): UnitDefinition[] {
  return UNIT_CATALOG.filter(u => u.levelId === levelId);
}
