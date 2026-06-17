# Export System

## 1. Export Goals

The export system is responsible for generating professional documents from structured platform data.

The platform must support:

- PDF export
- Word export

Export output must be:

- clear
- stable
- print-ready
- language-aware
- tool-aware

---

## 2. General Principle

The export system must work from structured data.

It must not rely on screenshot-based rendering as the final production solution.

Preferred export flow:

Tool Data  
→ Structured Export Model  
→ Export Generator  
→ Final Document

Not:

Rendered UI  
→ Screenshot  
→ Document

---

## 3. Current Tool Scope

At the current stage, the export system is focused on:

**Exam Sheet Generator**

However, the export architecture must allow future support for additional tools.

---

## 4. Supported Export Formats

### 4.1 PDF

The PDF output should be:

- clean
- readable
- stable
- suitable for printing
- suitable for Arabic and French

### 4.2 Word

The Word output should be:

- structured
- editable
- professionally organized
- consistent with the data model

---

## 5. Language and Track Support

The export system must support:

- Arabic for General Track
- French for International Track

Track affects:

- labels
- text direction
- alignment
- table headings
- instructional sections

---

## 6. Current Export Content

For the Exam Sheet tool, exports may include:

- exam title
- subject
- teacher name
- selected level
- selected track if applicable
- lessons and hours table
- allocation table
- calculation method section
- optional summaries

The export design must remain flexible as the tool grows.

---

## 7. PDF Strategy

The final PDF strategy should be data-driven.

The system should generate PDF from structured content and document layout definitions.

Goals:

- stable layout
- good typography
- predictable table rendering
- proper support for Arabic and French
- no dependency on browser printing settings

---

## 8. Previous PDF Issue

A previous attempt used screenshot-based export and produced issues such as:

- unsupported color parsing like lab()
- unstable rendering
- weak Arabic rendering
- poor consistency in final output

This confirms that screenshot-based export is not the long-term production solution.

---

## 9. Word Export Strategy

Word export should also be generated from structured data.

The output should preserve:

- document hierarchy
- table structure
- section order
- clear headings

Word export should remain easier to edit than PDF while still looking organized.

---

## 10. Export Data Model

The export system should not receive raw UI state directly.

It should receive a normalized export model.

Example idea:

ExamSheetExportData

- metadata
- teacher info
- subject
- level
- track
- lesson summary
- allocation table
- calculation explanation
- totals

This makes the export layer easier to maintain.

---

## 11. Tool-Specific Export Modules

Each tool should have its own export module.

Suggested direction:

- exporters/exam-sheet
- exporters/lesson-sheet
- exporters/objectives-generator

This prevents one giant exporter from becoming unmanageable.

---

## 12. Print Layout Considerations

The export system must always think in terms of printable documents.

Important layout concerns:

- page margins
- table fit
- section spacing
- multi-page behavior
- readable typography

The export system should not merely mirror the visual screen layout.

---

## 13. Future Scalability

The export system must be ready for:

- more tools
- more subjects
- more section types
- different document templates
- future export presets

This means export logic should remain modular and data-driven.

---

## 14. Export Rule Summary

The export system must:

- be independent from the UI
- receive structured normalized data
- support Arabic and French
- produce stable documents
- remain modular for future tools