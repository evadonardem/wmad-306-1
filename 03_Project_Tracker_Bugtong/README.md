# Project Tracker - Rubric Mapping & Usage Guide

## Overview
This is a full-stack Project Tracker built with Laravel 12, React 18, Material UI 7, Inertia.js, and Docker Compose. It implements all rubric requirements for WMAD 306, including:
- Eloquent models, migrations, factories, seeders
- Policies, resource controllers, services, form requests
- Inertia.js SPA with React, MUI, and Vite
- Projects and Tasks CRUD, dialogs, validation, navigation, and UX

---

## Rubric Mapping

### Data Model & Migrations
- **User, Project, Task** models: see `app/Models/`
- **Migrations**: see `database/migrations/`
- **Factories/Seeders**: see `database/factories/`, `database/seeders/`

### Backend
- **Policies**: `app/Policies/`, registered in `AuthServiceProvider.php`
- **Controllers**: `app/Http/Controllers/` (ProjectController, TaskController)
- **Services**: `app/Services/` (ProjectService, TaskService)
- **Form Requests**: `app/Http/Requests/`
- **Routes**: `routes/web.php` (resourceful, nested, Inertia-ready)

### Frontend
- **Pages**: `resources/js/Pages/Projects/`, `resources/js/Pages/Tasks/`
- **Components**: `resources/js/components/`
- **MUI, Inertia, Vite**: see `package.json`, `vite.config.js`
- **CRUD, Dialogs, Validation**: Projects/Tasks pages, EditCreateDialog, TaskForm
- **UX**: AppBar, Drawer, navigation, chips, snackbars, empty states

---



