# Platform Architecture

## 1. Architecture Philosophy

Teacher Tools Platform is designed as a modular educational platform.

The architecture must support long-term growth without requiring a full rebuild.

The system starts with one tool:

**Exam Sheet Generator**

However, the architecture must already be prepared for:

- additional tools
- additional subjects
- subject-specific logic
- richer subscription logic
- transaction tracking
- future database integration

Core principles:

- modularity
- separation of concerns
- isolated tool logic
- reusable shared systems
- future scalability

---

## 2. Platform Flow

The main platform navigation flow is:

Home Page  
→ Login / Register  
→ Dashboard  
→ Level Selection  
→ Tools Page  
→ Tool Selection  
→ Track Selection if required by the tool  
→ Tool Usage  
→ Optional Save / Export

The dashboard is the central workspace of the teacher.

All platform interactions start from the dashboard.

---

## 3. Context Layers

The architecture separates four different context layers.

### 3.1 Account Context

Fixed user identity data:

- full name
- subject
- email
- account status
- role

This data belongs to the account and does not change during regular usage.

### 3.2 Subscription Context

Subscription-related permissions:

- allowed levels
- allowed tools
- subscription start date
- subscription expiration date

This context defines what the teacher is allowed to access.

### 3.3 Session Context

Session-specific working data:

- selected level

The level is chosen after login and before entering tools.

### 3.4 Tool Context

Tool-specific working data:

- selected track if required
- tool inputs
- tool settings
- lesson data
- skill data

Tool context exists only inside the tool that needs it.

---

## 4. Global Project Structure

Recommended structure:

teacher-tools-platform

app
components
lib
tools
docs

This structure keeps the system organized and scalable.

---

## 5. Platform Pages

The platform is organized around a small set of core pages.

Home Page

Public landing page presenting the platform.

Login Page

Teacher authentication page.

Register Page

Teacher account creation page.

Dashboard

Central workspace of the teacher account.

From the dashboard the teacher can:

- view account status
- access tools
- select levels
- manage settings

Choose Level Page

Page used to select the working level from the subscription.

Tools Page

Displays available tools.

At the current stage only one tool is available:

Exam Sheet Generator

Tool Page

Each tool has its own page and internal workflow.

Settings Page

Contains account-related settings and informational account details.

---

## 6. App Layer

The `app` folder contains platform routes and pages.

Suggested pages:

- home page
- login
- register
- dashboard
- choose-level
- tools
- tools/exam-sheet
- settings

Responsibilities of the app layer:

- routing
- page composition
- navigation flow
- platform-level access flow

The app layer must not contain core calculations.

---

## 7. Components Layer

The `components` folder contains reusable UI elements.

Suggested groups:

- layout
- shared
- exam-sheet

Examples:

- page wrappers
- headers
- buttons
- cards
- dialogs
- form blocks
- table blocks

Components are UI-focused only.

They must not contain:

- business calculations
- export generation logic
- subscription rules

---

## 8. Tools Layer

Each pedagogical tool must be isolated in its own module.

Suggested structure:

tools
  exam-sheet

Later the platform may include:

tools
  exam-sheet
  lesson-sheet
  objectives-generator
  exam-generator

Each tool should have its own local organization while still relying on shared systems.

Each tool may introduce:

- its own inputs
- its own calculations
- its own exports
- its own UI workflow

without modifying the core platform systems.

---

## 9. Library Layer

The `lib` folder contains shared platform logic.

Suggested modules:

- auth
- calculations
- exporters
- tracks
- levels
- storage
- types
- notifications
- payments

This is the core logic layer of the platform.

---

## 10. Auth Module

The `auth` module is global to the platform.

It is not page-specific.

Its responsibilities include:

- registration
- login
- activation checks
- account status checks
- expiration checks
- permission checks

Suggested internal responsibilities:

- account identity
- activation status
- subscription validity
- level access permission
- tool access permission
- role checks

The account system must be shared by the whole platform.

---

## 11. Levels Module

The `levels` module manages educational levels and level-related logic.

Responsibilities:

- level definitions
- allowed level validation
- selected level helpers

The selected level is part of the current session, not fixed account identity.

---

## 12. Tracks Module

The `tracks` module manages teaching track logic.

Responsibilities:

- track definitions
- labels per track
- direction helpers
- language selection

Important rule:

Track selection is not global to the whole platform.

A track is requested only inside pages or tools that require it.

This prevents forcing track selection in unrelated pages.

---

## 13. Subject Scalability

Even though each teacher account is linked to one fixed subject, the architecture must support many subjects in the future.

This means the platform must not hardcode a single subject assumption in core systems.

Future subject-based configuration may affect:

- labels
- default skills
- pedagogical sections
- export templates
- tool behavior

The architecture must allow those variations later without full restructuring.

---

## 14. Calculation Engine

All mathematical and pedagogical calculations must live in:

lib/calculations

Suggested structure:

calculations
  exam-sheet

The calculation engine must be independent from:

- React
- page rendering
- DOM
- UI components

This allows:

- testability
- reusability
- cleaner maintenance

---

## 15. Export System

All export logic must live in:

lib/exporters

Suggested structure:

exporters
  exam-sheet

The export system must work from structured output data.

It must not rely on screenshot-based rendering as the final production solution.

Exports should be generated from the data model.

The export layer should support:

- PDF
- Word
- future print-oriented formats

---

## 16. Storage Layer

The `storage` module handles saving and retrieving teacher work.

Responsibilities:

- optional save
- loading saved work
- template retrieval
- draft persistence

The storage layer should later be able to move from temporary or local persistence to database-backed persistence.

---

## 17. Notifications Layer

The platform should be ready for a notifications mechanism.

Responsibilities may later include:

- activation notices
- expiration warnings
- successful save messages
- export result messages

At the current phase this may be lightweight, but the architecture should leave room for it.

---

## 18. Payments Layer

The `payments` module should later support transaction tracking and payment-related data handling.

Responsibilities may include:

- transaction records
- payment validation state
- renewal linkage
- admin payment review helpers

This does not need full implementation now, but it must be represented in the architecture.

---

## 19. Types Layer

All shared data definitions must be centralized in:

lib/types

Examples of shared types:

- UserAccount
- Subscription
- Level
- Track
- Subject
- Lesson
- Skill
- ExamSheetInput
- ExamSheetResult
- Notification
- AccountRole
- Transaction

Centralized typing reduces inconsistencies across the system.

---

## 20. Tool Expansion Strategy

New tools must be additive.

Adding a new tool should not require changing the existing core structure.

Examples of future additions:

- lesson sheet
- lesson planning
- exam generation
- objectives management

The platform architecture must make this process predictable and clean.

---

## 21. Summary

The platform architecture is built on the following idea:

Global platform systems manage identity, subscription, level, roles, transactions, and shared services.

Each pedagogical tool handles its own inputs and workflow while relying on shared platform infrastructure.

This ensures the platform remains stable while still allowing future expansion.