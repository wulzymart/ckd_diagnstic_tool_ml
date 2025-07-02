# Kidney Disease Predictor - Flask Backend

This Flask backend provides machine learning prediction services for the Kidney Disease Predictor application.

## Setup Instructions

1. **Install Dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Add Your Model File**
   - Place your `rfc_ckd_model.pkl` file in the `backend/` directory
   - The model should be a scikit-learn RandomForestClassifier trained on the 10 features

3. **Run the Server**
   ```bash
   python app.py
   ```
   The server will start on `http://localhost:5000`

## API Endpoints

### POST /predict
Main prediction endpoint that accepts form data and returns ML predictions.

**Request Body:**
```json
{
  "serumCreatinine": 1.2,
  "gfr": 85,
  "itching": 3,
  "fastingBloodSugar": 110,
  "bunLevels": 18,
  "proteinInUrine": 0.2,
  "systolicBP": 135,
  "muscleCramps": 2,
  "serumElectrolytesSodium": 140,
  "socioeconomicStatus": 1
}
```

**Response:**
```json
{
  "prediction": {
    "has_ckd": false,
    "probability": 0.23,
    "risk_level": "Low",
    "ckd_stage": "Stage 2 (Mild)"
  },
  "analysis": {
    "key_factors": [],
    "recommendations": [
      "Continue current healthy lifestyle practices",
      "Annual kidney function screening"
    ]
  },
  "metadata": {
    "model_version": "1.0",
    "timestamp": "2025-01-11T10:30:00",
    "features_used": ["serumCreatinine", "gfr", ...]
  }
}
```

### GET /health
Health check endpoint to verify server status and model loading.

### GET /model-info
Returns information about the loaded ML model.

## Model Requirements

Your `rfc_ckd_model.pkl` should be a scikit-learn model trained on these 10 features in order:

1. serumCreatinine (mg/dL)
2. gfr (mL/min/1.73m²)
3. itching (0-10 scale)
4. fastingBloodSugar (mg/dL)
5. bunLevels (mg/dL)
6. proteinInUrine (g/day)
7. systolicBP (mmHg)
8. muscleCramps (0-7 times/week)
9. serumElectrolytesSodium (mEq/L)
10. socioeconomicStatus (0=Low, 1=Middle, 2=High)

## Features

- **CORS enabled** for frontend integration
- **Comprehensive error handling** with detailed error messages
- **Medical interpretation** of predictions with risk levels
- **Clinical recommendations** based on parameter values
- **CKD staging** based on GFR values
- **Key risk factor identification** for abnormal values
- **Logging** for monitoring and debugging
- **Health checks** for deployment monitoring

## Error Handling

The API provides detailed error messages for:
- Missing model file
- Invalid or missing form data
- Prediction errors
- Server errors

## Security Notes

- Input validation for all numeric parameters
- Error message sanitization
- CORS configuration for production deployment
- Logging without sensitive data exposure