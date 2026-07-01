# 🧠 Quiz Builder

A full-stack quiz application where users can create, manage quizzes.  
Built with modern TypeScript stack and clean architecture.


- [Demo Link](https://quiz-builder-liart.vercel.app)
---

## 🚀 Features

- Create quizzes with multiple question types
- Boolean / Input / Checkbox questions
- Delete quizzes
- View quiz details
- Persistent storage with SQLite
- REST API backend


- Backend is hosted on [Render](https://render.com)
- Frontend is hosted on [Vercel](https://vercel.com)

---

## 🛠 Tech Stack

### Frontend
- React
- TypeScript
- React Router
- TailwindCSS

### Backend
- Node.js
- Express
- TypeScript
- Prisma ORM

### Database
- SQLite

---

## 📁 Project Structure
```
client/ → React frontend
server/ → Express backend
prisma/ → DB schema & migrations
```

---

## ⚙️ Setup Instructions

### 1. Clone repository

```bash
git clone https://github.com/RomanMartseniuk/Quiz-Builder.git
cd Quiz-Builder
```

### 2. Backend setup

```bash
cd server
npm install
```

Create .env file:

```env
DATABASE_URL="file:./dev.db"
```
Run migrations:
```
npx prisma migrate dev
```
Start server:
```
npm run dev
```

### 3. Frontend setup
```bash
cd client
npm install
npm run dev
```

## 🔌 API Endpoints

### Quizzes
- GET `/api/quizzes` → get all quizzes
- GET `/api/quizzes/:id` → get quiz by id
- POST `/api/quizzes` → create quiz
- DELETE `/api/quizzes/:id` → delete quiz

