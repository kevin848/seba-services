# Backend — I&N Sounds & Services

Requirements: Node 18+, MongoDB

Install:

```bash
cd backend
npm install
```

Run (dev):

```bash
cp .env.example .env
# edit .env if needed
npm run dev
```

API endpoints:
- `GET /api/sounds` — list sounds
- `POST /api/sounds` — create
- `GET /api/sounds/:id` — get
- `PUT /api/sounds/:id` — update
- `DELETE /api/sounds/:id` — delete

Same for `/api/services`.
