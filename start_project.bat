@echo off

echo Starting ML Service...
start cmd /k "cd /d D:\Realtime-Projects\AI-Health-Triage-Assistant\ml-service && venv\Scripts\activate && uvicorn app:app --host 0.0.0.0 --port 8001"

timeout /t 3

echo Starting Backend...
start cmd /k "cd /d D:\Realtime-Projects\AI-Health-Triage-Assistant\backend && uvicorn app.main:app --host 0.0.0.0 --port 8000"

timeout /t 3

echo Starting Frontend...
start cmd /k "cd /d D:\Realtime-Projects\AI-Health-Triage-Assistant\frontend && npm run dev"

pause