# Calculation Engine

## 1. Purpose

The calculation engine is responsible for handling all mathematical and logical computations used by educational tools in the platform.

The engine must be independent from:

- UI components
- page rendering
- React
- DOM manipulation

This separation ensures that the calculation logic remains reusable, testable, and stable.

The first implementation of the calculation engine will support:

**Exam Sheet Allocation Table**

---

## 2. Input Data Model

The allocation system receives structured input data.

Example input:

- total exam points
- rounding step
- lessons list
- lesson hours
- skill percentages

Example structure:

ExamSheetInput

- totalPoints
- roundingStep
- lessons[]
- skills[]

Lesson

- id
- name
- hours

Skill

- id
- label
- percentage

---

## 3. Total Hours Calculation

The first step of the algorithm is computing the total teaching hours.

Formula:

totalHours = sum(lesson.hours)

Example:

Lesson A → 4 hours  
Lesson B → 2 hours  
Lesson C → 1 hour  

Total hours = 7

---

## 4. Lesson Percentage Calculation

Each lesson receives a percentage based on its share of total hours.

Formula:

lessonPercentage = lessonHours / totalHours

Example:

Lesson A = 4 / 7  
Lesson B = 2 / 7  
Lesson C = 1 / 7

The percentage may be displayed as a formatted value in the UI.

---

## 5. Lesson Points Calculation

Each lesson receives points based on its percentage.

Formula:

lessonPoints = lessonPercentage × totalPoints

Example:

Total points = 20

Lesson A = 20 × (4/7)  
Lesson B = 20 × (2/7)  
Lesson C = 20 × (1/7)

At this stage values are not yet rounded.

---

## 6. Skill Distribution

Each lesson's points are distributed across skills according to skill percentages.

Example skills:

- Retrieval
- Application
- Problem Situation

Example percentages:

40%
40%
20%

Formula:

skillPoints = lessonPoints × skillPercentage

This produces the raw matrix before rounding.

---

## 7. Raw Allocation Matrix

At this stage the system produces a raw allocation matrix.

Structure:

rows → lessons  
columns → skills

Each cell contains a floating-point value representing the raw skill points.

Example:

| Lesson | Retrieval | Application | Problem |
|------|------|------|------|
| L1 | 2.34 | 2.34 | 1.17 |
| L2 | 1.12 | 1.12 | 0.56 |

These values must later be rounded.

---

## 8. Rounding Constraints

Values inside the allocation table must follow a configured rounding step.

Example allowed values when step = 0.5

0  
0.5  
1  
1.5  
2  

The rounding system must obey three constraints:

- row totals must remain correct
- column totals must remain correct
- global total must remain correct

---

## 9. Balanced Rounding Algorithm

A naive rounding strategy would break totals.

Therefore the platform uses a **balanced rounding algorithm**.

The algorithm works at the table level rather than cell level.

Possible actions:

- increase a cell
- decrease a cell
- distribute small differences across multiple cells

The goal is to minimize deviation from the raw values while preserving totals.

---

## 10. Row and Column Integrity

The final matrix must satisfy:

sum(rowCells) = lessonPoints

sum(columnCells) = skillTotals

sum(allCells) = totalPoints

These constraints must remain valid after rounding adjustments.

---

## 11. Adjustment Reporting

The system may track rounding adjustments for transparency.

Each cell may store:

- raw value
- rounded value
- adjustment value

Example display:

1  
+0.2

or

1  
0.2-

This allows teachers to understand how rounding affected the final allocation.

---

## 12. Output Data Model

The engine produces a structured result object.

Example:

ExamSheetResult

- rows[]
- totalsBySkill[]
- lessonTotals[]
- globalTotal
- roundingSummary

Each row includes:

- lesson name
- lesson percentage
- lesson points
- skill distribution
- adjustment values

---

## 13. Engine Isolation

The calculation engine must remain fully independent.

It must not:

- access UI elements
- depend on React state
- depend on browser APIs

This ensures the engine can later be reused by:

- other tools
- backend services
- testing environments

---

## 14. Tool-Specific Extensibility

Each future tool may introduce:

- different inputs
- different formulas
- different data models
- different outputs

The platform must therefore treat calculations as tool-specific modules rather than one giant shared calculation file.

Example direction:

- calculations/exam-sheet
- calculations/lesson-sheet
- calculations/objectives-generator

This keeps each tool’s logic isolated.

---

## 15. Subject Scalability

The engine must later support subject-specific differences.

Possible future variations:

- different skill structures
- different pedagogical rules
- different allocation logic
- different sections in the output model

The engine must remain flexible enough to support those future requirements without rewriting the whole platform.