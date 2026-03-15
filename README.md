
# HRMS Lite — Human Resource Management System

A clean, production-ready web application for managing employee records and tracking daily attendance. Built as a full-stack project with a Django REST API backend and a React frontend.



## Live URLs

|
| **Frontend** | `https://your-app.vercel.app` |
| **Backend API** | `https://your-app.onrender.com` |
| **GitHub Repo** | `https://github.com/CoderZzzGh` |





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


## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router v6, Vite |
| Backend | Python 3.11, Django 4.2, Django REST Framework |
| Database | SQLite (development), PostgreSQL (production) |
| Frontend Deploy | Vercel |
| Backend Deploy | Render |
| Styling | Pure CSS with CSS variables (no UI library) |


## Local Development Tips

- The Django admin panel is available at `http://localhost:8000/admin/` after running `createsuperuser`.
- To reset the database locally: `rm backend/db.sqlite3 && python manage.py migrate`
- The Vite dev server proxies all `/api/*` requests to `http://localhost:8000` automatically (see `vite.config.js`), so no CORS issues during development.
- Hot module replacement is enabled — both frontend and backend changes reflect immediately.

