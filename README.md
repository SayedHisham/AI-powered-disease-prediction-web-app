# AI-Powered Disease Prediction Web App

A full-stack machine learning web app that predicts diseases based on selected symptoms. Built with Scikit-learn, FastAPI, and React.

## How It Works

1. Select your symptoms from a list of 131 unique symptoms
2. Click Predict Disease
3. The Random Forest model analyzes your symptoms and returns the most likely disease with a confidence score and top 3 alternatives

## Tech Stack

**Backend**
- Python
- FastAPI — REST API framework
- Scikit-learn — Random Forest classifier
- Pandas — data preprocessing
- NumPy — numerical computing
- Joblib — model serialization

**Frontend**
- React
- Vite

## Project Structure
├── Backend/
│   ├── main.py           # FastAPI app and endpoints
│   ├── model.py          # Model loading and prediction logic
│   ├── train.py          # One-time training script
│   └── requirements.txt  # Python dependencies
├── frontend/
│   └── src/
│       └── App.jsx       # React UI
└── data/                 # Dataset (not committed, download from Kaggle)

## Getting Started

### Dataset
Download the disease-symptom dataset from Kaggle:
https://www.kaggle.com/datasets/itachi9604/disease-symptom-description-dataset

Place `dataset.csv` inside the `data/` folder.

### Backend

```bash
cd Backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python train.py
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

- `GET /` — health check
- `GET /symptoms` — returns all 131 available symptoms
- `POST /predict` — takes a list of symptoms, returns predicted disease with confidence scores

## Model Performance

- Algorithm: Random Forest (100 decision trees)
- Training accuracy: 100%
- Total diseases: 41
- Total symptoms: 131

## Disclaimer

This app is for educational purposes only. Always consult a qualified medical professional for diagnosis and treatment.
