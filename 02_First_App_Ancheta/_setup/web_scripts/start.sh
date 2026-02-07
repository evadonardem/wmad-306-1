#!/bin/bash
set -e

WORKDIR=/var/www/html

# Run initialization
/scripts/init.sh

# Change to working directory
cd $WORKDIR

# Start Vite dev server in background
echo "Starting Vite development server..."
npm run dev > /var/log/vite.log 2>&1 &
VITE_PID=$!
echo "Vite server started with PID $VITE_PID"

# Give Vite a moment to start
sleep 3

# Start Apache in foreground
echo "Starting Apache..."
exec apache2-foreground
