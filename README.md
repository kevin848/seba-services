# I&N Sounds & Services

This repository contains a fullstack application for managing **sounds** and **services**.

## Structure

- `backend/` — Express API with MongoDB via Mongoose
- `frontend/I_n/` — React + TypeScript + Vite frontend

## Getting Started

### 1. Start MongoDB and Backend with Docker

```bash
cd seba-services
docker compose up --build
```

The backend will be available at `http://localhost:5000` and MongoDB at `mongodb://localhost:27017/in-sounds`.

### 2. Run the frontend

```bash
cd frontend/I_n
npm install
npm run dev
```

Open the app at the local Vite URL shown in the terminal.

## API Endpoints

- `GET /api/sounds`
- `POST /api/sounds`
- `PUT /api/sounds/:id`
- `DELETE /api/sounds/:id`
- `GET /api/services`
- `POST /api/services`
- `PUT /api/services/:id`
- `DELETE /api/services/:id`

## Notes

- `frontend/I_n` is the React frontend folder configured to proxy `/api` requests to the backend.
- Backend environment config is in `backend/.env.example`.
