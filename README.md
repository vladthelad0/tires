# Rapid Tire Service — Full-Stack Web Application

Mobile tire repair and replacement service for San Francisco. Django REST API backend + React/Vite frontend.

---

## Project Structure

```
Tire/
├── backend/
│   ├── venv/                  # Python virtual environment
│   └── rapidtires/            # Django project root (contains manage.py)
│       ├── manage.py
│       ├── requirements.txt
│       ├── Procfile
│       ├── railway.toml
│       ├── .env.example
│       ├── api/               # Django app (models, views, admin)
│       └── rapidtires/        # Django settings module
└── frontend/
    ├── src/
    │   ├── api/               # Axios API client
    │   ├── components/        # React components
    │   └── pages/             # HomePage, TrackPage
    ├── .env.example
    ├── vercel.json
    └── package.json
```

---

## Local Development Setup

### Backend (Django)

**Prerequisites:** Python 3.10+

```bash
cd backend/rapidtires

# Activate virtual environment
# Windows:
../venv/Scripts/activate
# macOS/Linux:
source ../venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy and configure environment
cp .env.example .env
# Edit .env with your values

# Run migrations
python manage.py makemigrations api
python manage.py migrate

# Create admin user
python manage.py createsuperuser

# Start dev server
python manage.py runserver
```

Backend runs at: http://localhost:8000
Admin panel: http://localhost:8000/admin/

### Frontend (React + Vite)

**Prerequisites:** Node.js 18+

```bash
cd frontend

# Install dependencies
npm install

# Copy and configure environment
cp .env.example .env
# Edit .env with your values

# Start dev server
npm run dev
```

Frontend runs at: http://localhost:5173

---

## Environment Variables

### Backend (`backend/rapidtires/.env`)

| Variable | Description | Example |
|---|---|---|
| `SECRET_KEY` | Django secret key | `django-insecure-...` |
| `DEBUG` | Enable debug mode | `True` |
| `ALLOWED_HOSTS` | Comma-separated allowed hosts | `localhost,127.0.0.1` |
| `CORS_ALLOWED_ORIGINS` | Comma-separated CORS origins | `http://localhost:5173` |
| `CORS_ALLOW_ALL_ORIGINS` | Allow all origins (dev only) | `False` |
| `EMAIL_HOST` | SMTP server host | `smtp.gmail.com` |
| `EMAIL_PORT` | SMTP port | `587` |
| `EMAIL_HOST_USER` | SMTP username/email | `you@gmail.com` |
| `EMAIL_HOST_PASSWORD` | SMTP password or app password | `your-app-password` |
| `DEFAULT_FROM_EMAIL` | From address for outbound email | `noreply@rapidtireservice.com` |
| `NOTIFY_EMAIL` | Where new request emails are sent | `dispatch@rapidtireservice.com` |

### Frontend (`frontend/.env`)

| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Django API base URL | `http://localhost:8000` |
| `VITE_GOOGLE_MAPS_API_KEY` | Google Maps JavaScript API key | `AIzaSy...` |
| `VITE_PHONE_NUMBER` | Business phone number displayed | `(415) 555-0100` |

**Google Maps API:** Enable these APIs in your Google Cloud Console:
- Maps JavaScript API
- Geocoding API

---

## Deployment

### Backend → Railway

1. Push `backend/rapidtires/` as your Railway service root (or connect the full repo and set root to `backend/rapidtires`)
2. Add environment variables in Railway dashboard (all vars from `.env.example`, with production values)
3. Set `DEBUG=False` and `ALLOWED_HOSTS=your-railway-domain.up.railway.app`
4. Set `CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app`
5. Railway auto-detects the `Procfile` and runs: `gunicorn rapidtires.wsgi --log-file -`
6. After first deploy, run migrations via Railway shell:
   ```bash
   python manage.py migrate
   python manage.py createsuperuser
   ```

### Frontend → Vercel

1. Connect your repo to Vercel
2. Set **Root Directory** to `frontend`
3. Add environment variables in Vercel dashboard:
   - `VITE_API_URL` → your Railway backend URL (e.g. `https://rapidtire.up.railway.app`)
   - `VITE_GOOGLE_MAPS_API_KEY` → your Google Maps API key
   - `VITE_PHONE_NUMBER` → your business phone number
4. Vercel auto-detects Vite. Build command: `npm run build`, Output: `dist`
5. The `vercel.json` handles SPA routing (all paths → `index.html`)

---

## How to Update a Ticket Status (Django Admin)

1. Go to `https://your-backend-domain/admin/`
2. Log in with your superuser credentials
3. Click **Service Requests**
4. Click the ticket you want to update (search by ticket code or name)
5. Change the **Status** field (Received → Assigned → En Route → In Progress → Completed)
6. Optionally add a **Status note** — this is visible to the customer on their tracking page
7. Click **Save**

The customer's tracker page auto-refreshes every 30 seconds and will show the updated status.

### Bulk Admin Actions

From the Service Requests list view, select tickets and use the **Action** dropdown:
- **Clear completed & cancelled tickets** — deletes all finished requests (cleanup)
- **⚠️ Clear ALL tickets** — end-of-day full wipe

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/service-request/` | Submit a new service request |
| `GET` | `/api/service-request/:ticket_code/` | Get status by ticket code |
| `POST` | `/api/track/call/` | Log a call tracking event |
