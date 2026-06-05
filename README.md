# Spinback Records

A vinyl hire app I built to practice full stack development. You can browse records, hire them out, and return them. Album art loads automatically using the MusicBrainz and Cover Art Archive APIs.

## Project structure

```
spinback-records/
├── backend/SpinbackApi/SpinbackApi/   .NET 10 Azure Functions API
└── frontend/                            Vite + React + TypeScript UI
```

## Backend

Built with .NET 10 Azure Functions (isolated worker), Entity Framework Core, and SQLite. No database setup needed, it creates and seeds itself on first run.

**You'll need:**
- .NET 10 SDK
- Azure Functions Core Tools v4

```bash
cd backend/SpinbackApi/SpinbackApi
func start
```

Runs on `http://localhost:7196/api`.

### API endpoints

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/getRecords` | Get all records. Supports `artist` and `available` query params |
| `GET` | `/api/getRecordById/{id}` | Get one record by ID |
| `POST` | `/api/records` | Add a record |
| `POST` | `/api/records/{id}/hire` | Hire a record |
| `POST` | `/api/records/{id}/return` | Return a record |
| `DELETE` | `/api/deleteRecord/{id}` | Delete a record (blocked if currently hired out) |

**Add a record**
```json
{ "Title": "Rumours", "Artist": "Fleetwood Mac", "Available": true }
```

**Hire a record**
```json
{ "FirstName": "Jane" }
```

### Cover art

When a record doesn't have an `MbId` yet, the API looks it up on MusicBrainz by artist and title, saves the release group ID, then the frontend uses that to pull the cover image from the Cover Art Archive. There's a 1.1s delay between lookups to stay within the MusicBrainz rate limit.

## Frontend

React + TypeScript with Vite. Uses MUI for the UI (dark theme) and Axios for API calls.

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5173`, expects the backend on port 7196.

### What you can do

- Browse the collection as a grid with album art
- Filter by artist or show only available records
- Hire a record by entering your name
- Return a record from its card
- Add new records
- Delete records (only works if they're not hired out)
- Hover over Michael Jackson

### Build

```bash
npm run build
```
