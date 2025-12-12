# Eventor API - Node.js Backend

Backend API for Eventor event discovery platform, built with Node.js, Express, and Prisma.

## Tech Stack

- **Runtime**: Node.js 18
- **Framework**: Express.js
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Auth**: JWT + bcrypt

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables (copy `.env.example` to `.env`)

3. Run migrations:
```bash
npx prisma db push
```

4. Seed database:
```bash
npm run prisma:seed
```

5. Start dev server:
```bash
npm run dev
```

Server runs on `http://localhost:10000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token

### Events
- `GET /api/events` - Get all events (query: `?category=Music`)
- `GET /api/events/:id` - Get event by ID

### Tickets
- `POST /api/tickets/purchase` - Purchase ticket (protected)
- `GET /api/tickets/my-tickets` - Get user's tickets (protected)

## Deployment (Render)

1. Push to GitHub
2. Create new Web Service in Render
3. Configure environment variables
4. Deploy!
