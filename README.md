# 🏥 AI Health Triage Assistant

An AI-powered Health Triage Assistant that predicts possible diseases based on user symptoms using Machine Learning. The application features a modern React frontend, a FastAPI backend, and a machine learning service to provide quick and intelligent health assessments.

> **Disclaimer:** This project is for educational and demonstration purposes only. It is **not** a substitute for professional medical advice, diagnosis, or treatment.

---

## 📌 Project Overview

The AI Health Triage Assistant helps users understand potential health conditions by analyzing symptoms entered through an interactive web interface. The system processes user input, performs machine learning inference, and returns the most likely disease predictions with confidence scores.

The project follows a modular architecture with separate services for the frontend, backend, and machine learning model.

---

## ✨ Features

- 🔍 Symptom-based disease prediction
- 🤖 Machine Learning powered diagnosis
- 📊 Confidence score for predictions
- 💻 Modern and responsive user interface
- ⚡ FastAPI REST API
- 🔄 Separate ML inference service
- 📱 Responsive design
- 🏗️ Modular project architecture

---

## 🛠️ Tech Stack

### Frontend
- React.js
- JavaScript
- HTML5
- CSS3

### Backend
- FastAPI
- Python
- Uvicorn
- REST APIs

### Machine Learning
- Scikit-learn
- Pandas
- NumPy
- Joblib

### Development Tools
- Git
- GitHub
- VS Code

---

## 📂 Project Structure

```
AI-Health-Triage-Assistant/
│
├── frontend/             # React application
│
├── backend/              # FastAPI backend
│
├── ml-service/           # Machine Learning inference service
│
├── README.md
│
└── requirements.txt
```

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/annadivighnatha/AI-Health-Triage-Assistant.git
```

```bash
cd AI-Health-Triage-Assistant
```

---

## Backend Setup

```bash
cd backend
```

Create virtual environment

```bash
python -m venv venv
```

Activate environment

### Windows

```bash
venv\Scripts\activate
```

### Install dependencies

```bash
pip install -r requirements.txt
```

Run the backend

```bash
uvicorn app.main:app --reload
```

Backend runs on

```
http://127.0.0.1:8000
```

---

## ML Service Setup

Open a new terminal.

```bash
cd ml-service
```

Activate virtual environment

```bash
venv\Scripts\activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

Run ML service

```bash
uvicorn app:app --reload
```

---

## Frontend Setup

Open another terminal.

```bash
cd frontend
```

Install dependencies

```bash
npm install
```

Run the React application

```bash
npm start
```

Frontend runs on

```
http://localhost:3000
```

---

## 🚀 Application Workflow

1. User enters symptoms.
2. Frontend sends request to FastAPI backend.
3. Backend validates the input.
4. Backend communicates with the ML service.
5. Machine learning model predicts the most probable disease.
6. Prediction and confidence score are returned.
7. Results are displayed in the user interface.

---

## 🧠 Machine Learning

The project uses a supervised Machine Learning model trained on symptom-disease data to classify possible medical conditions.

Typical workflow:

- Data preprocessing
- Feature engineering
- Model training
- Model serialization
- Prediction through REST API

---

## 📸 Screenshots

Add screenshots here after deployment.

### Home Page

```
images/home.png
```

### Prediction Result

```
images/result.png
```

---

## 📈 Future Improvements

- User authentication
- Medical history tracking
- Doctor recommendations
- Appointment booking
- Chatbot integration
- Explainable AI predictions
- Cloud deployment
- Docker support
- Email reports
- Multi-language support

---

## 🎯 Learning Outcomes

Through this project, I gained practical experience with:

- FastAPI development
- REST API design
- React integration
- Machine Learning model deployment
- Service-oriented architecture
- Python backend development
- Git and GitHub version control

---

## 👨‍💻 Author

**Annadi Vighnatha**

GitHub:
https://github.com/annadivighnatha

LinkedIn:
https://www.linkedin.com/in/vighnatha-a-0b297129b/
