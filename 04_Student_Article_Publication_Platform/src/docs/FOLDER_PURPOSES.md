# Student Article Publication Platform Folder Purposes

## Backend (Laravel)

- `app/Http/Controllers/Auth/`: Breeze authentication controllers (login, register, password, verification).
- `app/Http/Controllers/Admin/`: Admin-only account management endpoints (user-role management and governance).
- `app/Http/Controllers/Writer/`: Writer-only article creation/submission/revision and writer dashboard endpoints.
- `app/Http/Controllers/Editor/`: Editor-only review, revision requests, publishing, and editorial dashboard endpoints.
- `app/Http/Controllers/Student/`: Student-facing browse/comment actions and student dashboard endpoints.
- `app/Http/Controllers/Shared/`: Cross-role article/comment actions that are reused across dashboards.

- `app/Policies/`: Centralized authorization rules for article workflow and comments.
- `app/Models/`: Domain entities and Eloquent relationships for article lifecycle.
- `app/Notifications/`: Event notifications for submission/revision/publish/comment workflows.
- `app/Services/`: Business logic orchestration to keep controllers thin and maintainable.

## Frontend (Inertia + React)

- `resources/js/Pages/Auth/`: Breeze authentication pages.
- `resources/js/Pages/Admin/`: Admin dashboard pages for account management.
- `resources/js/Pages/Writer/`: Writer dashboard and article authoring pages.
- `resources/js/Pages/Writer/Components/`: Writer-only UI building blocks (form, draft/submitted lists).
- `resources/js/Pages/Editor/`: Editor dashboard and review/revision queue pages.
- `resources/js/Pages/Editor/Components/`: Editor-only review/preview/revision UI components.
- `resources/js/Pages/Student/`: Student dashboard, article browsing, and article reading pages.
- `resources/js/Pages/Student/Components/`: Student-facing cards/comments/recommendation widgets.
- `resources/js/Pages/Shared/Layouts/`: Reusable role-aware layouts and shell structure.
- `resources/js/Pages/Shared/Components/`: Reusable UI primitives (navbar/sidebar/notifications/loading).
- `resources/js/Pages/Shared/JoditEditor.jsx`: Reusable rich-text editor wrapper for article forms.
- `resources/js/Pages/Sample/`: Reference/demo pages (editor sample and email test page).

## Routing and Data

- `routes/web.php`: Main web routes, auth routes, and role route includes.
- `routes/writer.php`: Writer route group and endpoints.
- `routes/editor.php`: Editor route group and endpoints.
- `routes/student.php`: Student route group and endpoints.
- `routes/admin.php`: Admin route group and account-management endpoints.
- `routes/api.php`: Optional API endpoints.

- `database/migrations/`: Ordered schema definitions for statuses, categories, articles, revisions, comments.
- `database/seeders/`: Ordered seed orchestration for roles, statuses, categories, and starter users.
- `database/factories/`: Test/data factories for articles, revisions, and comments.
