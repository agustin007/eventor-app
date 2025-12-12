FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (production only)
RUN npm ci --only=production

# Copy prisma schema
COPY prisma ./prisma/

# Generate Prisma Client
RUN npx prisma generate

# Copy source code
COPY src ./src

# Expose port
EXPOSE 10000

# Start command - runs migrations and seeds before starting server
CMD ["npm", "run", "start:prod"]
