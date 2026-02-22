# wmad-306-1

## Setup Instructions

This is a Laravel project running in Docker. Follow these steps to get it running locally:

### Prerequisites
- Docker Desktop installed
- Docker Compose (comes with Docker Desktop)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd wmad-306-1
   ```

2. **Navigate to the project**
   ```bash
   cd 01_Development_Environment_Setup_Gabol
   ```

3. **Copy the environment file**
   ```bash
   cp src/.env.example src/.env
   ```

4. **Start Docker containers**
   ```bash
   docker compose up -d --build
   ```

5. **Generate Laravel app key** (inside the web container)
   ```bash
   docker compose exec -T web bash -c "cd /var/www/html && php artisan key:generate"
   ```

6. **Run database migrations**
   ```bash
   docker compose exec -T web bash -c "cd /var/www/html && php artisan migrate --force"
   ```

7. **Access the application**
   - Open your browser and go to: `http://localhost:8000`
   - You should see "Successfully installed Laravel!! Joshkane Gabol"

### Available Routes
- `http://localhost:8000/` - Welcome page
- `http://localhost:8000/about` - About page
- `http://localhost:8000/insert-user` - Create a test user in the database

### Services
- **Web Server**: http://localhost:8000 (Apache with PHP)
- **Database**: localhost:3306 (MySQL)
- **Mailpit**: http://localhost:8025 (Email testing)
- **Vite Dev Server**: http://localhost:5173 (Frontend build tool)

### Stopping the containers
```bash
docker compose down
```

### Troubleshooting

If you get permission issues, make sure to:
- Check that Docker is running
- Ensure adequate disk space
- Try running with elevated permissions if needed

For more information, see the Laravel documentation: https://laravel.com/docs