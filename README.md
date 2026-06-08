# Spinback Records

A vinyl hire app I built to practice full stack development. You can browse records, hire them out, and return them. Album art loads automatically using the MusicBrainz and Cover Art Archive APIs.

## How to Run

### Frontend
The frontend was developed using Vite.

Navigate to the root folder and run:

```bash
npm i
npm run dev
```

> Tested on `Node v22.18.0` - other versions should work but are untested.

### Backend
Open the solution in Visual Studio and run the backend using .NET 10.

Create a `local.settings.json` file in the solution folder:

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "dotnet-isolated"
  },
  "Host": {
    "LocalHttpPort": 7196,
    "CORS": "*",
    "CORSCredentials": false
  }
}
```


## Project structure

```
spinback-records/
├── backend/SpinbackApi/SpinbackApi/   .NET 10 Azure Functions API
└── frontend/                            Vite + React + TypeScript UI
```


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

### What you can do

- Browse the collection as a grid with album art
- Filter by artist or show only available records
- Hire a record by entering your name
- Return a record from its card
- Add new records
- Delete records (only works if they're not hired out)
- Hover over Michael Jackson

### Total Time
- 5 Hours on the basic flow.

- 2 Hours cleaning everything and making the miroboard.

Was insanely fun to make : )
