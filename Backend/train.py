import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import LabelEncoder
import joblib

# Load dataset
df = pd.read_csv('../data/dataset.csv')

# Clean column names
df.columns = df.columns.str.strip()

# Get all unique symptoms across all symptom columns
symptom_columns = [col for col in df.columns if col != 'Disease']
all_symptoms = set()

for col in symptom_columns:
    df[col] = df[col].str.strip()
    unique = df[col].dropna().unique()
    all_symptoms.update(unique)

all_symptoms = sorted(list(all_symptoms))
print(f"Total unique symptoms: {len(all_symptoms)}")

# Create binary matrix - one column per unique symptom
def create_binary_features(row):
    symptoms_present = set()
    for col in symptom_columns:
        if pd.notna(row[col]):
            symptoms_present.add(row[col].strip())
    return pd.Series([1 if s in symptoms_present else 0 for s in all_symptoms])

print("Creating binary feature matrix...")
X = df.apply(create_binary_features, axis=1)
X.columns = all_symptoms

y = df['Disease']

# Encode disease labels
disease_encoder = LabelEncoder()
y_encoded = disease_encoder.fit_transform(y)

# Split into train and test sets
X_train, X_test, y_train, y_test = train_test_split(
    X, y_encoded, test_size=0.2, random_state=42
)

# Train Random Forest model
print("Training model...")
model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)
model.fit(X_train, y_train)

# Test accuracy
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"Model accuracy: {accuracy * 100:.2f}%")

# Save model and encoders
joblib.dump(model, 'model.pkl')
joblib.dump(disease_encoder, 'disease_encoder.pkl')
joblib.dump(all_symptoms, 'symptom_columns.pkl')

print("Model saved successfully!")
print(f"Total diseases: {len(disease_encoder.classes_)}")
print(f"Total symptoms: {len(all_symptoms)}")
print("\nSample symptoms:", all_symptoms[:5])