# TaskFlow — MERN Stack Project Management App

A full-stack project management application inspired by Jira, built with the MERN stack. Supports Kanban boards, task tracking with drag-and-drop, priority management, and JWT-based authentication.

---

## Tech Stack

- **MongoDB** — Database
- **Express.js** — REST API
- **React** (with Vite) — Frontend
- **Node.js** — Runtime

### Key Libraries
- `@hello-pangea/dnd` — Drag and drop for Kanban
- `react-router-dom` — Client-side routing
- `jsonwebtoken` + `bcryptjs` — Auth
- `react-hot-toast` — Notifications
- `date-fns` — Date formatting

---

## Features

- **Authentication** — Register/login with JWT tokens
- **Projects** — Create and manage multiple projects with color-coded identifiers
- **Kanban Board** — Visual board with 4 columns: To Do, In Progress, In Review, Done
- **Drag & Drop** — Move tasks between columns by dragging
- **Task Details** — Add description, priority, due date, tags to tasks
- **Search & Filter** — Search tasks by name, filter by priority
- **Dashboard** — Overview of all projects with stats

---

## Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB (local install or MongoDB Atlas account)
- Git

---

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/taskflow.git
cd taskflow
```

---

### 2. Set up the backend

```bash
cd server
npm install
```

Create a `.env` file in the `/server` directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=your_secret_key_here
```

> For MongoDB Atlas: replace `MONGO_URI` with your Atlas connection string.

Start the backend:

```bash
npm run dev
```

The server will run on `http://localhost:5000`

---

### 3. Set up the frontend

Open a new terminal:

```bash
cd client
npm install
npm run dev
```

The app will run on `http://localhost:3000`

---

## Project Structure

```
taskflow/
├── server/                  # Express backend
│   ├── config/db.js         # MongoDB connection
│   ├── controllers/         # Route handlers
│   │   ├── authController.js
│   │   ├── projectController.js
│   │   └── taskController.js
│   ├── middleware/auth.js   # JWT middleware
│   ├── models/              # Mongoose models
│   │   ├── User.js
│   │   ├── Project.js
│   │   └── Task.js
│   ├── routes/              # Express routes
│   │   ├── auth.js
│   │   ├── projects.js
│   │   └── tasks.js
│   └── server.js            # Entry point
│
└── client/                  # React + Vite frontend
    └── src/
        ├── api/index.js         # Axios instance
        ├── context/AuthContext.jsx
        ├── pages/
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   ├── Dashboard.jsx
        │   └── ProjectBoard.jsx
        └── components/
            ├── Navbar.jsx
            ├── TaskCard.jsx
            ├── CreateProjectModal.jsx
            ├── CreateTaskModal.jsx
            └── TaskDetailModal.jsx
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | Get all user projects |
| POST | `/api/projects` | Create project |
| GET | `/api/projects/:id` | Get single project |
| PUT | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks/project/:projectId` | Get all tasks for a project |
| POST | `/api/tasks/project/:projectId` | Create a task |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

---

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/taskflow` |
| `JWT_SECRET` | Secret for JWT signing | `mysecretkey` |

---

## Screenshots

> Register → Login → Dashboard → Create Project → Kanban Board → Drag tasks between columns

---

## Author

Built as part of a MERN Stack Developer internship technical assessment.
