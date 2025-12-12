#!/bin/sh
set -e

echo "[Startup] Running database setup..."

# Force reset DB to drop old .NET tables and create fresh schema
npx prisma db push --force-reset --accept-data-loss || echo "[Startup] Schema push failed, continuing..."

# Generate Prisma Client (always needed)
echo "[Startup] Generating Prisma Client..."
npx prisma generate

# Run seeder (will skip if data exists)
echo "[Startup] Running seeder..."
npm run prisma:seed || echo "[Startup] Seed skipped or failed, continuing..."

# Start the server
echo "[Startup] Starting server..."
exec node src/index.js
