# Docker Setup (Windows + Linux)

This setup runs Laravel, MySQL, Nginx, Vite, and Mailpit (fake email inbox) in containers.
Laravel source code is in `src/`.

## 1) Create `.env`

If your project already has `.env.example`, containers will auto-copy it to `.env` on first run.  
You can also create `.env` manually and ensure these keys exist:

```env
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8080

DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=project_tracker
DB_USERNAME=laravel
DB_PASSWORD=secret
DB_ROOT_PASSWORD=root
```

## 2) Build and start

```bash
docker compose up --build -d
```

App URL: `http://localhost:8080`  
Vite URL: `http://localhost:5173`  
Mailpit Inbox: `http://localhost:8025`

## 3) Run Laravel commands

```bash
docker compose exec app php artisan migrate --seed
docker compose exec app php artisan test
```

## 4) Stop

```bash
docker compose down
```

## Windows + Linux compatibility notes

- Uses bind mounts and Docker Compose only, so commands are the same on both platforms.
- `UID/GID` defaults are safe; Linux users can override with:

```bash
UID=$(id -u) GID=$(id -g) docker compose up --build -d
```

- On Windows Docker Desktop, no `UID/GID` export is required.
