# Database Architecture

## 1. Purpose of This Document

This document defines the persistent data architecture required by the platform.

It does not lock the project to a specific database technology yet.

Its purpose is to clarify:

- what entities exist
- what belongs to the account
- what belongs to subscription/payment history
- what belongs to saved tool work
- what belongs to subject reference data
- what should remain immutable
- what should be editable

---

## 2. Database Design Principles

### 2.1 Separation of Concerns

Persistent data must follow the same architectural separation as the rest of the platform.

This means:

- account identity data is separate from tool drafts
- subscription data is separate from reference subject data
- transaction history is separate from editor state
- reference lesson catalog data is separate from teacher-created documents

### 2.2 Immutable vs Editable Data

Some fields are fixed after registration.

Other fields are editable defaults.

Other values are document-local copies and must not mutate the original source.

### 2.3 Subject Reference Isolation

Subject reference data must not be stored as if it were teacher-owned document data.

Catalog lessons and default objectives belong to the platform reference layer.

### 2.4 Auditability

Transactions and account state transitions should be traceable.

### 2.5 Future Scalability

The first implementation begins with one subject and one main tool, but the schema must support future growth.

---

## 3. Core Entity Groups

The platform data can be grouped into five domains.

### 3.1 Identity and Account Domain

- teacher accounts
- teacher profile data
- account status

### 3.2 Subscription and Payment Domain

- subscriptions
- allowed levels
- allowed tools
- transactions
- activation metadata

### 3.3 Session and Access Domain

- current selected level
- session tokens / auth sessions
- access checks

### 3.4 Subject Reference Domain

- subjects
- levels
- tracks
- lesson catalog
- default objectives
- subject-specific defaults

### 3.5 Tool Data Domain

- saved drafts
- saved document snapshots if adopted later
- export jobs or export history if adopted later

---

## 4. Teacher Account Model

### Entity: TeacherAccount

Core account identity.

Suggested fields:

- id
- email
- passwordHash or auth provider identifier
- fullName
- subjectId
- accountStatus
- role
- createdAt
- updatedAt

### Rules

- `fullName` is immutable from the teacher interface
- `subjectId` is immutable from the teacher interface
- account status is controlled by platform/admin workflows

### Allowed statuses

- pending
- active
- expired
- suspended
- blocked

---

## 5. Teacher Profile Model

### Entity: TeacherProfile

Profile data that belongs to the teacher but is not part of the immutable identity contract.

Suggested fields:

- teacherId
- institutionName
- preferredLanguage (optional later)
- defaultTrack (optional later, if ever needed locally)
- createdAt
- updatedAt

### Rules

- `institutionName` is editable
- it is a profile default, not a fixed identity field
- when the Exam Sheet tool opens, this value is copied into the document draft as a local editable value
- editing the institution name inside a document must not overwrite the profile automatically

---

## 6. Subscription Model

### Entity: TeacherSubscription

Represents the current active subscription contract for the teacher.

Suggested fields:

- id
- teacherId
- subscriptionStartDate
- subscriptionEndDate
- status
- createdAt
- updatedAt

### Related Entity: SubscriptionLevelPermission

Suggested fields:

- id
- subscriptionId
- levelId

### Related Entity: SubscriptionToolPermission

Suggested fields:

- id
- subscriptionId
- toolId

### Rules

- expired subscriptions should block tool access
- permissions should be explicit, not inferred from UI assumptions

---

## 7. Transaction Model

### Entity: PaymentTransaction

Suggested fields:

- id
- teacherId
- transactionReference
- amount
- currency
- paymentMethod
- transactionDate
- status
- subscriptionDuration
- activatedByAdminId (nullable)
- notes (optional)
- createdAt
- updatedAt

### Rules

- transaction history must remain auditable
- activation data should be traceable
- transactions should not be mixed with the current subscription record itself

---

## 8. Session and Access Model

### Entity: UserSession
n
This may be implemented using framework auth/session tools rather than a fully custom table, but conceptually it contains:

- session identifier
- teacherId
- selectedLevelId
- expiration metadata
- createdAt / updatedAt depending on auth implementation

### Rules

- selected level is session context, not account identity
- it should not be stored as a permanent teacher identity field

---

## 9. Subject Reference Model

### Entity: Subject

Suggested fields:

- id
- code
- label
- isActive

For V1, one subject exists functionally:

- Physics and Chemistry

But the schema must allow more.

### Entity: Level

Suggested fields:

- id
- code
- label
- cycle
- isActive

### Entity: Track

Suggested fields:

- id
- code
- label
- direction
- locale
- isActive

Expected current tracks:

- general → Arabic → RTL
- international → French → LTR

### Entity: SubjectLessonCatalogItem

Suggested fields:

- id
- subjectId
- levelId
- trackId (nullable if lesson is shared across tracks)
- code (optional)
- label
- sortOrder
- isActive

### Entity: SubjectLessonObjective

Suggested fields:

- id
- lessonCatalogItemId
- text
- sortOrder
- isActive

### Optional Later Entity: SubjectDefaultSkill

Suggested fields:

- id
- subjectId
- levelId (nullable)
- trackId (nullable)
- label
- percentage
- sortOrder
- isActive

### Rules

- reference lesson data belongs to platform reference data
- default objectives belong to the lesson catalog item
- these records are not teacher document data

---

## 10. Tool Draft Model

### Entity: ExamSheetDraft

This entity stores teacher work-in-progress only if save/load is enabled.

Suggested fields:

- id
- teacherId
- levelId
- subjectId
- trackId
- title
- institutionName
- teacherNameSnapshot
- subjectLabelSnapshot
- levelLabelSnapshot
- totalPoints
- roundingStep
- examDurationMinutes (nullable)
- semesterLabel (nullable)
- notes (nullable)
- status (draft / archived later if needed)
- createdAt
- updatedAt

### Rules

- snapshot fields are allowed here because drafts represent document state, not pure normalized identity data
- `institutionName` here is the local document copy
- this record is not the same thing as the profile default

### Related Entity: ExamSheetDraftLesson

Suggested fields:

- id
- draftId
- referenceLessonId (nullable)
- label
- hours
- source (catalog/custom)
- sortOrder
- createdAt
- updatedAt

### Related Entity: ExamSheetDraftObjective

Suggested fields:

- id
- draftLessonId
- text
- source (reference/custom)
- sortOrder
- createdAt
- updatedAt

### Related Entity: ExamSheetDraftSkill

Suggested fields:

- id
- draftId
- label
- percentage
- sortOrder
- createdAt
- updatedAt

---

## 11. Saved Document vs Draft

The platform must distinguish between two different concepts.

### Draft

Work in progress.

Editable and changeable.

### Final Generated Document

A generated artifact or snapshot that may later be stored for history if the product needs it.

V1 does not require persistent final document storage.

Therefore:

- saving drafts is optional
- storing final exported files is optional and should not block V1

---

## 12. Recommended Ownership Rules

### TeacherAccount owns

- identity
- immutable subject linkage
- account status

### TeacherProfile owns

- editable defaults such as institution name

### TeacherSubscription owns

- access period
- allowed tools
- allowed levels

### PaymentTransaction owns

- payment history
- audit trail

### Subject reference entities own

- lesson catalog
- default objectives
- subject defaults

### ExamSheetDraft owns

- current teacher-edited document state
- copied local institution name
- copied objective values
- custom lessons if created

---

## 13. Important Non-Negotiable Distinctions

The following distinctions must remain explicit.

### Distinction 1

`TeacherProfile.institutionName` is a profile default.

`ExamSheetDraft.institutionName` is a document-local editable copy.

### Distinction 2

`SubjectLessonCatalogItem` is reference data.

`ExamSheetDraftLesson` is editable document data.

### Distinction 3

`SubjectLessonObjective` is reference data.

`ExamSheetDraftObjective` is editable document data.

### Distinction 4

Subscription permissions are access rules.

They are not UI convenience values.

---

## 14. Deferred Database Areas

The following may be added later, but should not block the initial implementation.

- admin action logs
- export history
- notification records
- versioned draft history
- teacher-specific catalog overrides
- template library persistence
- analytics tables

---

## 15. Suggested Initial Database Priority

If database-backed implementation begins soon, the first priority entities should be:

1. TeacherAccount
2. TeacherProfile
3. TeacherSubscription
4. SubscriptionLevelPermission
5. SubscriptionToolPermission
6. PaymentTransaction
7. Subject
8. Level
9. Track
10. SubjectLessonCatalogItem
11. SubjectLessonObjective
12. ExamSheetDraft (optional for first save/load support)
13. ExamSheetDraftLesson (optional)
14. ExamSheetDraftObjective (optional)
15. ExamSheetDraftSkill (optional)

---

## 16. V1 Practical Recommendation

For the first implementation milestone:

- identity and access data should be modeled first
- subject reference catalog should be modeled second
- draft persistence can remain optional
- export persistence can be deferred entirely

This keeps the first implementation realistic while preserving long-term correctness.
