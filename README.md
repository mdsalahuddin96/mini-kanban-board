# Mini Kanban Board Application

A full-stack Mini Kanban Board application built with **Next.js**, **Express TypeScript**, **Prisma ORM**, and **PostgreSQL**, fully containerized using **Docker** and deployed on **Vercel** and **Render**.

---

## 🔗 Live Demo & Links

- **Frontend (Live App):** [https://mini-kanban-board-omega.vercel.app](https://mini-kanban-board-omega.vercel.app)
- **Backend API (Production):** [https://mini-kanban-board-mge1.onrender.com/api/health](https://mini-kanban-board-mge1.onrender.com/api/health)
- **GitHub Repository:** [https://github.com/mdsalahuddin96/mini-kanban-board](https://github.com/mdsalahuddin96/mini-kanban-board)

---

## 🛠️ Tech Stack

- **Frontend:** Next.js (App Router), React, Tailwind CSS
- **Backend:** Node.js, Express, TypeScript
- **Database & ORM:** PostgreSQL (Supabase/Neon/Render Managed), Prisma ORM
- **Containerization:** Docker, Docker Compose
- **Deployment & Hosting:** Vercel (Frontend), Render (Backend), Managed PostgreSQL (Database)

---

## ⚙️ Environment Variables Setup

### 1. Backend (`backend/.env`)

Create a `.env` file inside the `backend/` directory:

```env
PORT=5000
JWT_SECRET="super_secret_jwt_key_kanban_2026"

# For Docker Development:
DATABASE_URL="postgresql://kanban_user:kanban_password@postgres:5432/kanban_db?schema=public"

# For Local Development (Without Docker):
# DATABASE_URL="postgresql://postgres:your_local_password@localhost:5432/kanban_db?schema=public"

# For Production (Render Deployment):
# DATABASE_URL="postgresql://user:password@cloud_db_host:5432/kanban_db?sslmode=require"

```

### 2. Frontend (`frontend/.env.local`)

Create a `.env.local` file inside the `frontend/` directory:

```env
# Local Development:
NEXT_PUBLIC_API_URL="http://localhost:5000/api"

# Production (Set in Vercel Dashboard):
# NEXT_PUBLIC_API_URL="[https://mini-kanban-board.onrender.com/api](https://mini-kanban-board.onrender.com/api)"

```

---

## 🚀 Getting Started (Local Setup)

### Option A: Run with Docker Compose (Recommended)

Make sure you have [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

1. **Clone the repository:**
```bash
git clone [https://github.com/mdsalahuddin96/mini-kanban-board.git](https://github.com/mdsalahuddin96/mini-kanban-board.git)
cd mini-kanban-board

```


2. **Set up backend environment variables:**
Create `backend/.env` as shown in the section above.
3. **Build and start all containers:**
```bash
docker compose up --build -d

```


4. **Verify running containers:**
```bash
docker compose ps

```


5. **Access the applications:**
* **Frontend App:** [http://localhost:3000](http://localhost:3000)
* **Backend API:** [http://localhost:5000](http://localhost:5000)



---

### Option B: Run Locally Without Docker

#### Prerequisites

* Node.js (v18 or v20)
* PostgreSQL running locally

#### 1. Database Setup

Create a local PostgreSQL database named `kanban_db`.

#### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Generate Prisma Client & Push Schema
npx prisma generate
npx prisma db push

# Start backend in development mode
npm run dev

```

*Backend will run on [http://localhost:5000*](http://localhost:5000)

#### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Start frontend in development mode
npm run dev

```

*Frontend will run on [http://localhost:3000*](http://localhost:3000)

---

## 🌐 Deployment Instructions

### Backend (Render)

* **Root Directory:** `backend`
* **Environment:** Node
* **Build Command:** `npm install && npx prisma generate && npm run build`
* **Start Command:** `npx prisma db push && npm start`
* **Environment Variables:** Set `DATABASE_URL`, `JWT_SECRET`, and `PORT`.

### Frontend (Vercel)

* **Framework Preset:** Next.js
* **Root Directory:** `frontend`
* **Environment Variables:** Set `NEXT_PUBLIC_API_URL` to your live Render backend URL.

---

## 🐳 Useful Docker Commands

* **View Logs:**
```bash
docker logs kanban_backend -f
docker logs kanban_frontend -f

```


* **Rebuild Containers (Clean Build):**
```bash
docker compose down -v
docker compose build --no-cache
docker compose up -d

```
