## Group 1

| Criterion | Max | Panel 1 (Balanced) | Panel 2 (Strict) | Panel 3 (Practical) | Remarks |
|---|---:|---:|---:|---:|---|
| Database Schema | 20 | 20 | 19 | 20 | Core rubric tables and relations are present. |
| Models | 14 | 14 | 13 | 14 | Required relationships are implemented across core models. |
| Controllers | 18 | 16 | 15 | 17 | Required workflow methods exist; editor `review` is handled via alternate method naming. |
| Policies | 12 | 12 | 11 | 12 | Article and comment policy coverage is strong, with minor strictness deduction on granularity. |
| Routes | 12 | 12 | 11 | 12 | Role-based route protection is implemented in dedicated route files. |
| InertiaJS Pages (React + MUI) | 12 | 10 | 9 | 11 | Role dashboards exist; auth flow lacks a dedicated `Auth/Login.jsx` page. |
| Seeders & Factories | 6 | 6 | 6 | 6 | Required seeders and factories are present. |
| DatabaseSeeder Orchestration | 4 | 2 | 2 | 2 | Seeder orchestration exists; sample generation is lighter than other groups. |
| Notifications | 4 | 4 | 4 | 4 | All required notification classes are implemented. |

| Metric | Value |
|---|---:|
| Panel 1 Total (normalized to 100 from rubric raw 102) | 94.12 |
| Panel 2 Total (normalized to 100 from rubric raw 102) | 88.24 |
| Panel 3 Total (normalized to 100 from rubric raw 102) | 96.08 |
| Average | 92.81 |
| Extra Mile Bonus | +5.00 |
| Adjusted Average | 97.81 |
| Personal Choice (Max +5) |  |
| Final Score |  |

Bonus basis: Extra modules and workflow tooling (analytics, draft versioning, approval/publication controls) exceed baseline rubric scope.

## Group 2

| Criterion | Max | Panel 1 (Balanced) | Panel 2 (Strict) | Panel 3 (Practical) | Remarks |
|---|---:|---:|---:|---:|---|
| Database Schema | 20 | 19 | 18 | 20 | Required tables exist, with additional schema enhancements. |
| Models | 14 | 13 | 12 | 14 | Core model coverage is complete; strict panel deducts for relationship detail clarity. |
| Controllers | 18 | 15 | 14 | 16 | Writer/editor flows are complete; student rubric method naming differs (`studentDashboard` not explicit). |
| Policies | 12 | 12 | 11 | 12 | Required policy methods are present. |
| Routes | 12 | 11 | 10 | 12 | Role-protected routes are present; strict panel deducts for route consistency polish. |
| InertiaJS Pages (React + MUI) | 12 | 11 | 10 | 12 | Writer/editor/student dashboards and auth pages exist. |
| Seeders & Factories | 6 | 6 | 5 | 6 | Required seeders and factories are present. |
| DatabaseSeeder Orchestration | 4 | 2 | 2 | 2 | Seeder orchestration exists; explicit sample revision/comment generation is limited. |
| Notifications | 4 | 4 | 4 | 4 | All four required notifications are present. |

| Metric | Value |
|---|---:|
| Panel 1 Total (normalized to 100 from rubric raw 102) | 91.18 |
| Panel 2 Total (normalized to 100 from rubric raw 102) | 84.31 |
| Panel 3 Total (normalized to 100 from rubric raw 102) | 96.08 |
| Average | 90.52 |
| Extra Mile Bonus | +4.00 |
| Adjusted Average | 94.52 |
| Personal Choice (Max +5) |  |
| Final Score |  |

Bonus basis: Beyond-rubric functionality such as favorites, views tracking, and theme-related enhancements.

## Group 3

| Criterion | Max | Panel 1 (Balanced) | Panel 2 (Strict) | Panel 3 (Practical) | Remarks |
|---|---:|---:|---:|---:|---|
| Database Schema | 20 | 19 | 18 | 19 | Required tables are present and linked. |
| Models | 14 | 13 | 12 | 13 | Core model set and relationships are mostly complete. |
| Controllers | 18 | 13 | 11 | 14 | Missing/renamed rubric methods (`revise`, `studentDashboard`, `comment`) reduce score. |
| Policies | 12 | 9 | 8 | 9 | `CommentPolicy` exists but lacks explicit `comment` method. |
| Routes | 12 | 11 | 10 | 12 | Role-protected and auth routes exist. |
| InertiaJS Pages (React + MUI) | 12 | 11 | 10 | 12 | Required dashboard/auth pages are present. |
| Seeders & Factories | 6 | 6 | 5 | 6 | Required seeders and factories are present. |
| DatabaseSeeder Orchestration | 4 | 2 | 2 | 2 | Seeder orchestration present; explicit sample data generation breadth is limited. |
| Notifications | 4 | 4 | 4 | 4 | All required notification classes are present. |

| Metric | Value |
|---|---:|
| Panel 1 Total (normalized to 100 from rubric raw 102) | 86.27 |
| Panel 2 Total (normalized to 100 from rubric raw 102) | 78.43 |
| Panel 3 Total (normalized to 100 from rubric raw 102) | 89.22 |
| Average | 84.64 |
| Extra Mile Bonus | +2.00 |
| Adjusted Average | 86.64 |
| Personal Choice (Max +5) |  |
| Final Score |  |

Bonus basis: Added review-oriented UX pages and workflow support beyond the minimum baseline.

## Group 4

| Criterion | Max | Panel 1 (Balanced) | Panel 2 (Strict) | Panel 3 (Practical) | Remarks |
|---|---:|---:|---:|---:|---|
| Database Schema | 20 | 9 | 7 | 10 | Missing rubric tables for statuses, revisions, and categories. |
| Models | 14 | 6 | 5 | 7 | Core `Article`/`Comment` exist; required `ArticleStatus`, `Revision`, `Category` are not found. |
| Controllers | 18 | 4 | 3 | 5 | Rubric role controllers/workflow methods are largely absent. |
| Policies | 12 | 2 | 1 | 3 | Partial `ArticlePolicy`; required policy coverage is incomplete. |
| Routes | 12 | 3 | 2 | 4 | Writer/editor/student protected route structure is not evident. |
| InertiaJS Pages (React + MUI) | 12 | 4 | 3 | 4 | Auth pages exist, but role dashboard set is missing. |
| Seeders & Factories | 6 | 1 | 1 | 1 | Required role/category/user/status seeders and article/revision/comment factories are not found. |
| DatabaseSeeder Orchestration | 4 | 1 | 1 | 1 | Database seeder exists but does not reflect required orchestration scope. |
| Notifications | 4 | 0 | 0 | 0 | Required notification classes are not found. |

| Metric | Value |
|---|---:|
| Panel 1 Total (normalized to 100 from rubric raw 102, floored) | 50.00 |
| Panel 2 Total (normalized to 100 from rubric raw 102, floored) | 50.00 |
| Panel 3 Total (normalized to 100 from rubric raw 102, floored) | 50.00 |
| Average (floored) | 50.00 |
| Extra Mile Bonus | +0.00 |
| Adjusted Average | 50.00 |
| Personal Choice (Max +5) |  |
| Final Score |  |

## Group 5

| Criterion | Max | Panel 1 (Balanced) | Panel 2 (Strict) | Panel 3 (Practical) | Remarks |
|---|---:|---:|---:|---:|---|
| Database Schema | 20 | 20 | 19 | 20 | Required schema and relationships are present. |
| Models | 14 | 14 | 13 | 14 | Full core model coverage with expected relationships. |
| Controllers | 18 | 16 | 14 | 16 | Most workflow methods are present; explicit `review` method is missing. |
| Policies | 12 | 12 | 12 | 12 | Required `ArticlePolicy` and `CommentPolicy` methods are present. |
| Routes | 12 | 12 | 11 | 12 | Role-protected and auth routes are complete. |
| InertiaJS Pages (React + MUI) | 12 | 12 | 11 | 12 | Writer/editor/student dashboards plus auth pages are all present. |
| Seeders & Factories | 6 | 6 | 6 | 6 | Required seeders and factories are fully present. |
| DatabaseSeeder Orchestration | 4 | 4 | 4 | 4 | Seeder orchestration and sample data generation are evident. |
| Notifications | 4 | 4 | 4 | 4 | All required notification classes are implemented. |

| Metric | Value |
|---|---:|
| Panel 1 Total (normalized to 100 from rubric raw 102) | 98.04 |
| Panel 2 Total (normalized to 100 from rubric raw 102) | 92.16 |
| Panel 3 Total (normalized to 100 from rubric raw 102) | 98.04 |
| Average | 96.08 |
| Extra Mile Bonus | +2.00 |
| Adjusted Average | 98.08 |
| Personal Choice (Max +5) |  |
| Final Score |  |

Bonus basis: Includes extra notification and workflow refinements beyond minimum rubric requirements.

## Final Ranking

| Group | Average | Bonus | Adjusted Average | Personal Choice (Max +5) | Final Score |
|---|---:|---:|---:|---:|---:|
| Group 5 | 96.08 | +2.00 | 98.08 | - | 98.08 |
| Group 1 | 92.81 | +5.00 | 97.81 | +5.00 | 102.81 |
| Group 2 | 90.52 | +4.00 | 94.52 | +4.00 | 98.52 |
| Group 3 | 84.64 | +2.00 | 86.64 | +5.00 | 91.64 |
| Group 4 | 50.00 | +0.00 | 50.00 | - | 50.00 |
