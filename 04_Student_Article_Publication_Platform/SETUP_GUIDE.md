# Student Article Publication Platform - Setup Guide

A complete Laravel Breeze + InertiaJS + React + Material UI backend for a student article publication platform with role-based access control, article lifecycle management, and Mailtrap email integration.

## Prerequisites

- PHP 8.2+
- MySQL 8.0+
- Composer
- Node.js & npm

## Installation Instructions

### 1. Clone the Repository

```bash
cd src
```

### 2. Install PHP Dependencies

```bash
composer install
```

### 3. Install Node Dependencies

```bash
npm install
```

### 4. Environment Configuration

```bash
cp .env.example .env
```

Update the `.env` file with your credentials:

```env
# Database Configuration
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=article_platform
DB_USERNAME=root
DB_PASSWORD=

# Mail Configuration (Mailtrap)
MAIL_MAILER=mailtrap
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=465
MAIL_USERNAME=your_mailtrap_username
MAIL_PASSWORD=your_mailtrap_password
MAIL_FROM_ADDRESS="noreply@article-platform.local"

# Enable Telescope for Debugging
TELESCOPE_ENABLED=true
```

### 5. Generate Application Key

```bash
php artisan key:generate
```

### 6. Run Database Migrations

```bash
php artisan migrate
```

### 7. Seed the Database

```bash
php artisan db:seed
```

This will create:
- **Roles**: Writer, Editor, Student
- **Permissions**: Create, edit, submit, review, publish articles, and comment
- **Test Users**: One per role with credentials:
  - Writer: `writer@example.com` / `password`
  - Editor: `editor@example.com` / `password`
  - Student: `student@example.com` / `password`
- **Article Statuses**: Draft, Submitted, Needs Revision, Published, Commented
- **Categories**: Technology, Business, Education, Science, Health

> **Tip:** the route middleware aliases `role` and `permission` used in this
> project are provided by the [Spatie Laravel Permission](https://spatie.be/
> docs/laravel-permission) package.  After installing the package make sure the
> following entries appear in your `app/Http/Kernel.php`:
>
> ```php
> 'role'       => \Spatie\Permission\Middlewares\RoleMiddleware::class,
> 'permission' => \Spatie\Permission\Middlewares\PermissionMiddleware::class,
> ```
>
> If you prefer not to use Spatie, either remove the `role:`/`permission:`
> prefixes from the route definitions or replace them with your own middleware
> that checks `role_id` or similar.
> 
> A quick way to verify the access control is working is to temporarily comment
> out the `role:writer` middleware on a route and ensure the page loads for a
> logged-in user; if it does, then the kernel aliases need to be added.


### 8. Build Frontend Assets

```bash
npm run dev
```

For production:
```bash
npm run build
```

### 9. Start Development Server

```bash
php artisan serve
```

The application will be available at `http://localhost:8000`

## Project Structure

### Database Schema

#### Users Table
- Standard Laravel authentication table with Spatie Permission traits

#### Articles Table
- `id`: Primary key
- `title`: Article title
- `slug`: URL-friendly slug
- `content`: Article content (long text)
- `writer_id`: Foreign key to users (article creator)
- `editor_id`: Foreign key to users (editor, nullable)
- `category_id`: Foreign key to categories
- `status_id`: Foreign key to article_statuses
- `created_at`, `updated_at`: Timestamps
- `deleted_at`: Soft delete timestamp

#### Article Statuses Table
- `id`: Primary key
- `name`: Status name (Draft, Submitted, Needs Revision, Published, Commented)
- `description`: Status description

#### Categories Table
- `id`: Primary key
- `name`: Category name
- `slug`: URL-friendly slug
- `description`: Category description
- `created_at`, `updated_at`: Timestamps

#### Revisions Table
- `id`: Primary key
- `article_id`: Foreign key to articles
- `editor_id`: Foreign key to users (editor providing feedback)
- `feedback`: Revision feedback text
- `created_at`, `updated_at`: Timestamps

#### Comments Table
- `id`: Primary key
- `article_id`: Foreign key to articles
- `student_id`: Foreign key to users
- `content`: Comment content
- `created_at`, `updated_at`: Timestamps

### Models & Relationships

#### User Model
- `writtenArticles()`: Has many articles (as writer)
- `editedArticles()`: Has many articles (as editor)
- `revisions()`: Has many revisions (as editor)
- `comments()`: Has many comments (as student)

#### Article Model
- `writer()`: Belongs to User (writer)
- `editor()`: Belongs to User (editor)
- `category()`: Belongs to Category
- `status()`: Belongs to ArticleStatus
- `revisions()`: Has many Revisions
- `comments()`: Has many Comments
- `isPublished()`: Helper method to check if published
- `needsRevision()`: Helper method to check if needs revision
- `isSubmitted()`: Helper method to check if submitted

#### ArticleStatus Model
- `articles()`: Has many Articles

#### Category Model
- `articles()`: Has many Articles

#### Revision Model
- `article()`: Belongs to Article
- `editor()`: Belongs to User

#### Comment Model
- `article()`: Belongs to Article
- `student()`: Belongs to User

### Authorization Policies

#### ArticlePolicy
- `create()`: Only writers can create articles
- `edit()`: Only the original writer can edit their own article
- `submit()`: Only the writer can submit their article
- `review()`: Only editors can review articles
- `requestRevision()`: Only editors can request revisions
- `publish()`: Only editors can publish articles
- `delete()`: Only the writer can delete their own article

#### CommentPolicy
- `create()`: Only students can comment on published articles
- `delete()`: Only the comment author (student) can delete their own comment

### API Endpoints

#### Writer Routes (`/writer`)
- `GET /dashboard`: View writer dashboard
- `GET /articles/create`: Show create article form
- `POST /articles`: Store new article
- `GET /articles/{article}/edit`: Show edit form
- `PATCH /articles/{article}`: Update article
- `POST /articles/{article}/submit`: Submit article for review
- `DELETE /articles/{article}`: Delete article

#### Editor Routes (`/editor`)
- `GET /dashboard`: View editor dashboard with articles for review
- `GET /articles/{article}/review`: View article for review
- `POST /articles/{article}/request-revision`: Request revision with feedback
- `POST /articles/{article}/publish`: Publish article

#### Student Routes (`/student`)
- `GET /dashboard`: View published articles
- `GET /articles/{article}`: View article details
- `POST /articles/{article}/comments`: Post comment
- `DELETE /comments/{comment}`: Delete own comment

## Article Lifecycle

1. **Draft**: Writer creates and saves article (initial state)
2. **Submitted**: Writer submits article for editor review
3. **Needs Revision**: Editor reviews and requests changes with feedback
4. **Published**: Editor approves and publishes article (becomes visible to students)
5. **Commented**: Students can comment on published articles

## Testing

Run unit tests for policies:

```bash
php artisan test tests/Unit/Policies/ArticlePolicyTest.php
php artisan test tests/Unit/Policies/CommentPolicyTest.php
```

## Debugging with Telescope

Telescope is enabled for debugging. Access it at:
```
http://localhost:8000/telescope
```

## Mail Configuration with Mailtrap

1. Sign up at [Mailtrap.io](https://mailtrap.io)
2. Create a new inbox
3. Get your SMTP credentials
4. Update your `.env` file with credentials
5. Test email sending via Telescope Mail tab

## Docker Compose Setup

If using Docker, see `compose.yaml` for container configuration including:
- Laravel web service
- MySQL database
- Health checks for all services

To run with Docker:

```bash
docker-compose up -d
docker-compose exec app php artisan migrate
docker-compose exec app php artisan db:seed
```

## Key Features Implemented

✅ Laravel Breeze authentication
✅ InertiaJS + React integration
✅ Spatie Permission (Roles & Permissions)
✅ Article lifecycle with statuses
✅ Soft deletes for articles
✅ Role-based access control with policies
✅ Article revisions tracking
✅ Commenting system for published articles
✅ Category management
✅ Mailtrap email integration
✅ Comprehensive unit tests
✅ Timestamps for accountability
✅ Foreign key constraints
✅ Database indexes for performance
✅ Normalized schema design

## Troubleshooting

### Migration Errors
- Ensure MySQL is running
- Check database credentials in `.env`
- Run `php artisan migrate:reset` and `php artisan migrate` if needed

### Permission Errors
- Clear permission cache: `php artisan permission:cache-reset`
- Ensure roles are properly seeded: `php artisan db:seed`

### Mail Not Sending
- Verify Mailtrap credentials in `.env`
- Check Mailtrap SMTP settings
- Review logs in `storage/logs/laravel.log`

### Telescope Not Working
- Ensure `TELESCOPE_ENABLED=true` in `.env`
- Run: `php artisan telescope:install`

## Support

For issues or questions, refer to:
- [Laravel Documentation](https://laravel.com/docs)
- [Spatie Permission](https://spatie.be/docs/laravel-permission)
- [Inertia.js Documentation](https://inertiajs.com)
