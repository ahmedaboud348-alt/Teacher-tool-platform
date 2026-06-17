# Teacher Tools Platform

## 1. Project Vision

Teacher Tools Platform is a web platform designed to help teachers in Morocco create pedagogical documents quickly and professionally.

The platform is intended to become a modular system of educational tools that can grow over time.

The current implementation starts with one main tool:

**Exam Sheet Generator**

However, the platform must be designed from the beginning in a way that allows future expansion to:

- additional subjects
- additional educational tools
- additional pedagogical workflows
- richer account and subscription features
- transaction tracking
- database-backed persistence

---

## 2. Platform Concept

The platform is not a single-page utility.

It is a modular educational platform where each teacher accesses tools through one account.

The long-term goal is to build a scalable teacher workspace where different pedagogical tools are available in one system.

Examples of future tools:

- Exam Sheet Generator
- Lesson Sheet Generator
- Lesson Planning Tools
- Objectives Generator
- Template Library
- Other subject-specific tools

At the current stage, only one tool is actively being developed:

**Exam Sheet Generator**

---

## 3. Subject Strategy

Each teacher account is associated with one fixed subject.

The subject is selected during account creation and remains fixed after registration.

Important rules:

- the subject is not selected every time the teacher uses a tool
- the subject belongs to the account profile
- the subject is immutable from the teacher interface
- if the subject must be changed, it must be handled by the platform administrator

The architecture must still support future expansion to many subjects.

This means the platform must not be designed as if it only supports one subject forever.

It must support future subject-based configuration such as:

- different labels
- different templates
- different skill structures
- different pedagogical workflows
- different export layouts

---

## 4. Fixed Account Data

Each teacher account contains fixed data defined during registration.

Fixed account data:

- full name
- subject
- email
- password

Important rules:

- the teacher full name is immutable after account creation
- the subject is immutable after account creation
- both may only be changed by administration if necessary

---

## 5. Account Activation

Accounts are not active immediately after registration.

New accounts are created with status:

- pending

After payment confirmation, the administrator manually activates the account.

Possible account statuses:

- pending
- active
- expired
- suspended
- blocked

Only active and valid accounts may access platform tools.

---

## 6. Subscription Validity

Each teacher account includes subscription validity information.

Subscription-related data includes:

- start date
- expiration date
- allowed levels
- allowed tools

If the current date exceeds the expiration date, the account becomes expired.

Expired accounts cannot access tools until the subscription is renewed.

---

## 7. Transaction Tracking

The platform must keep track of teacher payment transactions.

Each transaction record may include:

- transaction id
- teacher id
- amount
- currency
- payment method
- date
- validation status
- subscription duration
- activated by

Transactions are used to support:

- payment history
- subscription renewal tracking
- account activation tracking
- financial follow-up

---

## 8. Platform Navigation Flow

The platform follows a structured navigation flow.

Home Page  
→ Login / Register  
→ Dashboard  
→ Level Selection  
→ Tools Page  
→ Tool Page  
→ Track Selection if required by the tool  
→ Tool Usage  
→ Optional Save or Export

The dashboard acts as the central workspace of the teacher account.

From the dashboard the teacher can:

- view account information
- review subscription status
- choose a level
- access available tools

---

## 9. Level Selection

After login and account validation, the teacher selects a level from the levels allowed in the subscription.

Examples:

- 1AC
- 2AC
- 3AC

The selected level becomes part of the current working session.

The level is not fixed permanently inside the account identity.

---

## 10. Tools Page

After selecting a level, the teacher enters the tools page.

This page displays the tools available for the current platform phase.

At the current stage, only one tool is available:

**Exam Sheet Generator**

The architecture must still be prepared for future tools.

---

## 11. Teaching Tracks

The platform supports two teaching tracks used in Morocco:

- General Track
- International Track

Important rule:

Track selection is not global to the whole platform.

A track is selected only inside tools or pages that require it.

Usually:

- General Track → Arabic → RTL
- International Track → French → LTR

The selected track affects:

- tool language
- direction
- labels
- export language

---

## 12. Language Support

The platform must support Arabic and French.

At the current stage, language is primarily driven by the selected teaching track in tools that require it.

However, the platform architecture must remain ready for future language control beyond the current track-based approach.

---

## 13. Current Tool: Exam Sheet Generator

The current tool being developed is:

**Exam Sheet Generator**

This tool is broader than a simple allocation table.

The allocation table is one component inside the exam sheet workflow.

The exam sheet may later include:

- exam metadata
- allocation table
- pedagogical fields
- skill distribution
- additional structured sections
- export actions

---

## 14. Allocation Table Logic

Inside the exam sheet workflow, the system must support allocation table generation.

Inputs include:

- title
- total points
- rounding step
- lessons
- lesson hours
- skill percentages

The system calculates:

- total teaching hours
- lesson percentages
- lesson points
- skill point distribution

---

## 15. Balanced Rounding Principle

Balanced rounding is a core rule.

Allowed values must follow the configured step, such as:

0  
0.5  
1  
1.5  
2  

However, rounding must preserve:

- row totals
- column totals
- global total

The algorithm may increase one cell and decrease another one or multiple others if needed.

The final result must remain mathematically consistent.

---

## 16. Export System

The platform must support:

- PDF export
- Word export

The export system must be built from structured data and not rely on screenshot-based rendering as the final solution.

Export goals:

- stable output
- high quality
- Arabic and French support
- print-ready formatting
- future support for more tools and more subjects

---

## 17. Draft Saving Strategy

Saving work is optional.

A teacher may:

- use a tool
- export documents
- leave without saving

Or:

- save work as a draft or template for later reuse

The architecture must support optional draft persistence.

---

## 18. Notifications Strategy

The platform should be ready to show important messages such as:

- account pending activation
- subscription expired
- subscription expiring soon
- work saved successfully
- export completed

Notifications do not need to be fully implemented now, but they must be considered in the overall platform design.

---

## 19. Roles

The platform currently assumes two main roles:

- teacher
- admin

Teacher role:

- logs in
- selects level
- uses tools
- exports documents
- optionally saves work

Admin role:

- activates accounts
- manages account status
- changes fixed account data if necessary
- manages subscription validity
- validates transactions

---

## 20. Architecture Overview

The platform must follow a modular architecture with clear separation between:

- UI
- calculations
- export system
- authentication
- storage
- shared types
- track logic
- level logic
- notifications
- payments and transactions

The architecture must support future growth without requiring a full rebuild.

---

## 21. Development Methodology

The platform will be developed using:

- modular design
- separation of concerns
- reusable logic
- reusable UI components
- tool-based structure
- future subject scalability

Current focus:

Build a strong first implementation of the **Exam Sheet Generator** inside a scalable platform architecture.

---

## 22. Future Extensions

If the first implementation succeeds, the platform will later expand by adding:

- more subjects
- more tools
- more pedagogical workflows
- richer account permissions
- stronger export options
- template management
- database-backed persistence
- more advanced subscription plans