# Bootstrap Plan

## 1. Purpose of This Document

This document defines the first implementation sequence for the project.

It exists to prevent two common failures:

- starting coding without architectural boundaries
- creating too many folders and files before the execution path is clear

The goal is to move from **docs-only** to a stable code scaffold in a controlled way.

---

## 2. Current Reality

At the moment, the project contains documentation only.

That means:

- there is no implementation scaffold yet
- there is no approved runtime code structure on disk yet
- there is no database schema on disk yet
- there is no frontend code yet
- there is no exporter code yet

This is acceptable.
The documentation phase was necessary to stabilize the architecture before implementation.

---

## 3. Bootstrap Objective

The bootstrap objective is not to build features as quickly as possible.

The bootstrap objective is to create the minimum code structure that allows the first tool to be built correctly.

The first execution target is:

**a stable platform scaffold that can host the Exam Sheet Generator without architectural drift**

---

## 4. Execution Rules

### Rule 1
Start with structure and contracts before feature depth.

### Rule 2
Do not implement export directly from UI.

### Rule 3
Do not place calculation logic inside pages or components.

### Rule 4
Do not hardcode the entire platform around one subject, even if Physics and Chemistry is the first subject.

### Rule 5
Do not create advanced persistence flows before the storage and database boundaries are documented.

### Rule 6
Prefer a thin first scaffold over a large but unstable initial codebase.

---

## 5. Recommended Bootstrap Sequence

### Phase 0 — Documentation Freeze

Before creating code folders, confirm that the following docs are consistent:

- `PROJECT_MASTER_SPEC.md`
- `ARCHITECTURE.md`
- `CALCULATION_ENGINE.md`
- `FRONTEND_GUIDE.md`
- `EXPORT_SYSTEM.md`
- `PROJECT_DECISIONS.md`
- `PROJECT_MAP.md`
- `DATABASE_ARCHITECTURE.md`

Output of this phase:

- documentation accepted as the execution baseline

### Phase 1 — Create Base Repository Structure

Create only the top-level folders first:

```txt
app/
components/
lib/
tools/
docs/
```

Do not create deep feature trees yet.

Output of this phase:

- repository scaffold exists
- project can start receiving implementation files

### Phase 2 — Create Platform Skeleton

Create the minimum platform-level entry structure:

Target areas:

- `app/layout`
- `app/dashboard`
- `app/tools`
- `app/tools/exam-sheet`
- `app/settings`
- `lib/auth`
- `lib/levels`
- `lib/types`

This phase is about page entry points and context boundaries, not tool behavior.

Output of this phase:

- route skeleton exists
- page boundaries exist
- platform-level context flow is defined in code structure

### Phase 3 — Create Shared Domain Types

Create the shared types that multiple layers depend on.

Priority:

- account types
- subscription types
- level types
- track types
- subject types
- exam sheet shared types

This should happen before heavy feature implementation.

Output of this phase:

- common contracts are available
- later modules can depend on stable types

### Phase 4 — Create Subject Reference Skeleton

Create:

```txt
lib/subjects/
  physics-chemistry/
```

Start with:

- lesson catalog placeholders
- default objectives placeholders
- default skill placeholders if needed

Do not overfill data before structure is validated.

Output of this phase:

- approved home for subject reference data exists

### Phase 5 — Create Calculation Engine Skeleton

Create:

```txt
lib/calculations/exam-sheet/
  index.ts
  types.ts
  validate.ts
  units.ts
  calculateExamSheet.ts
  balanceMatrix.ts
  integrity.ts
```

Do not wire it to the UI yet.

First target:

- the public API shape exists
- the calculation module can be unit tested in isolation

Output of this phase:

- computation boundary is stable before UI integration

### Phase 6 — Create Tool Shell

Create:

```txt
tools/exam-sheet/
  ExamSheetTool.tsx
  hooks/
  components/
  mappers/
  defaults/
  validation/
  types/
```

Start with:

- initial draft creation
- section layout shell
- empty placeholders for lessons, skills, preview

Do not implement export here.

Output of this phase:

- tool boundary exists as a module
- route page can render the tool shell cleanly

### Phase 7 — Connect Draft to Calculation

Implement:

- `draftToCalculationInput`
- `useExamSheetCalculation`
- stable call to `calculateExamSheet(...)`

First target:

- the tool can produce and display calculation results without export

Output of this phase:

- frontend and calculation engine integration exists
- architectural separation is still preserved

### Phase 8 — Create Document Model Path

Implement:

- `draftToDocumentModel`
- `useExamSheetDocument`
- preview consumption from the document model

First target:

- preview is structurally aligned with future export

Output of this phase:

- document model becomes the structural source of the document

### Phase 9 — Create Export Skeleton

Create:

```txt
lib/exporters/exam-sheet/
```

Start with:

- export types
- direction helpers
- labels
- layout builder
- placeholder PDF renderer
- placeholder DOCX renderer

Do not optimize appearance yet.

Output of this phase:

- export layer exists with correct boundaries

### Phase 10 — Complete First Vertical Slice

The first vertical slice should allow:

- open tool
- fill draft
- select lessons from catalog
- edit objectives
- compute allocation
- build document model
- preview document structure
- export minimal PDF / DOCX from the document model

This is the first true V1 milestone.

---

## 6. What Should Be Delayed

The following should not be prioritized during the bootstrap phase:

- advanced dashboard polish
- complex admin panel
- template libraries
- autosave
- teacher-specific catalog overrides
- analytics
- advanced transaction reports
- fine visual polish in exporters
- multiple subject implementations

These are valid later, but they are not bootstrap priorities.

---

## 7. Minimum Files to Exist After Bootstrap

The bootstrap is successful when the following are true:

### Platform

- route skeleton exists
- auth/session boundaries exist
- level flow boundary exists

### Tool

- `ExamSheetTool` exists
- draft model exists
- tool sections exist at shell level

### Reference

- Physics/Chemistry subject catalog home exists

### Calculation

- `calculateExamSheet(...)` exists as a module boundary

### Document Model

- `draftToDocumentModel(...)` exists

### Export

- export layer exists and accepts `ExamSheetDocumentModel`

---

## 8. Anti-Patterns to Avoid During Bootstrap

Do not:

- build the old monolithic page inside the new codebase
- connect export to preview DOM
- let `app/tools/exam-sheet/page.tsx` become the tool itself
- embed lesson catalog arrays directly inside components
- skip the document model and export directly from draft state
- skip the calculation engine and compute inside hooks or JSX
- create many placeholder abstractions with no immediate use

---

## 9. Recommended Order of Technical Work

The practical order should be:

1. base folders
2. platform shell
3. shared types
4. subject reference home
5. calculation engine skeleton
6. exam sheet tool shell
7. draft → calculation integration
8. document model integration
9. export skeleton
10. first vertical slice

This order preserves the approved boundaries and reduces rework.

---

## 10. Definition of Ready to Start Coding

Implementation should start only when:

- the documentation set is accepted
- the target structure is understood as a target, not as already existing code
- the data and database boundaries are documented
- the first bootstrap sequence is accepted

At that point the project is ready to move from documentation into controlled execution.
