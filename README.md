# Simple App

This is a full-stack Simple App containing a **NestJS Backend**, **Next.js Frontend**, and **MongoDB**.

## Project Structure

- `/backend` - NestJS API
- `/frontend` - Next.js Client
- `docker-compose.yml` - Docker setup for the entire stack

## Running with Docker (Recommended)

1. Ensure Docker and Docker Compose are installed.
2. In the root directory, run:
   ```bash
   docker-compose up -d
   ```
3. Frontend will be available at `http://localhost:3000`
4. Backend API will be available at `http://localhost:3001` (Swagger docs at `/docs`)

---

## Running Locally (Without Docker)

### Backend

1. Navigate to `/backend`
2. Install dependencies: `npm install`
3. Create `.env` file with:
   ```env
   PORT=3001
   MONGODB_URI=mongodb://localhost:27017/simple-app
   ```
4. Start the application: `npm run start:dev`

### Frontend

1. Navigate to `/frontend`
2. Install dependencies: `npm install`
3. Create `.env.local` file with:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```
4. Start the development server: `npm run dev`

---

## Features

- **Frontend**: Next.js, Tailwind CSS, TypeScript. Includes login screen, CRUD dashboard, real-time client-side validation.
- **Backend**: NestJS, MongoDB. Includes Swagger UI for API docs, strict validation with `class-validator`, full CRUD functionality.
