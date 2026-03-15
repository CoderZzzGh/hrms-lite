# HRMS Lite — Human Resource Management System

A clean, production-ready web application for managing employee records and tracking daily attendance. Built as a full-stack project with a Django REST API backend and a React frontend.

---

## Live URLs

| | URL |
|---|---|
| **Frontend** | `https://your-app.vercel.app` |
| **Backend API** | `https://your-app.onrender.com` |
| **GitHub Repo** | `https://github.com/your-username/hrms-lite` |

> Replace the above with your actual deployed URLs before submission.

---

## Features

### Employee Management
- Add employees with ID, full name, email, and department
- View all employees in a sortable, searchable table
- Filter by department or search by name / ID / email
- Delete an employee (cascades to all attendance records)
- Per-employee attendance rate shown inline with a progress bar

### Attendance Management
- Mark attendance (Present / Absent) for any employee on any date
- Upsert logic — marking attendance again for the same employee + date updates the existing record
- Filter records by employee, date, and status
- Per-employee summary panel (total days, present, absent, attendance %)
- Delete individual attendance records

### Dashboard
- Live summary stats: total employees, present today, absent today, attendance rate
- Department headcount breakdown
- Recent employees table
- Today's attendance snapshot
- Quick "Mark today's attendance" action

### UX Details
- Loading, empty, and error states on every view
- Toast notifications for all create / update / delete actions
- Client-side + server-side validation with field-level error messages
- Duplicate employee ID and email detection
- Future date prevention on attendance forms
- Responsive layout

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router v6, Vite |
| Backend | Python 3.11, Django 4.2, Django REST Framework |
| Database | SQLite (development), PostgreSQL (production) |
| Frontend Deploy | Vercel |
| Backend Deploy | Render |
| Styling | Pure CSS with CSS variables (no UI library) |

---

## Project Structure

```
hrms-lite/
│
├── backend/                        # Django REST API
│   ├── config/
│   │   ├── __init__.py
│   │   ├── settings.py             # Settings with env var support
│   │   ├── urls.py                 # Root URL configuration
│   │   └── wsgi.py
│   ├── hrms/
│   │   ├── __init__.py
│   │   ├── apps.py
│   │   ├── models.py               # Employee + AttendanceRecord models
│   │   ├── serializers.py          # Validation + serialization
│   │   ├── views.py                # APIViews for all endpoints
│   │   └── urls.py                 # API route definitions
│   ├── manage.py
│   ├── requirements.txt
│   ├── Procfile                    # For Render/Heroku
│   └── .env.example
│
├── frontend/                       # React + Vite SPA
│   ├── src/
│   │   ├── api/
│   │   │   └── index.js            # API client (fetch wrapper)
│   │   ├── components/
│   │   │   ├── ui.jsx              # Shared UI primitives
│   │   │   ├── Sidebar.jsx         # Navigation sidebar
│   │   │   ├── Topbar.jsx          # Page header + action buttons
│   │   │   ├── AddEmployeeModal.jsx
│   │   │   ├── MarkAttendanceModal.jsx
│   │   │   └── DeleteConfirmModal.jsx
│   │   ├── hooks/
│   │   │   └── useToast.jsx        # Toast notification context
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Employees.jsx
│   │   │   └── Attendance.jsx
│   │   ├── styles/
│   │   │   └── global.css
│   │   ├── App.jsx                 # Router + layout
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── vercel.json                 # SPA rewrite rules
│   └── .env.example
│
├── render.yaml                     # Render one-click deploy config
├── .gitignore
└── README.md
```

---

## API Reference

All endpoints are prefixed with `/api/`.

### Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/dashboard/` | Summary stats: totals, today's attendance, dept breakdown |

**Response:**
```json
{
  "total_employees": 5,
  "departments": 3,
  "present_today": 4,
  "absent_today": 1,
  "not_marked_today": 0,
  "attendance_rate_today": 80,
  "department_breakdown": [
    { "department": "Engineering", "count": 2 }
  ]
}
```

---

### Employees

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/employees/` | List all employees |
| `GET` | `/api/employees/?search=priya` | Search by name, ID, or email |
| `GET` | `/api/employees/?dept=Engineering` | Filter by department |
| `POST` | `/api/employees/` | Create a new employee |
| `GET` | `/api/employees/<id>/` | Retrieve a single employee |
| `DELETE` | `/api/employees/<id>/` | Delete employee + all their attendance |

**POST body:**
```json
{
  "employee_id": "EMP-001",
  "full_name": "Priya Sharma",
  "email": "priya@company.com",
  "department": "Engineering"
}
```

**Validation rules:**
- All four fields are required
- `employee_id` must be unique
- `email` must be valid format and unique
- `full_name` must be at least 2 characters

---

### Attendance

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/attendance/` | List all records |
| `GET` | `/api/attendance/?employee_id=3` | Filter by employee PK |
| `GET` | `/api/attendance/?date=2024-01-15` | Filter by date |
| `GET` | `/api/attendance/?status=Present` | Filter by status |
| `POST` | `/api/attendance/` | Mark/upsert attendance |
| `PATCH` | `/api/attendance/<id>/` | Update a record |
| `DELETE` | `/api/attendance/<id>/` | Delete a record |

**POST body:**
```json
{
  "employee_pk": 1,
  "date": "2024-01-15",
  "status": "Present"
}
```

**Validation rules:**
- `employee_pk` must be a valid employee ID
- `date` cannot be in the future
- `status` must be `"Present"` or `"Absent"`
- Posting duplicate employee + date updates the existing record (upsert)

---

## Running Locally

### Prerequisites

- Python 3.10+
- Node.js 18+
- Git

---

### 1. Clone the repository

```bash
git clone https://github.com/your-username/hrms-lite.git
cd hrms-lite
```

---

### 2. Backend setup

```bash
cd backend

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate        # macOS / Linux
venv\Scripts\activate           # Windows

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env
# Edit .env if needed (defaults work for local development)

# Run migrations
python manage.py migrate

# (Optional) Create a superuser for /admin
python manage.py createsuperuser

# Start the development server
python manage.py runserver
```

The API will be running at `http://localhost:8000`.

You can verify it at: `http://localhost:8000/api/dashboard/`

---

### 3. Frontend setup

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# The default proxies /api to localhost:8000 via vite.config.js
# so VITE_API_BASE_URL can be left empty for local development

# Start the development server
npm run dev
```

The app will be running at `http://localhost:5173`.

---

## Deployment Guide

### Backend → Render

1. Push your code to GitHub.

2. Go to [render.com](https://render.com) → **New Web Service** → connect your repo.

3. Set the following:
   - **Root Directory:** `backend`
   - **Runtime:** Python 3
   - **Build Command:**
     ```
     pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate
     ```
   - **Start Command:**
     ```
     gunicorn config.wsgi --workers 2 --bind 0.0.0.0:$PORT
     ```

4. Add Environment Variables in the Render dashboard:

   | Key | Value |
   |-----|-------|
   | `SECRET_KEY` | Generate a random string (Render can auto-generate) |
   | `DEBUG` | `False` |
   | `ALLOWED_HOSTS` | `.onrender.com` |
   | `CORS_ALLOWED_ORIGINS` | `https://your-frontend.vercel.app` |
   | `DATABASE_URL` | *(auto-filled if you attach a Render Postgres database)* |

5. Optionally add a **Render Postgres** database and link it. The free tier works for evaluation.

6. Deploy. Copy the live URL (e.g. `https://hrms-lite-api.onrender.com`).

---

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project** → import your GitHub repo.

2. Set:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Vite

3. Add Environment Variable:

   | Key | Value |
   |-----|-------|
   | `VITE_API_BASE_URL` | `https://hrms-lite-api.onrender.com` |

4. Deploy. Vercel auto-detects Vite and handles SPA routing via `vercel.json`.

---

### One-click deploy with render.yaml (optional)

If you want Render to provision both the web service and PostgreSQL database automatically:

```bash
# From the project root, push render.yaml to GitHub
# Then in Render dashboard: New > Blueprint > connect repo
```

Render will read `render.yaml` and create both the service and database.

---

## Database Schema

### `hrms_employee`

| Column | Type | Notes |
|--------|------|-------|
| `id` | Integer PK | Auto |
| `employee_id` | VARCHAR(50) | Unique |
| `full_name` | VARCHAR(150) | |
| `email` | EmailField | Unique |
| `department` | VARCHAR(100) | |
| `created_at` | DateTimeField | Auto |
| `updated_at` | DateTimeField | Auto |

### `hrms_attendancerecord`

| Column | Type | Notes |
|--------|------|-------|
| `id` | Integer PK | Auto |
| `employee_id` | FK → Employee | CASCADE delete |
| `date` | DateField | |
| `status` | VARCHAR(10) | `Present` or `Absent` |
| `created_at` | DateTimeField | Auto |
| `updated_at` | DateTimeField | Auto |

**Constraint:** `UNIQUE(employee_id, date)` — one record per employee per day.

---

## Assumptions & Limitations

- **Single admin user** — no authentication or role-based access control. Any user with the URL has full access. This is per the assignment scope.
- **Departments are a fixed list** — hardcoded in the frontend dropdown. Extending to a dynamic model would be straightforward.
- **No pagination** — the API returns all records. For large datasets, DRF's `PageNumberPagination` can be added to serializers.
- **No leave or payroll** — explicitly out of scope per the assignment.
- **Attendance is binary** — Present/Absent only. Half-day, work-from-home, etc., are not modeled.
- **No bulk attendance marking** — each record is marked individually. A "mark all present" feature would be a natural extension.
- **SQLite in development** — automatic. PostgreSQL is used in production via `DATABASE_URL`.

---

## Bonus Features Implemented

- **Filter attendance by date** — date picker in the attendance filter bar
- **Filter attendance by employee** — dropdown filters records to a single person
- **Total present days per employee** — shown in the Employees table with a visual progress bar
- **Attendance rate** — percentage calculated and displayed per employee and in the per-employee attendance summary panel
- **Dashboard summary** — stat cards, today's snapshot, department breakdown, recent employees table
- **Upsert on attendance** — re-marking the same employee+date updates rather than duplicates

---

## HTTP Status Codes Used

| Code | Meaning |
|------|---------|
| `200 OK` | Successful GET, PATCH, or upsert |
| `201 Created` | New resource created (POST) |
| `400 Bad Request` | Validation error — response body contains `error` and `details` |
| `404 Not Found` | Resource does not exist |
| `500 Internal Server Error` | Unexpected server error |

---

## Local Development Tips

- The Django admin panel is available at `http://localhost:8000/admin/` after running `createsuperuser`.
- To reset the database locally: `rm backend/db.sqlite3 && python manage.py migrate`
- The Vite dev server proxies all `/api/*` requests to `http://localhost:8000` automatically (see `vite.config.js`), so no CORS issues during development.
- Hot module replacement is enabled — both frontend and backend changes reflect immediately.
