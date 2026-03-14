# Operations Checklist

## CI gates
- Backend tests: `php artisan test --parallel`
- Frontend build: `npm run build`
- CI workflow: `.github/workflows/ci.yml`

## Pre-deploy
1. Pull latest code.
2. Install dependencies:
   - `composer install --no-interaction --prefer-dist --optimize-autoloader`
   - `npm ci`
3. Run migrations:
   - `php artisan migrate --force`
4. Build frontend:
   - `npm run build`
5. Clear caches:
   - `php artisan optimize:clear`

## Post-deploy checks
1. Open `/admin/dashboard`, `/admin/editorial-logs`, `/admin/audit-logs`.
2. Verify editor queue actions:
   - claim
   - request revision
   - reject
   - publish
   - approve public
3. Verify role switching writes an audit log entry.
4. Verify comment posting:
   - authenticated users can post
   - guest redirected to login
   - links are rejected by validation

## Rollback strategy
- Code rollback: deploy previous stable commit/tag.
- Database rollback (if needed):
  - `php artisan migrate:rollback --step=2`
  - Re-apply previous release migrations if required.
- If rollback includes schema changes affecting runtime queries, keep application in maintenance mode until schema and code are aligned.

## Performance notes
- Added indexes for hot paths:
  - `articles` (published/public, status, claim/publish, author/category, public approver)
  - `comments` (article/date, parent/date, user/date)
- Monitor slow query logs after deploy and adjust indexes if traffic patterns change.
