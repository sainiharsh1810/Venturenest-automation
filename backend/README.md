# VentureNest Central Backend Bridge API

FastAPI Python microservice that acts as the central bridge API connecting:
1. `admin_dashboard/` (Desktop Web Admin Application)
2. `student_incubator_app/` (Student/Incubator Mobile Application)
3. `mentor_app/` (Mentors Connection Mobile Application)

## Features

- Role-based APIs (`/api/admin`, `/api/student-app`, `/api/mentor-app`, `/api/artifacts`)
- Document Vault submission handling
- Mentorship & Advisory Q&A resolution
- Immutable Audit Logging
- SQLite / PostgreSQL engine support out-of-the-box

## Running Locally

```bash
pip install -r requirements.txt
python -m app.main
# Server starts at http://localhost:8000
```
