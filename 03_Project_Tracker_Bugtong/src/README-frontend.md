# Project Tracker Frontend (Inertia + React + MUI)

## Installation & Setup

1. **Install dependencies:**
   ```sh
   npm install @mui/material @mui/icons-material @mui/x-data-grid @emotion/react @emotion/styled
   ```
2. **Run Vite dev server:**
   ```sh
   npm run dev
   ```
3. **Build for production:**
   ```sh
   npm run build
   ```
4. **Laravel backend:**
   - Ensure your backend is running and exposes the required Inertia routes.

## File Structure & Mapping

- `resources/js/app.jsx`: Inertia setup, MUI ThemeProvider, dark mode, Feedback provider
- `resources/js/theme/index.js`: MUI theme (light/dark), palette, typography, overrides
- `resources/js/layouts/AppLayout.jsx`: AppShell (AppBar, Drawer, Content)
- `resources/js/components/TopBar.jsx`: AppBar, dark mode toggle, user menu
- `resources/js/components/SideNav.jsx`: Drawer, Dashboard/Projects links, recent projects
- `resources/js/components/ConfirmDialog.jsx`: Reusable confirm dialog
- `resources/js/components/Feedback.jsx`: Snackbar provider/hook
- `resources/js/components/PriorityChip.jsx`: Priority chips (low, medium, high, critical)
- `resources/js/components/StatusChip.jsx`: Status chips (todo, in_progress, done)
- `resources/js/components/EmptyState.jsx`: Empty state with CTA
- `resources/js/components/LoadingSkeleton.jsx`: Card/list skeletons
- `resources/js/Pages/Dashboard/Index.jsx`: Dashboard (recent projects, task stats)
- `resources/js/Pages/Projects/Index.jsx`: Projects grid, add/edit/delete
- `resources/js/Pages/Projects/ProjectDialog.jsx`: Create/edit project dialog
- `resources/js/Pages/Projects/Show.jsx`: Project header, tabs, task list
- `resources/js/Pages/Tasks/TaskList.jsx`: Tasks table (MUI DataGrid)
- `resources/js/Pages/Tasks/TaskDialog.jsx`: Create/edit task dialog

## Acceptance Criteria Mapping

- Projects & Tasks CRUD: **✓**
- Priority select: **✓**
- Status toggle via Inertia POST: **✓**
- MUI front-end pages: **✓**
- User → Project → Task hierarchy visible: **✓**

## Notes
- All UI uses MUI components only (no Bootstrap/Tailwind in Inertia pages).
- Auth state: If authenticated, show avatar/menu; if not, show “Sign in”—never both.
- All routes and data contracts follow the Student Manual specs.
- Theming, AppShell, and all UI interactions are fully responsive and accessible.
