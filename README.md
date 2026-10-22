# CampusHub — Student Planner (WAD Full-Stack Edition)

CampusHub is a responsive student task planner upgraded from the original vanilla HTML/CSS/JavaScript and native Node HTTP server into a React + Express + MongoDB application. The UI uses a flat green, red, white, and black palette with square corners, no promotional hero, and no gradient styling.

## Course outcome mapping

- **CO1 — HTML/CSS/JavaScript:** semantic React-rendered HTML, responsive CSS, accessible labels, controlled forms, keyboard focus styles, and mobile navigation.
- **CO2 — React:** `Sidebar`, `TaskForm`, `TaskList`/`TaskRow`, `Calendar`, dashboard, courses, analytics, and settings components. `useState`, `useEffect`, `useMemo`, and `useCallback` manage state, data loading, filtering, and persistence synchronization.
- **CO3 — Node.js/Express:** middleware and REST endpoints for task CRUD, validation, error responses, health endpoint, and a Postman collection.
- **CO4 — MongoDB:** Mongoose Task model, MongoDB-backed API, indexes, environment-based connection, and idempotent legacy JSON migration.
- **CO5 — Render:** production build/start scripts and `render.yaml` blueprint configuration. Deployment is not claimed as complete until a live service is deployed and verified.

## Features

Dashboard and summary metrics; create, edit, delete, complete, and reopen tasks; search; subject/priority filters; sorting; overdue view; calendar month navigation and date agenda; courses grouped by subject; analytics; light/dark mode; export tasks to JSON; delete completed tasks. Tasks are read and changed through the Express API and MongoDB. Calendar and course pages are preserved as first-class views.

## Requirements

- Node.js 20 or newer and npm
- MongoDB local instance or MongoDB Atlas database

## Setup

1. Extract the project and open a terminal in the `CampusHub-Mini-Project` folder.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env` and set `MONGODB_URI` to your local MongoDB URI or Atlas connection string. Never commit `.env`.

   **MongoDB Atlas connection tip:** if your database password contains reserved URL characters such as `@`, `:`, `/`, `?`, `#`, or `%`, URL-encode the username/password portion of the URI. For example, `@` becomes `%40`. Do not encode the entire connection string. Keep the real URI private in `.env` or your hosting provider's secret settings; do not paste it into screenshots or commit it to Git.
4. Start development mode (Express on port 3000 and Vite on port 5173):

   ```bash
   npm run dev
   ```

5. Open `http://localhost:5173`. Check `http://localhost:3000/api/health` for API/database status.

### Verify the connection

- Open `http://localhost:3000/api/health`. A successful response has `"ok": true`; `database` should be `"connected"` when MongoDB is reachable.
- If it says `"disconnected"`, check that `.env` is in the project root beside `package.json`, `MONGODB_URI` is spelled correctly, the Atlas password is URL-encoded, the Atlas database user has access, and Atlas Network Access allows the connection.
- Task endpoints return HTTP `503` while MongoDB is disconnected; this is intentional and prevents pretending that data was saved.
- After connecting, test create/update/delete and refresh the browser to confirm the data persists.

To run the production server locally after building:

```bash
npm run build
NODE_ENV=production npm start
```

On Windows PowerShell, set production mode for the current session with `$env:NODE_ENV="production"` before `npm start`.

## Environment variables

| Variable | Purpose |
|---|---|
| `MONGODB_URI` | MongoDB connection string; required for task API |
| `PORT` | Server port (Render supplies this automatically) |
| `NODE_ENV` | Set to `production` on Render to serve the built React app |
| `CLIENT_ORIGIN` | Comma-separated frontend origins allowed by CORS; local default is `http://localhost:5173` |
| `VITE_API_BASE_URL` | Optional API base for a separately hosted frontend; defaults to `/api` for same-origin deployment |

## Existing JSON data migration

The old `data/tasks.json` is retained as a legacy source; it is **not** the active database. After configuring MongoDB, run:

```bash
npm run migrate:json
```

The migration script imports tasks from `data/tasks.json` (or pass a different JSON path as an argument) and records each original ID in a unique sparse `legacyId` field so repeated runs skip previously imported records. It does not delete or modify the source file. Take a separate backup before migrating important data.

## REST API

Base URL is `/api`. All responses are JSON.

| Method | Endpoint | Purpose | Typical responses |
|---|---|---|---|
| GET | `/health` | API and DB status | `200` |
| GET | `/tasks` | List tasks; optional `?status=active` or `?status=completed` | `200`, `503` if DB unavailable |
| GET | `/tasks/:id` | Read one task | `200`, `400` invalid ID, `404` missing |
| POST | `/tasks` | Create task | `201`, `400` validation |
| PATCH | `/tasks/:id` | Update supplied task fields | `200`, `400` validation/ID, `404` missing |
| DELETE | `/tasks/:id` | Delete task | `200`, `400` invalid ID, `404` missing |

Task fields: `title` (required, max 120), `course` (max 80), `description` (max 500), `dueDate` (`YYYY-MM-DD` or empty), `priority` (`Low`, `Medium`, `High`), and `completed` (boolean). Example create body:

```json
{
  "title": "Finish assignment",
  "course": "Web Development",
  "description": "Review the form validation",
  "dueDate": "2026-11-01",
  "priority": "High",
  "completed": false
}
```

## Postman verification

Import `postman/CampusHub.postman_collection.json` into Postman. Set `baseUrl` to `http://localhost:3000` or your deployed service. Run Health and List first, then Create (which stores the returned ID), Get, Update, Validation error, invalid ID, missing task, and Delete. The collection includes expected status assertions for create and validation. These are request examples; do not interpret the included collection as evidence that requests have already been executed.

## Render deployment

1. Push the project to a Git repository, excluding `.env` and `node_modules`.
2. Create a MongoDB Atlas cluster and database user. Copy the connection URI and replace the password placeholder; URL-encode special characters in credentials.
3. In Atlas Network Access, allow Render outbound connections. For a classroom/demo deployment, `0.0.0.0/0` is convenient but less restrictive; prefer Render static outbound IP allowlisting where supported by your plan. Use a strong database user limited to the app database.
4. In Render, create a Blueprint from this repository and review `render.yaml`, or create a Node web service with build command `npm install && npm run build` and start command `npm start`.
5. Set `MONGODB_URI` as a secret environment variable. Set `CLIENT_ORIGIN` to the deployed origin (for this single-service setup, the same origin is used). Keep the Render-provided `PORT`.
6. After deploy, verify `/api/health`, then create/update/delete a test task in the live UI and confirm the record persists after refresh. Only call deployment successful after these checks pass.

## Architecture

```text
Browser (React + Vite build)
       | /api/tasks (JSON over HTTP)
Express routes + validation + error middleware
       |
Mongoose Task model and indexes
       |
MongoDB Atlas or local MongoDB
```

## Project structure

```text
client/src/App.jsx                 Main view composition and hooks
client/src/components/             Sidebar, task form/list, calendar
client/src/services/api.js         Frontend API client
client/src/styles.css              Responsive flat visual system
server/index.js                    Express app, CORS, middleware, production hosting
server/routes/tasks.js             REST CRUD and validation
server/models/Task.js              Mongoose schema and indexes
scripts/migrate-json-to-mongodb.js Legacy JSON migration
postman/CampusHub.postman_collection.json
render.yaml                        Render Blueprint
```

## Verification status

Run `npm test` for the included repository/API-contract checks and `npm run build` for the frontend production build after dependencies are installed. Database integration requires a reachable MongoDB instance and valid credentials. A Render deployment and live Postman run are not asserted by this repository documentation.


## Syllabus coverage update (Full Stack Development F0002)

| Syllabus requirement | CampusHub / practical evidence | Status / note |
|---|---|---|
| HTML semantics, forms, CSS, responsive design | React UI, semantic JSX, responsive stylesheet, task form validation | Implemented in main app; inspect UI in browser |
| JavaScript DOM and security | React event handling, validation, API error display | Implemented; avoid rendering user content as raw HTML |
| React frontend | Components, hooks, calendar, courses, analytics, settings | Implemented |
| Node.js core, modules, HTTP, URL | `syllabus-practicals/node/core-http.js` | Standalone practical; port 3101 |
| File System and Events | `syllabus-practicals/node/files-events.js` | Standalone practical |
| File upload | `syllabus-practicals/node/upload-server.js` | Standalone practical; allowlisted MIME types, 2 MB limit; port 3102 |
| Automated email | `syllabus-practicals/node/send-email.js` | Standalone; needs SMTP environment variables |
| MongoDB create/read/update/delete | `server/routes/tasks.js` + Mongoose `Task` model | Main app CRUD requires valid MongoDB URI |
| One-to-one and many-to-many modelling | `syllabus-practicals/mongodb/relationships.js` | Standalone mongosh demo |
| Aggregation / advanced queries | `syllabus-practicals/mongodb/crud-aggregation.js` | Standalone mongosh demo |
| Atlas integration | `.env.example`, Mongoose connection in `server/index.js` | Requires a real Atlas cluster hostname and database user |
| Login / registration | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` | API added; password hashing (bcrypt) and 2-hour JWT; set `JWT_SECRET` |
| Git / Jenkins | `syllabus-practicals/devops/GIT-JENKINS-TOMCAT.md` | Git and Jenkins pipeline guide; Jenkins agent configuration is environment-specific |
| Apache Tomcat | `syllabus-practicals/devops/GIT-JENKINS-TOMCAT.md` | Separate Java WAR practical; CampusHub is Node.js and is not a Tomcat WAR |
| Render deployment | `render.yaml` and deployment guide below | Not complete until deployed with real secrets and live-tested |

### Run the syllabus demos

After `npm install`, run one practical at a time:

```bash
npm run practical:http
npm run practical:files
npm run practical:upload
```

The upload demo uses Multer. It accepts PNG, JPEG, PDF, and plain-text MIME types, with a 2 MB cap; remember MIME headers can be spoofed in production, so robust deployments should inspect file signatures and store uploads outside the public web root. The email demo uses SMTP configuration and will not send mail until valid SMTP variables are provided. The MongoDB practical scripts are run with `mongosh` against a disposable database.

### Authentication API examples

Register with JSON `{"name":"Demo Student","email":"student@example.com","password":"a-long-demo-password"}` at `POST /api/auth/register`; login with email/password at `POST /api/auth/login`; use the returned token as `Authorization: Bearer <token>` for `GET /api/auth/me`. The current task API remains usable without a token for local coursework compatibility; before a real multi-user release, enforce authentication middleware and scope every task query to the authenticated user. Do not treat this demonstration auth as a complete production identity system.

### Critical MongoDB connection note

Do not use placeholder hosts such as `YOUR_REAL_CLUSTER` or `cluster0.abc123.mongodb.net`. Copy the actual hostname from Atlas → your cluster → Connect → Drivers. If a password contains `@`, encode it as `%40` in the URI password section only. The `MONGODB_URI` line must be in `.env` beside `package.json`. Keep `.env` private. If `querySrv ENOTFOUND` mentions `_mongodb._tcp.2013`, the URI is being parsed incorrectly or its host is wrong; inspect the hostname and URL-encode reserved characters in the credentials.
