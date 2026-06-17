# Project Map

## 1. Purpose of This Document

This document is the central map of the project.

It explains:

- what exists now
- what the approved target structure is
- how the main layers connect
- how data flows through the platform
- what must be created first when implementation starts

This document is not a replacement for the other docs.
It is the coordination map that connects them.

---

## 2. Current State vs Target State

### 2.1 Current State

At the current moment, the project contains documentation only.

Current actual structure:

```txt
docs/
  ARCHITECTURE.md
  CALCULATION_ENGINE.md
  EXPORT_SYSTEM.md
  FRONTEND_GUIDE.md
  PROJECT_DECISIONS.md
  PROJECT_MASTER_SPEC.md
  PROJECT_MAP.md
  BOOTSTRAP_PLAN.md
  DATABASE_ARCHITECTURE.md
```

No production code folders are assumed to exist yet.

This means the project is still in the **definition and foundation phase**.

### 2.2 Target State

When implementation starts, the approved target structure is:

```txt
app/
components/
lib/
tools/
docs/
```

The target codebase will be built in a controlled sequence, not all at once.

---

## 3. Platform Scope

Teacher Tools Platform is a SaaS platform for teachers in Morocco.

The first tool is:

**Exam Sheet Generator**

The platform must still support future expansion to:

- more tools
- more subjects
- more templates
- richer subscription logic
- persistent saved work
- stronger administration flows

The first subject implemented is:

**Physics and Chemistry**

This is an implementation scope decision, not a justification for hardcoding the entire platform around one subject forever.

---

## 4. Main Platform Layers

The approved architecture contains the following main layers.

### 4.1 Platform Layer

Owns:

- routing
- auth/session checks
- subscription checks
- level selection flow
- tool access checks
- platform pages

Target location:

```txt
app/
lib/auth/
lib/levels/
lib/payments/
```

### 4.2 Tool Layer

Owns:

- tool-specific workflows
- draft state
- user interaction logic
- local orchestration between catalog, calculation, document composition, and export

Target location:

```txt
tools/
  exam-sheet/
```

### 4.3 Subject Reference Layer

Owns:

- subject catalogs
- lesson references
- default lesson objectives
- subject-specific defaults

Target location:

```txt
lib/subjects/
```

### 4.4 Calculation Layer

Owns:

- mathematical computation only
- balancing rules
- row/column/global integrity

Target location:

```txt
lib/calculations/
```

### 4.5 Document Composition Layer

Owns:

- transforming draft + calculation result + reference/context data into a stable document model

This layer is conceptually part of the tool workflow.

Target location:

```txt
tools/exam-sheet/mappers/
```

### 4.6 Export Layer

Owns:

- PDF generation
- DOCX generation
- print-ready structured output

Target location:

```txt
lib/exporters/
```

---

## 5. Approved Target Structure

This is the target structure approved for the first implementation phase.

```txt
app/
  layout.tsx
  dashboard/page.tsx
  tools/page.tsx
  tools/exam-sheet/page.tsx
  settings/page.tsx

components/
  layout/
  shared/

lib/
  auth/
  calculations/
    exam-sheet/
      index.ts
      types.ts
      validate.ts
      units.ts
      calculateExamSheet.ts
      balanceMatrix.ts
      integrity.ts
  exporters/
    exam-sheet/
      index.ts
      types.ts
      labels.ts
      direction.ts
      formatting.ts
      build-exam-sheet-layout.ts
      pdf/
        render-exam-sheet-pdf.ts
      docx/
        render-exam-sheet-docx.ts
  levels/
  tracks/
  payments/
  storage/
  subjects/
    physics-chemistry/
  types/
    exam-sheet/

tools/
  exam-sheet/
    index.ts
    ExamSheetTool.tsx
    hooks/
      useExamSheetDraft.ts
      useExamSheetCalculation.ts
      useExamSheetDocument.ts
      useLessonSuggestions.ts
    components/
      ExamSheetPageHeader.tsx
      ExamSheetWorkspace.tsx
      ExamMetadataSection.tsx
      TrackSection.tsx
      LessonsSection.tsx
      SkillsSection.tsx
      CalculationSummarySection.tsx
      LessonRowEditor.tsx
      LessonAutocomplete.tsx
      ObjectivesEditor.tsx
      SkillPercentageEditor.tsx
      PreviewPanel.tsx
      PreviewSectionRenderer.tsx
      PreviewMetadataBlock.tsx
      PreviewLessonsTable.tsx
      PreviewAllocationTable.tsx
      PreviewObjectivesBlock.tsx
      PreviewSummaryBlock.tsx
      DraftActionsBar.tsx
      ValidationNotice.tsx
    mappers/
      draftToCalculationInput.ts
      draftToDocumentModel.ts
    defaults/
      createInitialExamSheetDraft.ts
    selectors/
      examSheetSelectors.ts
    validation/
      examSheetDraftValidation.ts
    types/
      exam-sheet-draft.ts
      exam-sheet-ui.ts

docs/
  ARCHITECTURE.md
  CALCULATION_ENGINE.md
  EXPORT_SYSTEM.md
  FRONTEND_GUIDE.md
  PROJECT_DECISIONS.md
  PROJECT_MASTER_SPEC.md
  PROJECT_MAP.md
  BOOTSTRAP_PLAN.md
  DATABASE_ARCHITECTURE.md
```

This is a target structure, not a claim that these files already exist.

---

## 6. Core Data Models

The first tool operates through four separate models.

### 6.1 ExamSheetDraft

Editable tool state.

Owns:

- metadata being edited
- lessons being edited
- local institution name value for the document
- editable objectives
- editable skill percentages
- local UI-only state

### 6.2 ExamSheetCalculationInput

Numeric/pedagogical input sent to the calculation engine.

Owns only:

- total points
- rounding step
- lessons and hours
- skills and percentages

It must not include:

- objectives
- institution name
- teacher identity
- UI state

### 6.3 ExamSheetCalculationResult

Pure calculation output.

Owns:

- lesson percentages
- lesson points
- skill matrix
- column totals
- balance summary
- integrity-preserving computed values

### 6.4 ExamSheetDocumentModel

Stable structured document model used by:

- preview
- export

It is the main structural source for the final document.

---

## 7. End-to-End Data Flow

### 7.1 Platform Flow

```txt
Login
→ Dashboard
→ Choose Level
→ Tools Page
→ Exam Sheet Tool
→ Build Document
→ Preview
→ Export
```

### 7.2 Tool Flow

```txt
Account/Profile Context
+ Session Context
→ createInitialExamSheetDraft(...)
→ user edits ExamSheetDraft
→ draftToCalculationInput(draft)
→ calculateExamSheet(input)
→ draftToDocumentModel(draft, calculationResult)
→ ExamSheetDocumentModel
→ Preview
→ Export PDF / DOCX
```

---

## 8. Account, Session, and Tool Contexts

The system must keep the following contexts separate.

### 8.1 Account Context

Owns:

- full name
- subject
- email
- account status
- role
- default institution name

### 8.2 Subscription Context

Owns:

- allowed tools
- allowed levels
- subscription start and end dates
- subscription status implications

### 8.3 Session Context

Owns:

- selected level
- current access path through the platform

### 8.4 Tool Context

Owns:

- current draft state
- selected track for the tool
- lesson/objective editing state

---

## 9. Exam Sheet Tool Boundaries

### Frontend owns

- sections
- editing workflow
- autocomplete interactions
- objectives editing
- draft state
- preview consumption

### Calculation engine owns

- computation only
- balanced rounding
- invariants

### Export layer owns

- document generation only
- PDF and DOCX output
- direction-aware rendering

### Subject reference layer owns

- lesson catalog
- default objectives
- subject-specific defaults

---

## 10. Export Principle

Export must be data-driven.

Approved path:

```txt
ExamSheetDocumentModel
→ internal export layout
→ PDF / DOCX renderer
```

Rejected path:

```txt
Rendered UI
→ DOM snapshot
→ browser print
→ final export
```

---

## 11. First Implementation Objective

The first implementation objective is not “finish the whole platform”.

It is:

**build the minimum stable scaffold that respects the approved architecture**

That means implementation must begin with:

- platform skeleton
- core types
- auth/session entry structure
- the Exam Sheet tool shell
- the calculation engine skeleton
- the subject catalog skeleton
- the document model path
- the export skeleton

---

## 12. What Must Not Happen During Implementation

The following would break the approved architecture:

- putting calculation logic inside React components
- making export depend on the DOM or browser printing
- putting subject catalog data directly into JSX files
- making the tool route page own all business logic
- merging draft state with calculation result state
- letting the preview diverge structurally from export
- turning the current one-subject scope into platform-wide hardcoding

---

## 13. Document Relationships

This map is connected to the other docs as follows:

- `PROJECT_MASTER_SPEC.md` = product and platform vision
- `ARCHITECTURE.md` = platform structure and ownership boundaries
- `CALCULATION_ENGINE.md` = computation principles and contracts
- `FRONTEND_GUIDE.md` = UI and workflow behavior
- `EXPORT_SYSTEM.md` = export principles and structure
- `PROJECT_DECISIONS.md` = official decision log
- `BOOTSTRAP_PLAN.md` = first execution sequence
- `DATABASE_ARCHITECTURE.md` = persistent data model and storage boundaries

---

## 14. Current Coordination Status

Current project status:

- architecture foundation: approved
- calculation direction: approved for V1
- frontend direction: approved for V1
- export direction: approved for V1
- implementation scaffold: not started yet
- database design: must be documented before execution starts

This means the project is ready to move from **documentation-only** into **controlled implementation**, but only after the execution bootstrap and database architecture are fixed.
