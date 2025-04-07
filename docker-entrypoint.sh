#!/bin/sh
set -e

# Change to the app directory
cd /app

echo "Initializing MariaDB Tables..."
npx --yes prisma db push

# Start the server
echo "Starting Backend..."
exec "$@"
