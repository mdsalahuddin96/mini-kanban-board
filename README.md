
```markdown
# Mini Kanban Board Application

A full-stack Mini Kanban Board application built with **Next.js**, **Express TypeScript**, **Prisma ORM**, and **PostgreSQL**, fully containerized using **Docker**.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js (React), Tailwind CSS
- **Backend:** Node.js, Express, TypeScript
- **Database & ORM:** PostgreSQL, Prisma ORM
- **Containerization:** Docker, Docker Compose

---

## ⚙️ Environment Variables Setup

Root level and sub-folder environment variables setup for Local & Docker development.

### 1. Backend Environment Variables (`backend/.env`)

Create a `.env` file inside the `backend/` directory:

```env
PORT=5000
JWT_SECRET="super_secret_jwt_key_kanban_2026"

# For Docker Environment:
DATABASE_URL="postgresql://kanban_user:kanban_password@postgres:5432/kanban_db?schema=public"

# For Local Development (Without Docker):
# DATABASE_URL="postgresql://postgres:your_local_password@localhost:5432/kanban_db?schema=public"

```

---

## 🚀 Getting Started (Step-by-Step Setup)

### Option A: Run with Docker Compose (Recommended)

Make sure you have [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

1. **Clone the repository:**
```bash
git clone [https://github.com/your-username/mini-kanban-board.git](https://github.com/your-username/mini-kanban-board.git)
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
* PostgreSQL installed and running locally

#### 1. Database Setup

Create a local PostgreSQL database named `kanban_db`.

#### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Update .env file to point to localhost PostgreSQL
# DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/kanban_db?schema=public"

# Generate Prisma Client & Push Schema to DB
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


* **Stop All Containers:**
```bash
docker compose down

```



```

<FollowUp label="প্রোজেক্টে কোনো নতুন ফিচার বা API Documentation যুক্ত করতে চান?" query="এই README ফাইলে API Endpoints ও Features সেকশন যুক্ত করে দাও।"/>

```