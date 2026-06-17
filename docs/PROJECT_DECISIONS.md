# Project Decisions

## Decision Log

### Decision 001
The project will be structured as a modular platform rather than a single isolated page.

### Decision 002
Calculations must be separated from the UI.

### Decision 003
The export system must not rely on screenshot-based solutions as the final production approach.

### Decision 004
A balanced rounding algorithm will preserve row totals, column totals, and global totals.

### Decision 005
The platform starts with one tool only:
Exam Sheet Generator.

### Decision 006
The allocation table is not the whole tool.
It is a component inside the Exam Sheet workflow.

### Decision 007
The teacher full name is fixed after account creation and cannot be changed by the teacher.

### Decision 008
The subject is fixed after account creation and cannot be changed by the teacher.

### Decision 009
The teacher does not select the subject each time a tool is used.
The subject belongs to the account profile.

### Decision 010
After login, the teacher enters the dashboard before selecting a level.

### Decision 011
Level selection happens after entering the dashboard and before entering the tools page.

### Decision 012
Track selection is not global to the whole platform.
It is requested only inside pages or tools that require it.

### Decision 013
The platform must support future expansion to multiple subjects.

### Decision 014
Each account includes subscription validity with a start date, expiration date, allowed levels, and allowed tools.

### Decision 015
The platform includes two main roles:
teacher and admin.

### Decision 016
Saving work is optional.
Teachers may export directly without saving.

### Decision 017
Each future tool may introduce its own inputs, calculations, outputs, and exports without changing the core platform architecture.

### Decision 018
The tools page should be designed for future growth, even if only one tool is available initially.

### Decision 019
The platform must track all subscription transactions for each teacher account.

### Decision 020
Each payment creates a transaction record linked to the teacher account.

### Decision 021
The dashboard acts as the central workspace of the platform.

### Decision 022
Track selection is contextual and must not be forced on unrelated pages.

### Decision 023
The architecture must support future subject-specific configurations without redesigning the whole platform.

### Decision 024
The initial implementation of the platform begins with a single subject: Physics and Chemistry. However, this does not justify hardcoding the subject inside the general systems.

### Decision 025
The first tool is the Exam Sheet Generator as a complete document, not merely an Allocation Table Tool.

### Decision 026
A reference catalog for Physics and Chemistry lessons must be adopted according to the level.

### Decision 027
Lesson input inside the tool must support suggestions during typing.

### Decision 028
Each reference lesson may contain default objectives stored in the system.

### Decision 029
When a lesson is selected from the catalog, its default objectives are automatically copied into the current document.

### Decision 030
Objectives inside the document remain editable by the teacher before export.

### Decision 031
Editing the objectives inside the document does not directly modify the global lesson reference.

### Decision 032
The subject inside the tool comes from the teacher’s account and is not entered manually.

### Decision 033
The level inside the tool comes from the session after selection and is not entered manually within the tool.

### Decision 034
The old Allocation Table page code is used only to extract calculation logic and certain ideas, not as a direct integration base.

### Decision 035
PDF export based on the print window is not an approved production solution.

### Decision 036
A Document Composition Layer must be adopted inside the tool to connect:
- Interface inputs
- Reference data
- Calculation output
- The final document template

### Decision 037
A Subject Catalog Layer must be adopted independently from:
- The interface
- Calculations
- Export

### Decision 038
The institution name must be stored at the teacher profile/professional data level so the teacher does not need to enter it every time.

### Decision 039
The institution name is editable, unlike the full name and the subject.
### Decision 040
The Exam Sheet Generator tool must be built as an independent tool module inside `tools/exam-sheet`, not as logic placed directly inside a route page.

### Decision 041
`lib/subjects` must be adopted as an independent reference layer for subject data, lessons, and default objectives.

### Decision 042
The institution name in the account represents a default value stored in the profile, and when the tool is opened it is copied into the document draft as a locally editable value.

### Decision 043
A clear separation must be maintained between:
- ExamSheetDraft  
- ExamSheetCalculationInput  
- ExamSheetCalculationResult  
- ExamSheetDocumentModel  

### Decision 044
The preview inside the tool must rely on `ExamSheetDocumentModel` or on the same structural source that feeds the export, to avoid divergence between preview and export.

### Decision 045
The internal structure of `tools/exam-sheet` must remain practical and lightweight in the first version, and excessive formal layering is prohibited unless a real need emerges.
### Decision 046
The Exam Sheet Calculation Engine must define a single stable public API that receives `ExamSheetCalculationInput` and returns `ExamSheetCalculationResult`.

### Decision 047
The calculation engine must handle balanced rounding in two separate stages:
- Balancing lesson scores
- Balancing the skills distribution matrix

### Decision 048
Internal rounding computations should, as much as possible, rely on arithmetic based on integer units derived from `roundingStep` to reduce precision issues.

### Decision 049
The calculation engine must enforce explicit invariants after computation:
- Row totals are correct
- Column totals are correct
- The overall total is correct
- All final values are exact multiples of `roundingStep`
- No negative values exist

### Decision 050
Any logic related to objectives, institution data, teacher information, or interface details is strictly forbidden inside the Calculation Engine.

### Decision 051
The internal structure of `lib/calculations/exam-sheet` must remain practical and lightweight in the first version, and excessive structural branching is prohibited unless a real need emerges.
### Decision 052
The Exam Sheet Generator interface must rely on `ExamSheetDraft` as the single editing state inside the tool, with a clear separation between draft state, calculation input, and document model.

### Decision 053
Lesson selection in the interface must support two cases:
- Selecting a lesson from a reference catalog
- Creating a local custom lesson when no suitable match exists

### Decision 054
Reference objectives are copied into the document draft when a lesson is selected, and then become editable local data independent from the catalog, with an explicit action provided to restore them instead of automatic overwrite.
### Decision 055
The export layer in `lib/exporters/exam-sheet` must operate exclusively from `ExamSheetDocumentModel` and must not depend on React state, the DOM, or preview markup.

### Decision 056
The export layer must include an internal composition stage that transforms `ExamSheetDocumentModel` into `ExamSheetExportLayout` or an equivalent internal layout structure before rendering to PDF or DOCX.

### Decision 057
PDF and DOCX must share:
- Section ordering  
- The semantic document structure  
- Labels according to track  
- Basic formatting  

They should differ only in the output engine and layout behavior specific to each format.

### Decision 058
RTL and LTR support in export must be handled through a unified export configuration based on `track` and `direction`, not through scattered logic inside each section renderer.

### Decision 059
`window.print` and browser printing are not accepted as production export solutions in this project due to instability, limited control, and their coupling with the interface.

### Decision 060
`ExamSheetExportLayout` or any similar layout model is considered an internal structure specific to the export layer and is not a public contract for other layers of the project.