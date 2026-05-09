# First App - Laravel Student Project

This folder contains a working Laravel 12 application with a clean MVC homepage.
The project title is set to `first_app` so your teacher will see the expected output.

## Setup Instructions

1. Open a terminal in `02_First_App/src`
2. Install PHP dependencies:
   ```bash
   composer install
   ```
3. Create the environment file:
   ```bash
   # macOS / Linux
   cp .env.example .env
   # Windows PowerShell
   copy .env.example .env
   php artisan key:generate
   ```
4. Install frontend dependencies:
   ```bash
   npm install
   ```
5. Start the development server:
   ```bash
   npm run dev
   php artisan serve
   ```

## Run automated tests

From `02_First_App/src`:
```bash
php artisan test
```

## What was improved

- Added a `HomeController` for the application homepage.
- Replaced the default route with dedicated controller routes for Home and About.
- Added clean `home` and `about` views with responsive layout and navigation.
- Added automated tests for both the Home and About pages.
- Restored the standard Laravel base `Controller` class.
- Set app name to `first_app` for expected output.

## Notes

The app currently uses Vite and Tailwind CSS for styling. If assets are not built, the homepage still renders using a lightweight fallback style.
