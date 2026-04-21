from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from model import get_all_symptoms, predict_disease
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictionRequest(BaseModel):
    symptoms: list[str]

@app.get("/")
def root():
    return {"status": "Disease Prediction API is running"}

@app.get("/symptoms")
def get_symptoms():
    try:
        symptoms = get_all_symptoms()
        return {"symptoms": symptoms}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to load symptoms: {str(e)}"
        )

@app.post("/predict")
def predict(request: PredictionRequest):
    if not request.symptoms:
        raise HTTPException(
            status_code=400,
            detail="Please provide at least one symptom."
        )
    
    if len(request.symptoms) > 17:
        raise HTTPException(
            status_code=400,
            detail="Maximum 17 symptoms allowed."
        )
    
    try:
        result = predict_disease(request.symptoms)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )