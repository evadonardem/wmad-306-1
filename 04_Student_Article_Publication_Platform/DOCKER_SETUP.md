# Student Article Publication Platform - Docker Setup Guide

## Quick Start with Docker Compose

### Prerequisites
- Docker & Docker Compose installed
- Git (to clone the repository)

### Step 1: Clone and Setup

```bash
# Clone repository
git clone <repo-url>
cd 04_Student_Article_Publication_Platform

# Create .env file from example
cp src/.env.example src/.env
```

### Step 2: Run Docker Compose

```bash
# Start all services (Laravel, MySQL, Mailpit, with health checks)
docker-compose up -d

# Wait for services to be healthy (watch the logs)
docker-compose logs -f

# Once you see "Initialization complete", the app is ready
```

### Step 3: Access the Application

- **Application**: http://localhost:8000
- **Mailpit (Email Testing)**: http://localhost:8025
- **Database**: localhost:3306 (MySQL)

## Test User Credentials

After Docker initialization completes, use these credentials to login:

### Writer Account
- Email: `writer@example.com`
- Password: `password`
- Access: `/writer/dashboard`

### Editor Account  
- Email: `editor@example.com`
- Password: `password`
- Access: `/editor/dashboard`

### Student Account
- Email: `student@example.com`
- Password: `password`
- Access: `/student/dashboard`

## Test the Role Assignment Endpoint

Visit the sample endpoint to see Spatie Permission in action:
```
http://localhost:8000/sample/assigning-roles
```

This demonstrates:
- Role creation with `Spatie\Permission\Models\Role`
- User role assignment
- JSON response with user and roles data

## Docker Services Configuration

### Web Service
- **Image**: evadonardem/wmad-306:latest
- **Port**: 8000 (HTTP), 5173 (Vite Dev)
- **Health Check**: Automatic (waits for MySQL to be healthy)
- **Auto-runs**: 
  - `composer install`
  - `npm install`
  - Database migrations
  - Database seeding with roles, statuses, categories, and test users
  - Telescope installation
  - Asset compilation

### MySQL Database
- **Image**: mysql:9.6.0
- **Port**: 3306
- **Root Password**: 123456
- **Database**: article_platform
- **Health Check**: mysqladmin ping test
- **Volume**: db_data (persists between restarts)

### Mailpit (Email Testing)
- **Image**: axllent/mailpit:latest
- **SMTP Port**: 1025
- **Web UI**: http://localhost:8025
- **No Auth Required**: Perfect for local testing
- **Captures all emails** without sending

## Database & Seeding

The Docker initialization automatically runs:

1. **Migrations**: Creates all tables
   - Users, Articles, ArticleStatuses, Categories, Revisions, Comments
   - Spatie Permission tables (roles, permissions)

2. **Seeders**: Populates initial data
   - **RoleSeeder**: writer, editor, student roles with permissions
   - **ArticleStatusSeeder**: Draft, Submitted, Needs Revision, Published, Commented
   - **CategorySeeder**: Technology, Business, Education, Science, Health
   - **DatabaseSeeder**: Test users (one per role)

3. **Telescope**: Enabled for debugging
   - Access at: http://localhost:8000/telescope

## Architecture Overview

### 1. Roles & Permissions (Spatie)
- **Writer**: Create, edit own, submit articles
- **Editor**: Review, request revisions, publish articles
- **Student**: Comment on published articles

### 2. Article Lifecycle
```
Draft → Submitted → Needs Revision OR Published → Commented
```

### 3. Database Schema
- **Articles**: Main content with soft deletes
- **ArticleStatuses**: Lifecycle tracking
- **Categories**: Content organization
- **Revisions**: Editor feedback history
- **Comments**: Student engagement
- **Users**: Authentication with Spatie roles

### 4. Authorization (Policies)
- **ArticlePolicy**: Controls who can create, edit, submit, review, publish
- **CommentPolicy**: Controls commenting access

### 5. API Routes & Middleware
- **Writer Routes** (`/writer`): Create, edit, submit articles
- **Editor Routes** (`/editor`): Review and publish articles
- **Student Routes** (`/student`): View and comment on articles
- **All routes protected** with `role:writer`, `role:editor`, `role:student` middleware

## Useful Docker Commands

```bash
# View logs
docker-compose logs -f web

# Access Laravel Artisan
docker-compose exec web php artisan migrate
docker-compose exec web php artisan db:seed

# Access MySQL
docker-compose exec db mysql -u root -p123456 article_platform

# Restart services
docker-compose restart

# Stop services
docker-compose down

# Full reset (WARNING: loses data)
docker-compose down -v
docker-compose up -d
```

## Email Testing with Mailpit

1. Visit http://localhost:8025
2. All emails sent during development are captured here
3. Perfect for testing email notifications without external SMTP

## Debugging with Telescope

1. Visit http://localhost:8000/telescope
2. View all requests, queries, cache, mail, and exceptions
3. Essential for development debugging

## Production Deployment Notes

For production with real Mailtrap:
1. Update `src/.env` with actual Mailtrap credentials
2. Set `APP_ENV=production`
3. Set `TELESCOPE_ENABLED=false`
4. Use proper MySQL credentials
5. Configure backups for data volume

## Troubleshooting

### Services won't start
```bash
# Check health status
docker-compose ps

# View detailed logs
docker-compose logs web
docker-compose logs db
docker-compose logs mailtrap
```

### Database connection failed
Wait for MySQL health check to pass (30 seconds). Check:
```bash
docker-compose logs db
```

### Migrations already run
Migrations are idempotent. Safe to re-run:
```bash
docker-compose exec web php artisan migrate --force
```

### Seeders already ran
Seeders use `firstOrCreate` and `updateOrCreate` for idempotency. Safe to re-run:
```bash
docker-compose exec web php artisan db:seed --force
```

## File Structure

```
04_Student_Article_Publication_Platform/
├── src/                          # Laravel application
│   ├── app/
│   │   ├── Http/Controllers/     # WriterController, EditorController, StudentController
│   │   ├── Models/               # Article, User, Comment, etc.
│   │   ├── Policies/             # ArticlePolicy, CommentPolicy
│   │   └── Providers/            # AuthServiceProvider
│   ├── database/
│   │   ├── migrations/           # All table definitions
│   │   ├── seeders/              # RoleSeeder, CategorySeeder, etc.
│   │   └── factories/            # User factory
│   ├── routes/
│   │   ├── web.php              # API routes with role middleware
│   │   └── sample.php           # Sample endpoints
│   ├── tests/Unit/Policies/     # Policy unit tests
│   └── .env.example             # Environment template
├── compose.yaml                  # Docker Compose configuration
├── _setup/
│   ├── db_scripts/init.sql      # Database initialization
│   └── web_scripts/             # Installation scripts
└── DOCKER_SETUP.md              # This file
```

## Summary

This complete backend provides:
✅ Role-based access control (RBAC)
✅ Article publication workflow
✅ Editor feedback system
✅ Student commenting
✅ Soft deletes for data preservation
✅ Comprehensive authorization policies
✅ Unit tests for all policies
✅ Docker setup with health checks
✅ Automatic migrations and seeding
✅ Mailpit for email testing
✅ Telescope for debugging
✅ Clean, RESTful API design
✅ Production-ready code

Ready for frontend development with React/InertiaJS + Material UI!
