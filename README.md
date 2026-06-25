# SOCVision - Security Operations Center Monitoring Dashboard

SOCVision is a modern Security Operations Center (SOC) monitoring dashboard built with **NestJS** (backend) and **React + Vite + Tailwind CSS** (frontend). It provides real-time threat detection, alert management, incident tracking, log exploration, and threat intelligence integration.

## Features

- **Dashboard** — Real-time SOC metrics and statistics
- **Alert Management** — Monitor, filter, and manage security alerts
- **Incident Tracking** — Track and manage security incidents
- **Log Explorer** — Query and explore system logs
- **Threat Intelligence** — Integrated threat intel feeds
- **Detection Engine** — Customizable detection rules
- **User Management** — Role-based access control (Admin, Analyst, Viewer)
- **Authentication** — JWT-based auth with login/register

## Tech Stack

| Layer    | Technology                                      |
| -------- | ----------------------------------------------- |
| Backend  | NestJS, TypeScript, Prisma, PostgreSQL, JWT     |
| Frontend | React 18, TypeScript, Vite, Tailwind CSS        |
| Charts   | Recharts                                        |
| Icons    | Lucide React                                    |

## Getting Started

### Prerequisites

- Node.js >= 18
- PostgreSQL running locally

### Backend Setup

```bash
cd backend
npm install
npx prisma db push
npx prisma db seed
npm run start:dev
```

Backend runs at `http://localhost:3000`.

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

### Environment Variables

Create `backend/.env`:

```
DATABASE_URL="postgresql://user:password@localhost:5432/socvision"
JWT_SECRET="your-secret-key"
```

## Project Structure

```
├── backend/            # NestJS API
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── alerts/         # Alerts module
│   │   ├── incidents/      # Incidents module
│   │   ├── logs/           # Log explorer module
│   │   ├── dashboard/      # Dashboard stats module
│   │   ├── users/          # User management module
│   │   ├── rules/          # Detection rules engine
│   │   ├── threat-intelligence/ # Threat intel module
│   │   ├── prisma/         # Prisma service
│   │   └── common/         # Guards, decorators
│   └── prisma/
│       ├── schema.prisma   # Database schema
│       └── seed.ts         # Seed data
│
├── frontend/           # React + Vite SPA
│   └── src/
│       ├── components/     # Reusable components
│       ├── pages/          # Route pages
│       ├── contexts/       # Auth context
│       ├── hooks/          # Custom hooks
│       ├── services/       # API service layer
│       └── types/          # TypeScript types
│
└── docs/               # Documentation
```

## API Endpoints

| Method | Endpoint                | Description            |
| ------ | ----------------------- | ---------------------- |
| POST   | `/api/auth/login`       | Login                  |
| POST   | `/api/auth/register`    | Register               |
| GET    | `/api/alerts`           | List alerts            |
| PATCH  | `/api/alerts/:id`       | Update alert status    |
| GET    | `/api/incidents`        | List incidents         |
| POST   | `/api/incidents`        | Create incident        |
| GET    | `/api/logs`             | Query logs             |
| GET    | `/api/dashboard/stats`  | Dashboard statistics   |
| GET    | `/api/users`            | List users (admin)     |
| GET    | `/api/rules`            | List detection rules   |
| GET    | `/api/threat-intel`     | Threat intel data      |

---

Built with TypeScript from the ground up.
