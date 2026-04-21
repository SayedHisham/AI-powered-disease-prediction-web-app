import joblib
import numpy as np

# Load saved model and encoders
model = joblib.load('model.pkl')
disease_encoder = joblib.load('disease_encoder.pkl')
symptom_columns = joblib.load('symptom_columns.pkl')

def get_all_symptoms():
    return symptom_columns

def predict_disease(symptoms: list):
    # Clean input symptoms
    symptoms = [s.strip().lower().replace(" ", "_") for s in symptoms]
    
    # Create binary input vector
    input_data = np.zeros(len(symptom_columns))
    
    unrecognized = []
    for symptom in symptoms:
        if symptom in symptom_columns:
            index = symptom_columns.index(symptom)
            input_data[index] = 1
        else:
            unrecognized.append(symptom)
    
    # Reshape for sklearn
    input_data = input_data.reshape(1, -1)
    
    # Get prediction
    prediction = model.predict(input_data)
    disease = disease_encoder.inverse_transform(prediction)[0]
    
    # Get confidence scores
    probabilities = model.predict_proba(input_data)[0]
    confidence = round(max(probabilities) * 100, 2)
    
    # Get top 3 predictions
    top_3_indices = np.argsort(probabilities)[-3:][::-1]
    top_3 = [
        {
            "disease": disease_encoder.inverse_transform([i])[0],
            "confidence": round(probabilities[i] * 100, 2)
        }
        for i in top_3_indices
    ]
    
    return {
        "disease": disease,
        "confidence": confidence,
        "top_3": top_3,
        "unrecognized_symptoms": unrecognized
    }