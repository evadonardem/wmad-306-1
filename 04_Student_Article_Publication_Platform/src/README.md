# Student Article Publication Platform (SAPP)

A modern web application built with Laravel 12, React, and Inertia.js for students to create, publish, and share articles.

## Features

- **User Authentication**: Secure login and registration system
- **Role-Based Access Control**: Admin, Teacher, and Student roles with different permissions
- **Rich Text Editor**: Jodit editor for creating formatted articles
- **Article Management**: Create, edit, publish, and delete articles
- **Responsive Design**: Material-UI components for a modern, mobile-friendly interface
- **Email Notifications**: Integrated with Mailtrap for testing email functionality

## Technology Stack

- **Backend**: Laravel 12 (PHP 8.2+)
- **Frontend**: React 18 with Inertia.js
- **Database**: MySQL 9.6
- **UI Framework**: Material-UI (MUI)
- **Rich Text Editor**: Jodit React
- **Authentication**: Laravel Breeze
- **Permissions**: Spatie Laravel Permission
- **Email**: Mailtrap (for development)
- **Containerization**: Docker & Docker Compose

## Quick Start with Docker

1. **Prerequisites**:
   - Docker and Docker Compose installed
   - At least 4GB RAM available

2. **Clone and Setup**:
   ```bash
   cd 04_Student_Article_Publication_Platform
   docker-compose up --build
   ```

3. **Access the Application**:
   - Web App: http://localhost:8000
   - Vite Dev Server: http://localhost:5173
   - Mailtrap Web UI: http://localhost:8025

## Manual Setup (Alternative)

If Docker is not available:

1. **Install Dependencies**:
   ```bash
   composer install
   npm install
   ```

2. **Environment Setup**:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

3. **Database Setup**:
   - Configure your database in `.env`
   - Run migrations: `php artisan migrate`
   - Seed the database: `php artisan db:seed`

4. **Build Assets**:
   ```bash
   npm run build
   ```

5. **Start the Application**:
   ```bash
   php artisan serve
   npm run dev
   ```

## Default Users

After seeding, you can log in with these accounts:

- **Admin**: admin@wmad-306.edu.ph
- **Teacher**: teacher@wmad-306.edu.ph
- **Student**: student@wmad-306.edu.ph

Password for all accounts: `password`

## Project Structure

```
src/
├── app/
│   ├── Http/Controllers/
│   │   ├── ArticleController.php
│   │   └── SampleController.php
│   ├── Models/
│   │   ├── Article.php
│   │   └── User.php
│   ├── Policies/
│   │   └── ArticlePolicy.php
│   └── Providers/
├── database/
│   ├── factories/
│   │   └── ArticleFactory.php
│   ├── migrations/
│   │   ├── 2026_05_12_000000_create_articles_table.php
│   │   └── ... (other migrations)
│   └── seeders/
├── public/
├── resources/
│   ├── css/
│   ├── js/
│   │   ├── Components/
│   │   ├── Layouts/
│   │   └── Pages/
│   │       ├── Articles/
│   │       └── Auth/
│   └── views/
├── routes/
│   ├── web.php
│   └── api.php
└── tests/
```

## Key Features Explained

### Article Management
- Students can create draft articles and publish them
- Rich text editing with Jodit editor
- Articles support HTML formatting, images, and links
- Status tracking (draft/published) with timestamps

### User Roles & Permissions
- **Students**: Can create, edit, and delete their own articles
- **Teachers**: Can view all articles and manage any article
- **Admins**: Full system access including user management

### Security Features
- CSRF protection
- Input validation and sanitization
- Authorization policies for all actions
- Secure password hashing

## Development Commands

```bash
# Run tests
php artisan test

# Run linter
./vendor/bin/pint

# Generate IDE helper files
php artisan ide-helper:generate

# Clear cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

## API Endpoints

- `GET /` - Welcome page
- `GET /dashboard` - User dashboard
- `GET /articles` - List articles
- `POST /articles` - Create article
- `GET /articles/{id}` - View article
- `PUT /articles/{id}` - Update article
- `DELETE /articles/{id}` - Delete article

## Troubleshooting

### Common Issues

1. **Permission Errors**: Ensure proper file permissions for storage and bootstrap/cache directories
2. **Database Connection**: Verify database credentials in `.env` file
3. **Node Modules**: Run `npm install` if frontend assets don't load
4. **Docker Issues**: Check Docker Desktop is running and has sufficient resources

### Logs
- Application logs: `storage/logs/laravel.log`
- Docker logs: `docker-compose logs`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and ensure code quality
5. Submit a pull request

## License

This project is developed for educational purposes as part of the WMAD-306 course.

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
