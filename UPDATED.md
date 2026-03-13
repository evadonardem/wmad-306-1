# UPDATED.md — Changes & Additions Log

## Student Article Publication Platform — Audit & Fix Report

This document records all changes made to the working `src/` directory to align it with the **Technical Specification, Instructional Guidance & Grading Guide**.

---

## 1. Environment & Onboarding

### `.env.example` (src/)
- **CHANGED**: `APP_NAME` from `Laravel` → `"Student Article Publication Platform"`
- **CHANGED**: `DB_CONNECTION` from `sqlite` → `mysql`
- **CHANGED**: Uncommented and set `DB_HOST`, `DB_PORT`, `DB_DATABASE=article_platform`, `DB_USERNAME=root`, `DB_PASSWORD=`
- **CHANGED**: `MAIL_MAILER` from `log` → `smtp` with Mailtrap/Mailpit settings for local Docker
- **ADDED**: Production mail config block (commented) for Mailtrap SMTP
- **ADDED**: `TELESCOPE_ENABLED=true` — Telescope debugging flag
- **CHANGED**: `MAIL_FROM_ADDRESS` to `"noreply@article-platform.local"`

### `.env` (04_Student_Article_Publication_Platform/src/)
- **FIXED**: Removed duplicate active mail configuration block (was two identical blocks)
- **FIXED**: Added commented production mail block for clarity
- **CHANGED**: `MAIL_FROM_ADDRESS` to `"no-reply@wmad-306.edu.ph"`

### `_setup/db_scripts/init.sql`
- **ADDED**: `CREATE DATABASE IF NOT EXISTS article_platform;` (was only `app_db`)

### `_setup/web_scripts/init.sh`
- **CHANGED**: `APP_NAME` from `"SAPP"` → `"Student Article Publication Platform"`
- **ADDED**: `APP_DEBUG=true` sed line
- **ADDED**: `MAIL_USERNAME`, `MAIL_PASSWORD` sed lines for consistency
- **CHANGED**: `MAIL_FROM_ADDRESS` from `"no-repy@wmad-306.edu.ph"` → `"noreply@article-platform.local"` (fixed typo)
- **ADDED**: `TELESCOPE_ENABLED=true` sed line
- **CHANGED**: `php artisan migrate` → `php artisan migrate --force`
- **ADDED**: `php artisan db:seed --force` — seeds roles, statuses, categories, test users
- **ADDED**: `php artisan telescope:install || echo "Telescope already installed"`
- **ADDED**: `php artisan config:clear` and `php artisan config:cache`

---

## 2. Database Schema — Migrations Added (src/database/migrations/)

All were **missing entirely** from `src/` and have been **created**:

| File | Purpose |
|------|---------|
| `2026_02_28_000001_create_article_statuses_table.php` | `article_statuses` table: id, name (unique), description, timestamps |
| `2026_02_28_000002_create_categories_table.php` | `categories` table: id, name (unique), slug (unique), description, timestamps |
| `2026_02_28_000003_create_articles_table.php` | `articles` table: id, title, slug, content, writer_id, editor_id, category_id, status_id, timestamps, softDeletes + FK constraints + indexes |
| `2026_02_28_000004_create_revisions_table.php` | `revisions` table: id, article_id, editor_id, feedback, timestamps + FK constraints + indexes |
| `2026_02_28_000005_create_comments_table.php` | `comments` table: id, article_id, student_id, content, timestamps + FK constraints + indexes |

**Spec compliance:** Foreign key constraints, indexes on FKs, soft deletes on articles, status as relation (status_id), revisions table for editor feedback — all implemented.

---

## 3. Models Added (src/app/Models/)

All were **missing** from `src/` and have been **created**:

| Model | Relationships |
|-------|---------------|
| `Article.php` | belongsTo: Writer, Editor, Category, Status; hasMany: Revisions, Comments; SoftDeletes; helper methods: `isPublished()`, `needsRevision()`, `isSubmitted()` |
| `ArticleStatus.php` | hasMany: Articles |
| `Revision.php` | belongsTo: Article, Editor |
| `Comment.php` | belongsTo: Article, Student |
| `Category.php` | hasMany: Articles |

### `User.php` — CHANGED
- **ADDED**: `use Spatie\Permission\Traits\HasRoles;` import
- **ADDED**: `HasRoles` trait to class
- **ADDED**: `writtenArticles()` — hasMany Article (writer_id)
- **ADDED**: `editedArticles()` — hasMany Article (editor_id)
- **ADDED**: `revisions()` — hasMany Revision (editor_id)
- **ADDED**: `comments()` — hasMany Comment (student_id)

---

## 4. Controllers Added (src/app/Http/Controllers/)

All were **missing** from `src/` and have been **created**:

| Controller | Methods | Middleware |
|------------|---------|------------|
| `WriterController.php` | `dashboard`, `create`, `store`, `edit`, `update`, `submit`, `destroy` | `auth`, `role:writer` |
| `EditorController.php` | `dashboard`, `review`, `requestRevision`, `publish` | `auth`, `role:editor` |
| `StudentController.php` | `dashboard`, `show`, `storeComment`, `deleteComment` | `auth`, `role:student` |

### `SampleController.php` — CHANGED
- **ADDED**: `use App\Models\User;` import
- **ADDED**: `assigningRoles()` method — creates test user with writer role for testing Spatie permissions

**Spec compliance:** All controllers use `$this->authorize(...)` for policy enforcement, return Inertia responses, and are slim with business logic delegated to models/policies.

---

## 5. Policies Added (src/app/Policies/)

Directory and files were **missing entirely** and have been **created**:

| Policy | Methods |
|--------|---------|
| `ArticlePolicy.php` | `create`, `edit`, `submit`, `review`, `requestRevision`, `publish`, `delete` |
| `CommentPolicy.php` | `create`, `delete` |

**Spec compliance:** Writers can only create/edit/submit/delete their own articles. Editors can review/request-revision/publish. Students can comment on published articles only.

---

## 6. Seeders Added/Changed (src/database/seeders/)

### Created:
| Seeder | Purpose |
|--------|---------|
| `RoleSeeder.php` | Creates permissions (create_article, edit_own_article, submit_article, review_article, request_revision, publish_article, comment_article, delete_own_article) + Writer/Editor/Student roles with appropriate permissions |
| `ArticleStatusSeeder.php` | Seeds: Draft, Submitted, Needs Revision, Published, Commented |
| `CategorySeeder.php` | Seeds: Technology, Business, Education, Science, Health |

### Changed:
| Seeder | Change |
|--------|--------|
| `DatabaseSeeder.php` | **Replaced** generic test user creation with proper seeder calls (RoleSeeder, ArticleStatusSeeder, CategorySeeder) + creates writer@example.com, editor@example.com, student@example.com with correct roles |

---

## 7. Routes Updated (src/routes/)

### `web.php` — CHANGED
- **ADDED**: Writer routes group (`/writer/*`) — dashboard, create, store, edit, update, submit, destroy
- **ADDED**: Editor routes group (`/editor/*`) — dashboard, review, request-revision, publish
- **ADDED**: Student routes group (`/student/*`) — dashboard, show, store-comment, delete-comment
- **ADDED**: `use` imports for WriterController, EditorController, StudentController
- All route groups use `role:` middleware from Spatie

### `sample.php` — CHANGED
- **ADDED**: `/assigning-roles` route → `SampleController::assigningRoles`

---

## 8. Service Providers Added/Changed

### Created:
| Provider | Purpose |
|----------|---------|
| `AuthServiceProvider.php` | Registers Article → ArticlePolicy and Comment → CommentPolicy mappings |
| `TelescopeServiceProvider.php` | Configures Laravel Telescope with filtering, sensitive data hiding, and access gate |

### Changed:
| File | Change |
|------|--------|
| `bootstrap/providers.php` | **ADDED**: `AuthServiceProvider::class` and `TelescopeServiceProvider::class` registrations |

---

## 9. Tests Added (src/tests/Unit/Policies/)

| Test File | Test Cases |
|-----------|------------|
| `ArticlePolicyTest.php` | 15 tests: writer can create/edit/submit/delete own articles; editor can review/request-revision/publish; students/editors cannot create; cross-user restrictions |
| `CommentPolicyTest.php` | 6 tests: student can comment on published articles; cannot comment on drafts; writers cannot comment; delete own comment; cannot delete others' comments |

---

## Summary

| Category | Added | Changed |
|----------|-------|---------|
| Migrations | 5 | 0 |
| Models | 5 | 1 (User.php) |
| Controllers | 3 | 1 (SampleController) |
| Policies | 2 | 0 |
| Seeders | 3 | 1 (DatabaseSeeder) |
| Providers | 2 | 1 (providers.php) |
| Routes | 0 | 2 (web.php, sample.php) |
| Tests | 2 | 0 |
| Config/Setup | 0 | 3 (.env.example, init.sh, init.sql) |
| **Total** | **22 files** | **9 files** |

All changes align the working `src/` project with the full Technical Specification covering: environment setup, roles & permissions, article lifecycle, database schema, models, controllers, policies, and unit tests.

---

## Phase 2 — Routes, Factories, Seeders & Docker Database

### 10. Routes Updated (src/routes/web.php)

Route names updated to match spec conventions (`articles.*` naming):

| Method | URI | Name | Role |
|--------|-----|------|------|
| GET | /writer/dashboard | writer.dashboard | writer |
| GET | /writer/articles/create | articles.create | writer |
| POST | /writer/articles | articles.store | writer |
| GET | /writer/articles/{article}/edit | articles.edit | writer |
| PATCH | /writer/articles/{article} | articles.update | writer |
| POST | /writer/articles/{article}/submit | articles.submit | writer |
| DELETE | /writer/articles/{article} | articles.destroy | writer |
| GET | /editor/dashboard | editor.dashboard | editor |
| GET | /editor/articles/{article}/review | editor.review | editor |
| POST | /editor/articles/{article}/revision | articles.revision | editor |
| POST | /editor/articles/{article}/publish | articles.publish | editor |
| GET | /student/dashboard | student.dashboard | student |
| GET | /student/articles/{article} | student.show | student |
| POST | /student/articles/{article}/comment | articles.comment | student |
| DELETE | /student/comments/{comment} | student.delete-comment | student |
| GET | /login | login | guest |
| GET | /register | register | guest |

**Changes:**
- `writer.create` → `articles.create`, `writer.store` → `articles.store`
- `writer.edit` → `articles.edit`, `writer.update` → `articles.update`
- `writer.submit` → `articles.submit`, `writer.destroy` → `articles.destroy`
- `editor.request-revision` → `articles.revision` (URI: `/revision` instead of `/request-revision`)
- `editor.publish` → `articles.publish`
- `student.store-comment` → `articles.comment` (URI: `/comment` instead of `/comments`)
- Added route documentation table as a comment block in `web.php`

---

### 11. Models Updated — HasFactory Trait

Added `HasFactory` trait to enable factory usage in seeders and tests:

| Model | Change |
|-------|--------|
| `Article.php` | Added `use HasFactory` (already had SoftDeletes) |
| `Revision.php` | Added `use HasFactory` |
| `Comment.php` | Added `use HasFactory` |
| `Category.php` | Added `use HasFactory` |

---

### 12. Factories Created (src/database/factories/)

| Factory | Fields | Notes |
|---------|--------|-------|
| `ArticleFactory.php` | title (sentence), slug (from title), content (paragraphs), writer_id, editor_id, category_id, status_id | States: `draft()`, `submitted()`, `needsRevision()`, `published()` |
| `RevisionFactory.php` | article_id, editor_id, feedback (paragraph) | Realistic editor feedback |
| `CommentFactory.php` | article_id, student_id, content (paragraph) | Realistic student comments |
| `CategoryFactory.php` | name (word), slug (from name), description (sentence) | Supports Article factory |

---

### 13. UserSeeder Created (src/database/seeders/UserSeeder.php)

Guarantees one user per role:

| Email | Name | Role | Password |
|-------|------|------|----------|
| writer@example.com | John Writer | writer | password |
| editor@example.com | Jane Editor | editor | password |
| student@example.com | Bob Student | student | password |

Uses `firstOrCreate` for idempotent seeding and `syncRoles` to avoid duplicate role assignments.

---

### 14. DatabaseSeeder Updated — Full Orchestration

**Seeder order** (avoids FK errors):
1. `RoleSeeder` — roles & permissions (no FK dependencies)
2. `ArticleStatusSeeder` — 5 statuses (no FK dependencies)
3. `CategorySeeder` — 5 categories (no FK dependencies)
4. `UserSeeder` — 3 users with roles (depends on roles)
5. `generateSampleData()` — articles, revisions, comments (depends on all above)

**Sample data generated:**
- 2 Draft articles (writer's work in progress)
- 2 Submitted articles (waiting for editor review)
- 2 Needs Revision articles (with 1-3 revision records from editor)
- 4 Published articles (with 1-4 comments from student, some with revision history)
- **Total: 10 articles, ~7 revisions, ~9 comments**

---

### 15. Composer.json Updated

- **ADDED**: `"laravel/telescope": "^5.18"` to `require-dev` — enables Telescope debugging

---

### 16. Docker Database Verification

**Database connection:** `localhost:3306` | User: `root` | Password: `123456` | Database: `app_db`

**19 tables verified:**

| Table | Records |
|-------|---------|
| article_statuses | 5 (Draft, Submitted, Needs Revision, Published, Commented) |
| articles | 10 (2 Draft, 2 Submitted, 2 Needs Revision, 4 Published) |
| categories | 5 (Technology, Business, Education, Science, Health) |
| comments | 9 (on published articles) |
| revisions | 7 (editor feedback on revision + published articles) |
| users | 3 (writer, editor, student with correct roles) |
| roles | 3 (writer, editor, student) |
| permissions | 8 |
| + Laravel system tables | sessions, cache, jobs, migrations, etc. |

**Access the database from your host machine:**
```bash
mysql -h 127.0.0.1 -P 3306 -u root -p123456 app_db
```

**Web application:** http://localhost:8000
**Mailpit (email testing):** http://localhost:8025
**Telescope (debugging):** http://localhost:8000/telescope

---

### 17. Docker Fix — Apache 403 Forbidden (compose.yaml)

**Problem:** Accessing `http://localhost:8000` returned `403 Forbidden`. Apache's default DocumentRoot was `/var/www/html/` but Laravel's entry point is at `/var/www/html/public/index.php`.

**Fix:** Added volume mount in `compose.yaml` to apply the custom Apache config:
```yaml
- ./_setup/web_scripts/apache.conf:/etc/apache2/sites-available/000-default.conf
```

This maps `_setup/web_scripts/apache.conf` (which sets `DocumentRoot /var/www/html/public` with `AllowOverride All` and `mod_rewrite`) directly into Apache's site config.

---

### 18. Docker Fix — Telescope Migration Duplicate Table Error (init.sh)

**Problem:** On container restart, `telescope:install` generated a new migration file each time. Since `migrate --force` ran before `telescope:install`, the telescope_entries table could already exist from a prior migration file, causing `SQLSTATE[42S01]: Base table or view already exists`.

**Fix:** Reordered `_setup/web_scripts/init.sh`:
1. Delete any pre-existing telescope migration files: `rm -f $WORKDIR/database/migrations/*create_telescope_entries_table.php`
2. Run `telescope:install` (generates fresh migration) **before** `migrate --force`
3. Then run `migrate --force` and `db:seed --force`

This ensures the telescope migration is always fresh and never duplicated.

---

## Updated Summary

| Category | Added | Changed |
|----------|-------|---------|
| Migrations | 5 | 0 |
| Models | 5 | 5 (User.php + HasFactory on 4) |
| Controllers | 3 | 1 (SampleController) |
| Policies | 2 | 0 |
| Seeders | 4 (Role, Status, Category, User) | 1 (DatabaseSeeder) |
| Factories | 4 (Article, Revision, Comment, Category) | 0 |
| Providers | 2 | 1 (providers.php) |
| Routes | 0 | 2 (web.php, sample.php) |
| Tests | 2 | 0 |
| Config/Setup | 0 | 5 (.env.example, init.sh, init.sql, composer.json, compose.yaml) |
| **Total** | **27 files** | **15 files** |
