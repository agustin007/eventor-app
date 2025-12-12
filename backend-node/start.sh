#!/bin/sh
set -e

echo "[Startup] Running database setup..."

# Try to push schema, but don't fail if it already exists
npx prisma db push --accept-data-loss || echo "[Startup] Schema already exists or push failed, continuing..."

# Generate Prisma Client (always needed)
echo "[Startup] Generating Prisma Client..."
npx prisma generate

# Run seeder (will skip if data exists)
echo "[Startup] Running seeder..."
npm run prisma:seed || echo "[Startup] Seed skipped or failed, continuing..."

# Start the server
echo "[Startup] Starting server..."
exec node src/index.js
