const fs = require("fs");
const path = require("path");

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log("Created dir:", dirPath);
  }
}

function createFile(filePath, content = "") {
  const dir = path.dirname(filePath);
  ensureDir(dir);

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log("Created file:", filePath);
  } else {
    console.log("Skipped existing file:", filePath);
  }
}

const files = {
  "package.json": `{
  "name": "teacher-tools-platform",
  "private": true,
  "version": "0.1.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
`,
  "tsconfig.json": `{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "es2020"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
`,
  "next.config.ts": `const nextConfig = {};

export default nextConfig;
`,
  ".gitignore": `node_modules
.next
dist
coverage
.env
.env.local
.DS_Store
`,
  "README.md": `# Teacher Tools Platform
`,
  "app/layout.tsx": `import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
`,
  "app/page.tsx": `export default function HomePage() {
  return <main>Home Page</main>;
}
`,
  "app/login/page.tsx": `export default function LoginPage() {
  return <main>Login Page</main>;
}
`,
  "app/register/page.tsx": `export default function RegisterPage() {
  return <main>Register Page</main>;
}
`,
  "app/dashboard/page.tsx": `export default function DashboardPage() {
  return <main>Dashboard Page</main>;
}
`,
  "app/choose-level/page.tsx": `export default function ChooseLevelPage() {
  return <main>Choose Level Page</main>;
}
`,
  "app/tools/page.tsx": `export default function ToolsPage() {
  return <main>Tools Page</main>;
}
`,
  "app/tools/exam-sheet/page.tsx": `import ExamSheetTool from "@/tools/exam-sheet/ExamSheetTool";

export default function ExamSheetToolPage() {
  return <ExamSheetTool />;
}
`,
  "app/settings/page.tsx": `export default function SettingsPage() {
  return <main>Settings Page</main>;
}
`,
  "components/layout/AppShell.tsx": `import type { ReactNode } from "react";

export default function AppShell({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}
`,
  "components/layout/DashboardLayout.tsx": `import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <section>{children}</section>;
}
`,
  "components/layout/ToolPageLayout.tsx": `import type { ReactNode } from "react";

export default function ToolPageLayout({ children }: { children: ReactNode }) {
  return <section>{children}</section>;
}
`,
  "components/shared/Button.tsx": `import type { ButtonHTMLAttributes } from "react";

export default function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props} />;
}
`,
  "components/shared/Card.tsx": `import type { ReactNode } from "react";

export default function Card({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}
`,
  "components/shared/Input.tsx": `import type { InputHTMLAttributes } from "react";

export default function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} />;
}
`,
  "components/shared/Badge.tsx": `import type { ReactNode } from "react";

export default function Badge({ children }: { children: ReactNode }) {
  return <span>{children}</span>;
}
`,
  "components/shared/Notice.tsx": `import type { ReactNode } from "react";

export default function Notice({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}
`,
  "components/shared/Dialog.tsx": `import type { ReactNode } from "react";

export default function Dialog({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}
`,
  "lib/auth/index.ts": `export * from "./session";
export * from "./guards";
export * from "./permissions";
`,
  "lib/auth/session.ts": `export type SessionContext = {
  teacherId?: string;
  selectedLevelId?: string;
};
`,
  "lib/auth/guards.ts": `export function canAccessTool(): boolean {
  return true;
}
`,
  "lib/auth/permissions.ts": `export type ToolPermission = "exam-sheet";
`,
  "lib/calculations/exam-sheet/index.ts": `export { calculateExamSheet } from "./calculateExamSheet";
export type {
  ExamSheetCalculationInput,
  ExamSheetCalculationResult
} from "./types";
`,
  "lib/calculations/exam-sheet/types.ts": `export type ExamSheetCalculationInput = {
  totalPoints: number;
  roundingStep: number;
  lessons: {
    id: string;
    label: string;
    hours: number;
  }[];
  skills: {
    id: string;
    label: string;
    percentage: number;
  }[];
};

export type ExamSheetCalculationRow = {
  lessonEntryId: string;
  lessonLabel: string;
  hours: number;
  percentage: number;
  points: number;
  rawPoints: number;
  lessonAdjustment: number;
  skills: number[];
  rawSkills: number[];
  skillAdjustments: number[];
};

export type ExamSheetCalculationResult = {
  rows: ExamSheetCalculationRow[];
  totalHours: number;
  lessonPointTotal: number;
  totalsBySkill: number[];
  percentageTotal: number;
  columnTargetPoints: number[];
  balanceSummary: {
    adjustedCells: number;
    maxAdjustment: number;
    totalAbsoluteAdjustment: number;
  };
};
`,
  "lib/calculations/exam-sheet/validate.ts": `import type { ExamSheetCalculationInput } from "./types";

export function validateExamSheetInput(input: ExamSheetCalculationInput): void {
  if (input.totalPoints <= 0) throw new Error("Invalid totalPoints");
  if (input.roundingStep <= 0) throw new Error("Invalid roundingStep");
  if (!input.lessons.length) throw new Error("Lessons are required");
  if (!input.skills.length) throw new Error("Skills are required");
}
`,
  "lib/calculations/exam-sheet/units.ts": `export function toUnits(value: number, step: number): number {
  return Math.round(value / step);
}

export function fromUnits(units: number, step: number): number {
  return units * step;
}
`,
  "lib/calculations/exam-sheet/balanceMatrix.ts": `export function balanceMatrix(): number[][] {
  return [];
}
`,
  "lib/calculations/exam-sheet/integrity.ts": `export function assertCalculationIntegrity(): void {
  return;
}
`,
  "lib/calculations/exam-sheet/calculateExamSheet.ts": `import { validateExamSheetInput } from "./validate";
import type { ExamSheetCalculationInput, ExamSheetCalculationResult } from "./types";

export function calculateExamSheet(
  input: ExamSheetCalculationInput
): ExamSheetCalculationResult {
  validateExamSheetInput(input);

  return {
    rows: [],
    totalHours: 0,
    lessonPointTotal: 0,
    totalsBySkill: [],
    percentageTotal: 0,
    columnTargetPoints: [],
    balanceSummary: {
      adjustedCells: 0,
      maxAdjustment: 0,
      totalAbsoluteAdjustment: 0
    }
  };
}
`,
  "lib/exporters/exam-sheet/index.ts": `export { renderExamSheetPdf } from "./pdf/render-exam-sheet-pdf";
export { renderExamSheetDocx } from "./docx/render-exam-sheet-docx";
export { buildExamSheetExportLayout } from "./build-exam-sheet-layout";
`,
  "lib/exporters/exam-sheet/types.ts": `export type ExportDirection = "rtl" | "ltr";

export type ExamSheetExportLayout = {
  meta: {
    direction: ExportDirection;
    title: string;
  };
  sections: Array<{
    kind: string;
    data: unknown;
  }>;
};
`,
  "lib/exporters/exam-sheet/labels.ts": `export function getExportLabels(track: "general" | "international") {
  return track === "general"
    ? { title: "وثيقة الامتحان" }
    : { title: "Document d examen" };
}
`,
  "lib/exporters/exam-sheet/direction.ts": `export function getExportDirection(track: "general" | "international"): "rtl" | "ltr" {
  return track === "general" ? "rtl" : "ltr";
}
`,
  "lib/exporters/exam-sheet/formatting.ts": `export function formatExportNumber(value: number): string {
  return String(value);
}
`,
  "lib/exporters/exam-sheet/build-exam-sheet-layout.ts": `import type { ExamSheetExportLayout } from "./types";

export function buildExamSheetExportLayout(model: {
  meta: { title: string; direction: "rtl" | "ltr" };
}): ExamSheetExportLayout {
  return {
    meta: {
      direction: model.meta.direction,
      title: model.meta.title
    },
    sections: []
  };
}
`,
  "lib/exporters/exam-sheet/pdf/render-exam-sheet-pdf.ts": `export async function renderExamSheetPdf(): Promise<Uint8Array> {
  return new Uint8Array();
}
`,
  "lib/exporters/exam-sheet/docx/render-exam-sheet-docx.ts": `export async function renderExamSheetDocx(): Promise<Uint8Array> {
  return new Uint8Array();
}
`,
  "lib/levels/index.ts": `export * from "./levels";
export * from "./helpers";
`,
  "lib/levels/levels.ts": `export const LEVELS = [];
`,
  "lib/levels/helpers.ts": `export function isAllowedLevel(): boolean {
  return true;
}
`,
  "lib/tracks/index.ts": `export * from "./tracks";
export * from "./helpers";
`,
  "lib/tracks/tracks.ts": `export const TRACKS = [
  { id: "general", direction: "rtl" },
  { id: "international", direction: "ltr" }
];
`,
  "lib/tracks/helpers.ts": `export function getTrackDirection(track: "general" | "international"): "rtl" | "ltr" {
  return track === "general" ? "rtl" : "ltr";
}
`,
  "lib/payments/index.ts": `export * from "./types";
`,
  "lib/payments/types.ts": `export type PaymentTransaction = {
  id: string;
  amount: number;
};
`,
  "lib/storage/index.ts": `export * from "./draft-repository";
`,
  "lib/storage/draft-repository.ts": `export async function saveDraft(): Promise<void> {
  return;
}
`,
  "lib/subjects/index.ts": `export * from "./physics-chemistry";
`,
  "lib/subjects/physics-chemistry/index.ts": `export * from "./lesson-catalog";
export * from "./objectives";
export * from "./default-skills";
`,
  "lib/subjects/physics-chemistry/lesson-catalog.ts": `export const PHYSICS_CHEMISTRY_LESSONS = [];
`,
  "lib/subjects/physics-chemistry/objectives.ts": `export const PHYSICS_CHEMISTRY_OBJECTIVES = [];
`,
  "lib/subjects/physics-chemistry/default-skills.ts": `export const PHYSICS_CHEMISTRY_DEFAULT_SKILLS = [];
`,
  "lib/types/account.types.ts": `export type TeacherAccount = {
  id: string;
  fullName: string;
  subjectId: string;
};
`,
  "lib/types/subscription.types.ts": `export type TeacherSubscription = {
  id: string;
  teacherId: string;
};
`,
  "lib/types/level.types.ts": `export type LevelId = string;
`,
  "lib/types/track.types.ts": `export type TrackId = "general" | "international";
`,
  "lib/types/subject.types.ts": `export type SubjectId = string;
`,
  "lib/types/lesson.types.ts": `export type LessonId = string;
`,
  "lib/types/skill.types.ts": `export type SkillId = string;
`,
  "lib/types/exam-sheet/exam-sheet-draft.types.ts": `export type ExamSheetDraft = {
  meta: {
    title: string;
    institutionName: string;
    teacherName: string;
    subjectId: string;
    subjectLabel: string;
    levelId: string;
    levelLabel: string;
    track: "general" | "international";
    totalPoints: number;
    roundingStep: number;
  };
  lessons: Array<{
    id: string;
    referenceLessonId?: string | null;
    label: string;
    hours: number;
    objectives: Array<{
      id: string;
      text: string;
      source: "reference" | "custom";
    }>;
    source: "catalog" | "custom";
    order: number;
  }>;
  skills: Array<{
    id: string;
    label: string;
    percentage: number;
    order: number;
  }>;
  ui: {
    selectedLessonIdForFocus?: string | null;
    expandedSectionIds: string[];
    touched: boolean;
  };
};
`,
  "lib/types/exam-sheet/exam-sheet-calculation.types.ts": `export type { ExamSheetCalculationInput } from "@/lib/calculations/exam-sheet";
`,
  "lib/types/exam-sheet/exam-sheet-result.types.ts": `export type { ExamSheetCalculationResult } from "@/lib/calculations/exam-sheet";
`,
  "lib/types/exam-sheet/exam-sheet-document.types.ts": `export type ExamSheetDocumentModel = {
  meta: {
    title: string;
    institutionName: string;
    teacherName: string;
    subjectLabel: string;
    levelLabel: string;
    track: "general" | "international";
    direction: "rtl" | "ltr";
    totalPoints: number;
    roundingStep: number;
    examDurationMinutes?: number | null;
    semesterLabel?: string;
    notes?: string;
  };
  lessonEntries: Array<{
    id: string;
    label: string;
    hours: number;
    objectives: Array<{
      id: string;
      text: string;
    }>;
  }>;
  allocation: {
    skills: Array<{
      id: string;
      label: string;
    }>;
    rows: Array<{
      lessonId: string;
      lessonLabel: string;
      lessonPercentage: number;
      lessonPoints: number;
      cells: Array<{
        skillId: string;
        value: number;
      }>;
    }>;
    columnTotals: Array<{
      skillId: string;
      value: number;
    }>;
    globalTotal: number;
  };
};
`,
  "tools/exam-sheet/index.ts": `export { default } from "./ExamSheetTool";
`,
  "tools/exam-sheet/ExamSheetTool.tsx": `import ExamSheetPageHeader from "./components/ExamSheetPageHeader";
import ExamSheetWorkspace from "./components/ExamSheetWorkspace";

export default function ExamSheetTool() {
  return (
    <main>
      <ExamSheetPageHeader />
      <ExamSheetWorkspace />
    </main>
  );
}
`,
  "tools/exam-sheet/hooks/useExamSheetDraft.ts": `export function useExamSheetDraft() {
  return {};
}
`,
  "tools/exam-sheet/hooks/useExamSheetCalculation.ts": `export function useExamSheetCalculation() {
  return null;
}
`,
  "tools/exam-sheet/hooks/useExamSheetDocument.ts": `export function useExamSheetDocument() {
  return null;
}
`,
  "tools/exam-sheet/hooks/useLessonSuggestions.ts": `export function useLessonSuggestions() {
  return [];
}
`,
  "tools/exam-sheet/components/ExamSheetPageHeader.tsx": `export default function ExamSheetPageHeader() {
  return <header>Exam Sheet Generator</header>;
}
`,
  "tools/exam-sheet/components/ExamSheetWorkspace.tsx": `export default function ExamSheetWorkspace() {
  return <section>Exam Sheet Workspace</section>;
}
`,
  "tools/exam-sheet/components/ExamMetadataSection.tsx": `export default function ExamMetadataSection() {
  return <section>Exam Metadata Section</section>;
}
`,
  "tools/exam-sheet/components/TrackSection.tsx": `export default function TrackSection() {
  return <section>Track Section</section>;
}
`,
  "tools/exam-sheet/components/LessonsSection.tsx": `export default function LessonsSection() {
  return <section>Lessons Section</section>;
}
`,
  "tools/exam-sheet/components/SkillsSection.tsx": `export default function SkillsSection() {
  return <section>Skills Section</section>;
}
`,
  "tools/exam-sheet/components/CalculationSummarySection.tsx": `export default function CalculationSummarySection() {
  return <section>Calculation Summary Section</section>;
}
`,
  "tools/exam-sheet/components/LessonRowEditor.tsx": `export default function LessonRowEditor() {
  return <div>Lesson Row Editor</div>;
}
`,
  "tools/exam-sheet/components/LessonAutocomplete.tsx": `export default function LessonAutocomplete() {
  return <div>Lesson Autocomplete</div>;
}
`,
  "tools/exam-sheet/components/ObjectivesEditor.tsx": `export default function ObjectivesEditor() {
  return <div>Objectives Editor</div>;
}
`,
  "tools/exam-sheet/components/SkillPercentageEditor.tsx": `export default function SkillPercentageEditor() {
  return <div>Skill Percentage Editor</div>;
}
`,
  "tools/exam-sheet/components/PreviewPanel.tsx": `export default function PreviewPanel() {
  return <section>Preview Panel</section>;
}
`,
  "tools/exam-sheet/components/PreviewSectionRenderer.tsx": `export default function PreviewSectionRenderer() {
  return <div>Preview Section Renderer</div>;
}
`,
  "tools/exam-sheet/components/PreviewMetadataBlock.tsx": `export default function PreviewMetadataBlock() {
  return <div>Preview Metadata Block</div>;
}
`,
  "tools/exam-sheet/components/PreviewLessonsTable.tsx": `export default function PreviewLessonsTable() {
  return <div>Preview Lessons Table</div>;
}
`,
  "tools/exam-sheet/components/PreviewAllocationTable.tsx": `export default function PreviewAllocationTable() {
  return <div>Preview Allocation Table</div>;
}
`,
  "tools/exam-sheet/components/PreviewObjectivesBlock.tsx": `export default function PreviewObjectivesBlock() {
  return <div>Preview Objectives Block</div>;
}
`,
  "tools/exam-sheet/components/PreviewSummaryBlock.tsx": `export default function PreviewSummaryBlock() {
  return <div>Preview Summary Block</div>;
}
`,
  "tools/exam-sheet/components/DraftActionsBar.tsx": `export default function DraftActionsBar() {
  return <div>Draft Actions Bar</div>;
}
`,
  "tools/exam-sheet/components/ValidationNotice.tsx": `export default function ValidationNotice() {
  return <div>Validation Notice</div>;
}
`,
  "tools/exam-sheet/mappers/draftToCalculationInput.ts": `import type { ExamSheetDraft } from "@/lib/types/exam-sheet/exam-sheet-draft.types";
import type { ExamSheetCalculationInput } from "@/lib/calculations/exam-sheet";

export function draftToCalculationInput(
  draft: ExamSheetDraft
): ExamSheetCalculationInput {
  return {
    totalPoints: draft.meta.totalPoints,
    roundingStep: draft.meta.roundingStep,
    lessons: draft.lessons.map((lesson) => ({
      id: lesson.id,
      label: lesson.label,
      hours: lesson.hours
    })),
    skills: draft.skills.map((skill) => ({
      id: skill.id,
      label: skill.label,
      percentage: skill.percentage
    }))
  };
}
`,
  "tools/exam-sheet/mappers/draftToDocumentModel.ts": `import type { ExamSheetDraft } from "@/lib/types/exam-sheet/exam-sheet-draft.types";
import type { ExamSheetCalculationResult } from "@/lib/calculations/exam-sheet";
import type { ExamSheetDocumentModel } from "@/lib/types/exam-sheet/exam-sheet-document.types";

export function draftToDocumentModel(
  draft: ExamSheetDraft,
  calculation: ExamSheetCalculationResult
): ExamSheetDocumentModel {
  return {
    meta: {
      title: draft.meta.title,
      institutionName: draft.meta.institutionName,
      teacherName: draft.meta.teacherName,
      subjectLabel: draft.meta.subjectLabel,
      levelLabel: draft.meta.levelLabel,
      track: draft.meta.track,
      direction: draft.meta.track === "general" ? "rtl" : "ltr",
      totalPoints: draft.meta.totalPoints,
      roundingStep: draft.meta.roundingStep
    },
    lessonEntries: draft.lessons.map((lesson) => ({
      id: lesson.id,
      label: lesson.label,
      hours: lesson.hours,
      objectives: lesson.objectives.map((objective) => ({
        id: objective.id,
        text: objective.text
      }))
    })),
    allocation: {
      skills: draft.skills.map((skill) => ({
        id: skill.id,
        label: skill.label
      })),
      rows: calculation.rows.map((row, rowIndex) => ({
        lessonId: row.lessonEntryId,
        lessonLabel: row.lessonLabel,
        lessonPercentage: row.percentage,
        lessonPoints: row.points,
        cells: row.skills.map((value, cellIndex) => ({
          skillId: draft.skills[cellIndex]?.id ?? String(cellIndex),
          value
        }))
      })),
      columnTotals: calculation.totalsBySkill.map((value, index) => ({
        skillId: draft.skills[index]?.id ?? String(index),
        value
      })),
      globalTotal: calculation.lessonPointTotal
    }
  };
}
`,
  "tools/exam-sheet/defaults/createInitialExamSheetDraft.ts": `import type { ExamSheetDraft } from "@/lib/types/exam-sheet/exam-sheet-draft.types";

export function createInitialExamSheetDraft(): ExamSheetDraft {
  return {
    meta: {
      title: "",
      institutionName: "",
      teacherName: "",
      subjectId: "physics-chemistry",
      subjectLabel: "Physics and Chemistry",
      levelId: "",
      levelLabel: "",
      track: "general",
      totalPoints: 20,
      roundingStep: 0.5
    },
    lessons: [],
    skills: [],
    ui: {
      selectedLessonIdForFocus: null,
      expandedSectionIds: [],
      touched: false
    }
  };
}
`,
  "tools/exam-sheet/selectors/examSheetSelectors.ts": `export function selectExamSheetState() {
  return null;
}
`,
  "tools/exam-sheet/validation/examSheetDraftValidation.ts": `export function validateExamSheetDraft() {
  return [];
}
`,
  "tools/exam-sheet/types/exam-sheet-draft.ts": `export {};
`,
  "tools/exam-sheet/types/exam-sheet-ui.ts": `export type ExamSheetUIState = {
  touched: boolean;
};
`
};

for (const [filePath, content] of Object.entries(files)) {
  createFile(filePath, content);
}

console.log("");
console.log("Scaffold creation complete.");