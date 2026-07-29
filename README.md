# 🏥 AI Health Triage Assistant

An AI-powered Health Triage Assistant that predicts possible diseases based on user symptoms using Machine Learning.

The application uses a modern frontend, FastAPI backend, PostgreSQL database, and a separate Machine Learning inference service to provide intelligent health assessments.

> ⚠️ Disclaimer: This project is developed for educational and demonstration purposes only. It is not a replacement for professional medical advice, diagnosis, or treatment.

---

# 📌 Project Overview

The AI Health Triage Assistant helps users analyze symptoms and receive possible disease predictions with confidence scores.

The system follows a modular service-based architecture:

- Frontend handles user interaction
- FastAPI backend manages APIs, authentication, and database operations
- ML service performs disease prediction using trained machine learning models

---

# ✨ Features

✅ Symptom-based disease prediction  
✅ Machine Learning powered prediction  
✅ Confidence score generation  
✅ AI explanation support  
✅ User registration and authentication  
✅ Consultation history tracking  
✅ PDF report generation  
✅ REST API architecture  
✅ Separate ML inference service  
✅ Responsive user interface  

---

# 🏗️ Architecture


```
User
 |
 |
Frontend (React / Next.js)
 |
 |
FastAPI Backend
 |
 |------------- PostgreSQL Database
 |
 |
ML Prediction Service
 |
 |
Machine Learning Model
```

---

# 🛠️ Tech Stack

## Frontend

- React.js
- Next.js
- JavaScript
- HTML5
- CSS3

## Backend

- Python
- FastAPI
- SQLAlchemy
- PostgreSQL
- Alembic
- Uvicorn
- JWT Authentication

## Machine Learning

- Scikit-learn
- Pandas
- NumPy
- Joblib

## Development Tools

- Git
- GitHub
- VS Code

---

# 📂 Project Structure


```
AI-Health-Triage-Assistant/

│
├── frontend/
│   └── React / Next.js application
│
├── backend/
│   ├── app/
│   ├── alembic/
│   ├── requirements.txt
│   └── .env.example
│
├── ml-service/
│   ├── app.py
│   ├── api.py
│   ├── training_pipeline.py
│   └── requirements.txt
│
├── start_project.bat
│
└── README.md
```

---

# ⚙️ Installation & Setup

## 1. Clone Repository


```bash
git clone https://github.com/annadivighnatha/AI-Health-Triage-Assistant.git

cd AI-Health-Triage-Assistant
```

---

# 🔹 Backend Setup


Navigate to backend:

```bash
cd backend
```

Create virtual environment:

```bash
python -m venv venv
```

Activate environment:

Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

---

## Configure Environment Variables

Create `.env` file inside backend folder.

Example:

```
APP_NAME=AI Health Triage Assistant
APP_VERSION=1.0.0

DEBUG=False

HOST=0.0.0.0
PORT=8000

DATABASE_URL=postgresql://username:password@localhost:5432/health_triage

ML_SERVICE_URL=http://127.0.0.1:8001

SECRET_KEY=your_secret_key
ALGORITHM=HS256

GEMINI_API_KEY=your_api_key
```

---

## Database Migration

Run:

```bash
alembic upgrade head
```

---

## Start Backend Server


```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```


Backend:

```
http://localhost:8000
```

API Documentation:

```
http://localhost:8000/docs
```

---

# 🔹 Machine Learning Service Setup


Open another terminal:

```bash
cd ml-service
```

Create virtual environment:

```bash
python -m venv venv
```

Activate:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```


Start ML service:


```bash
uvicorn app:app --host 0.0.0.0 --port 8001
```


ML Service:

```
http://localhost:8001
```

---

# 🔹 Frontend Setup


Open another terminal:


```bash
cd frontend
```


Install packages:


```bash
npm install
```


Run frontend:


```bash
npm run dev
```


Frontend:

```
http://localhost:3000
```

---

# 🚀 Running the Complete Application


The application requires three running services:


### Terminal 1 - ML Service

```
uvicorn app:app --host 0.0.0.0 --port 8001
```


### Terminal 2 - Backend

```
uvicorn app.main:app --host 0.0.0.0 --port 8000
```


### Terminal 3 - Frontend

```
npm run dev
```


Open:

```
http://localhost:3000
```

---

# 🔄 Application Workflow


1. User enters symptoms
2. Frontend sends request to backend API
3. Backend validates user input
4. Backend communicates with ML service
5. ML model predicts possible disease
6. Prediction confidence is generated
7. Results are displayed in UI
8. Consultation data is stored in database

---

# 🧠 Machine Learning Pipeline


Workflow:

```
Dataset
   |
Data Cleaning
   |
Feature Engineering
   |
Model Training
   |
Model Serialization
   |
FastAPI ML Service
   |
Prediction API
```

---

# 📸 Screenshots


Add screenshots:

```
screenshots/
 ├── home.png
 ├── prediction.png
 ├── login.png
 └── history.png
```

---

# 📈 Future Improvements

- Cloud deployment
- Docker containerization
- Doctor recommendation system
- Medical chatbot
- Explainable AI
- Email reports
- Mobile application
- Multi-language support

---

# 🎯 Learning Outcomes

Through this project I gained practical experience in:

- FastAPI backend development
- REST API design
- React frontend integration
- Machine Learning model deployment
- PostgreSQL database management
- JWT authentication
- Service-based architecture
- Git and GitHub workflow

---

# 👨‍💻 Author

**Annadi Vighnatha**

GitHub:

https://github.com/annadivighnatha


LinkedIn:

https://www.linkedin.com/in/vighnatha-a-0b297129b/
