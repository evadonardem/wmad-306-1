#!/usr/bin/env bash

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../src" && pwd)"

echo "Scaffolding Student Article Publication Platform structure in: $ROOT"

# Controllers by responsibility (Auth, admin, role-specific, and shared logic)
mkdir -p "$ROOT/app/Http/Controllers/"{Auth,Admin,Writer,Editor,Student,Shared}

# Policies for authorization boundaries
mkdir -p "$ROOT/app/Policies"

# Domain models (article workflow entities)
mkdir -p "$ROOT/app/Models"

# Notification classes for workflow events
mkdir -p "$ROOT/app/Notifications"

# Business logic services (orchestration layer)
mkdir -p "$ROOT/app/Services"

# Route segmentation by user role
mkdir -p "$ROOT/routes"

# Inertia page tree split by role plus shared UI
mkdir -p "$ROOT/resources/js/Pages/Auth"
mkdir -p "$ROOT/resources/js/Pages/Admin"
mkdir -p "$ROOT/resources/js/Pages/Writer/Components"
mkdir -p "$ROOT/resources/js/Pages/Editor/Components"
mkdir -p "$ROOT/resources/js/Pages/Student/Components"
mkdir -p "$ROOT/resources/js/Pages/Shared/Layouts"
mkdir -p "$ROOT/resources/js/Pages/Shared/Components"
mkdir -p "$ROOT/resources/js/Pages/Sample"

# Data-layer scaffolding
mkdir -p "$ROOT/database/migrations"
mkdir -p "$ROOT/database/seeders"
mkdir -p "$ROOT/database/factories"

echo "Folder scaffolding complete."
echo "Next: add/update files (controllers, models, policies, routes, pages, migrations, seeders)."