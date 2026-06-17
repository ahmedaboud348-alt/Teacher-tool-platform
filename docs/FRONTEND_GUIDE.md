# Frontend Guide

## 1. Frontend Purpose

The frontend is responsible for presenting the platform clearly and professionally to teachers.

It must provide:

- a clean landing experience
- a clear account flow
- a structured dashboard
- a simple level selection process
- a tool-driven experience
- a professional document-building workflow

The frontend must remain separate from core calculation logic.

---

## 2. Main Platform Pages

The frontend currently includes the following key pages:

- Home Page
- Login Page
- Register Page
- Dashboard
- Choose Level Page
- Tools Page
- Exam Sheet Tool Page
- Settings Page

---

## 3. Home Page

The home page is public.

Its role is to:

- introduce the platform
- explain its value
- present the teacher-focused tool concept
- provide access to login and registration

Suggested sections:

- hero section
- short platform presentation
- benefits for teachers
- call-to-action buttons
- optional preview of the main tool

---

## 4. Login and Register Pages

The login page should be simple and focused.

The register page must collect:

- full name
- subject
- email
- password

Important note:

The UI should make it clear that:

- the name becomes fixed after registration
- the subject becomes fixed after registration
- the account requires manual activation after payment

---

## 5. Dashboard

The dashboard is the main workspace of the teacher account.

Its role is to centralize platform access.

Suggested dashboard content:

- welcome section
- teacher identity summary
- subject display
- subscription status
- expiration information
- quick access to choose level
- quick access to tools
- important notices

The dashboard should feel like the control center of the platform.

---

## 6. Choose Level Page

After login and validation, the teacher selects a level.

This page should:

- clearly list only allowed levels
- make selection easy and fast
- prepare the teacher for tool access

Recommended UI:

- level cards or buttons
- current subscription notice
- back to dashboard option

---

## 7. Tools Page

The tools page displays available tools for the selected level.

At the current stage only one tool is visible:

- Exam Sheet Generator

The recommended UI pattern is:

**tool cards**

This allows future expansion much more easily than a rigid list.

Each tool card may later include:

- tool name
- short description
- status badge
- entry button

---

## 8. Tool Card Strategy

The frontend should be designed for future growth.

Even if only one tool exists now, the tools page must look like a tool platform.

Recommended approach:

- use a grid of cards
- support future cards without redesign
- allow disabled or upcoming tools later

---

## 9. Exam Sheet Page

The Exam Sheet page is the current main working page.

This page is broader than a single allocation table.

It should include structured sections.

Suggested sections:

1. Exam metadata
2. Track selection if required
3. Tool configuration
4. Lessons and hours input
5. Skill percentages
6. Quick summary
7. Allocation table preview
8. Calculation method section
9. Export actions
10. Optional save actions

---

## 10. Track Selection in Tools

Track selection should not appear globally across the platform.

It should be displayed only in tools that require it.

For Exam Sheet:

- the track selector may appear near the top of the tool page
- changing track should update labels and direction as needed

---

## 11. Exam Sheet Layout Strategy

The Exam Sheet page should be split into clear blocks.

Recommended layout:

- top header with page title
- configuration panel
- structured form sections
- summary block
- result preview
- export and save actions

The user should always understand where they are in the workflow.

---

## 12. UI Components Strategy

Frontend components should be broken into reusable parts.

Suggested reusable groups:

### Layout components

- AppShell
- DashboardLayout
- ToolPageLayout

### Shared components

- Card
- Button
- Input
- Badge
- Notice
- Dialog

### Exam Sheet specific components

- ExamSheetHeader
- TrackSelector
- ExamSettingsForm
- LessonsEditor
- SkillsEditor
- SummaryCards
- AllocationTablePreview
- CalculationMethodBlock
- ExportActions
- SaveDraftDialog

---

## 13. Direction and Language Handling

The frontend must support:

- Arabic RTL
- French LTR

This should be handled in a structured way.

The UI should not hardcode one direction everywhere.

Direction-sensitive areas include:

- page layout
- text alignment
- table alignment
- button/icon spacing
- export preview labels

---

## 14. Notifications and Status Messages

The frontend should be ready to display messages such as:

- account pending activation
- subscription expired
- work saved successfully
- export completed
- invalid access to a level

These should use a consistent message style.

---

## 15. Settings Page

The settings page should provide account-related information.

Potential sections:

- teacher full name
- subject
- email
- subscription status
- expiration date
- password update

The page should clearly communicate which fields are editable and which are fixed.

---

## 16. Scalability Principles

The frontend must be built as if more tools will be added later.

This means:

- do not design the tools page for one tool only
- do not hardcode one subject assumption everywhere
- do not build one huge tool page with mixed responsibilities

Each tool page should be scalable and maintainable.

---

## 17. Frontend Rule Summary

Frontend responsibilities:

- page structure
- user flow clarity
- tool discoverability
- clean form experience
- clear result display

Frontend must not be responsible for:

- core calculations
- export generation internals
- subscription validation logic
- account business rules