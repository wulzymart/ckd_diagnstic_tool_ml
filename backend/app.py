from flask import Flask, request, jsonify
from flask_cors import CORS
from joblib import load
import os
import logging
import pandas as pd

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Global variable to store the model
model = None

def load_model():
    """Load the machine learning model"""
    global model
    try:
        model_path = os.path.join(os.path.dirname(__file__), 'rfc_ckd_model.pkl')
        logger.info(f"Attempting to load model from {model_path}")
        if os.path.exists(model_path):
            with open(model_path, 'rb') as file:
                model = load(model_path)
            logger.info("Model loaded successfully")
            return True
        else:
            logger.warning(f"Model file not found at {model_path}")
            return False
    except Exception as e:
        logger.error(f"Error loading model: {str(e)}")
        return False

def get_risk_level(probability):
    """Convert probability to risk level"""
    if probability >= 0.8:
        return "Very High"
    elif probability >= 0.6:
        return "High"
    elif probability >= 0.4:
        return "Moderate"
    else:
        return "Low"

def get_ckd_stage(gfr):
    """Determine CKD stage based on GFR"""
    gfr = float(gfr)
    if gfr >= 90:
        return "Normal/Stage 1"
    elif gfr >= 60:
        return "Stage 2 (Mild)"
    elif gfr >= 45:
        return "Stage 3a (Moderate)"
    elif gfr >= 30:
        return "Stage 3b (Moderate)"
    elif gfr >= 15:
        return "Stage 4 (Severe)"
    else:
        return "Stage 5 (Kidney Failure)"

def generate_recommendations(risk_level, form_data):
    """Generate medical recommendations based on risk level and parameters"""
    recommendations = []
    
    # Risk-based recommendations
    if risk_level == "Very High":
        recommendations.extend([
            "Immediate consultation with a nephrologist is strongly recommended",
            "Consider preparation for renal replacement therapy (dialysis or transplant)",
            "Strict monitoring of fluid intake and electrolyte balance",
            "Regular cardiovascular assessment due to increased heart disease risk"
        ])
    elif risk_level == "High":
        recommendations.extend([
            "Schedule appointment with a nephrologist within 2-4 weeks",
            "Implement strict blood pressure and diabetes management",
            "Consider dietary protein restriction under medical supervision",
            "Monitor kidney function every 3-6 months"
        ])
    elif risk_level == "Moderate":
        recommendations.extend([
            "Regular follow-up with primary care physician",
            "Annual nephrology consultation recommended",
            "Focus on blood pressure and blood sugar control",
            "Maintain healthy lifestyle with regular exercise"
        ])
    else:
        recommendations.extend([
            "Continue current healthy lifestyle practices",
            "Annual kidney function screening",
            "Maintain optimal blood pressure and blood sugar levels",
            "Stay hydrated and avoid nephrotoxic medications"
        ])
    
    # Parameter-specific recommendations
    if float(form_data.get('systolicBP', 0)) > 140:
        recommendations.append("Blood pressure management is critical - consider ACE inhibitors or ARBs")
    
    if float(form_data.get('fastingBloodSugar', 0)) > 125:
        recommendations.append("Diabetes management is essential - maintain HbA1c < 7%")
    
    if float(form_data.get('proteinInUrine', 0)) > 0.3:
        recommendations.append("Proteinuria management with ACE inhibitors or ARBs recommended")
    
    if float(form_data.get('bunLevels', 0)) > 25:
        recommendations.append("Monitor for uremic symptoms and consider dietary modifications")
    
    return recommendations

def identify_key_factors(form_data, feature_names):
    """Identify key risk factors based on abnormal values"""
    factors = []
    
    # Check each parameter against normal ranges
    gfr = float(form_data.get('GFR', 0))
    if gfr < 60:
        factors.append(f"Reduced GFR ({gfr} mL/min/1.73m²) indicating decreased kidney function")
    
    creatinine = float(form_data.get('SerumCreatinine', 0))
    if creatinine > 1.3:
        factors.append(f"Elevated serum creatinine ({creatinine} mg/dL)")
    
    protein = float(form_data.get('ProteinInUrine', 0))
    if protein > 0.15:
        factors.append(f"Proteinuria detected ({protein} g/day)")
    
    bun = float(form_data.get('BUNLevels', 0))
    if bun > 20:
        factors.append(f"Elevated blood urea nitrogen ({bun} mg/dL)")
    
    
    fbs = float(form_data.get('fastingBloodSugar', 0))
    if fbs > 125:
        factors.append(f"Diabetes ({fbs} mg/dL) contributing to kidney damage")
    
    itching = float(form_data.get('Itching', 0))
    if itching > 5:
        factors.append("Significant uremic symptoms (severe itching)")
    
    return factors

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None
    })

@app.route('/load-model', methods=['GET'])
def load_route():
    model = load_model()
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None
    })

@app.route('/predict', methods=['POST'])
def predict():
    """Main prediction endpoint"""
    try:
        # Check if model is loaded
        if model is None:
            print('no model')
            return jsonify({
                'error': 'Model not loaded. Please ensure rfc_ckd_model.pkl is in the backend directory.'
            }), 500
        
        # Get JSON data from request
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Expected feature order (adjust based on your model's training)
        feature_names = ['SerumCreatinine', 'GFR', 'Itching', 'FastingBloodSugar',
       'ProteinInUrine', 'BUNLevels', 'MuscleCramps']
        # Validate required fields
        missing_fields = [field for field in feature_names if field not in data]
        if missing_fields:
            return jsonify({
                'error': f'Missing required fields: {", ".join(missing_fields)}'
            }), 400
        
        # Prepare features for prediction
        try:
            features_dict = {}
            for field in feature_names:
                features_dict[field] = [data[field]]
            
            
            # create a new dataFrame with the data to to use
            df = pd.DataFrame(features_dict)
            print(df.head())

            
        except ValueError as e:
            return jsonify({
                'error': f'Invalid numeric value in form data: {str(e)}'
            }), 400
        
        # Make prediction
        try:
            print(model)
            # Get prediction probability
            if hasattr(model, 'predict_proba'):
                print(model)
                prediction_proba = model.predict_proba(df)
                prediction = model.predict(df)
                print('prediction', prediction)
                print('prediction probability', prediction_proba)
                # Assuming binary classification where class 1 is CKD positive
                ckd_probability = prediction_proba[0][1] if len(prediction_proba[0]) > 1 else prediction_proba[0][0]
            else:
                # Fallback for models without predict_proba
                prediction = model.predict(df)
                ckd_probability = float(prediction[0])
            
            # Get binary prediction
            prediction = model.predict(df)
            has_ckd = bool(prediction[0])
            
        except Exception as e:
            print(e)
            logger.error(f"Prediction error: {str(e)}")
            return jsonify({
                'error': f'Error making prediction: {str(e)}'
            }), 500
        
        # Generate comprehensive response
        risk_level = get_risk_level(ckd_probability)
        ckd_stage = get_ckd_stage(data['GFR'])
        key_factors = identify_key_factors(data, feature_names)
        recommendations = generate_recommendations(risk_level, data)
        
        response = {
            'prediction': {
                'has_ckd': has_ckd,
                'probability': float(ckd_probability),
                'risk_level': risk_level,
                'ckd_stage': ckd_stage
            },
            'analysis': {
                'key_factors': key_factors,
                'recommendations': recommendations
            },
            'metadata': {
                'model_version': '1.0',
                'timestamp': str(np.datetime64('now')),
                'features_used': feature_names
            }
        }
        
        logger.info(f"Prediction made: Risk Level = {risk_level}, Probability = {ckd_probability:.3f}")
        return jsonify(response)
        
    except Exception as e:
        logger.error(f"Unexpected error in predict endpoint: {str(e)}")
        return jsonify({
            'error': f'Internal server error: {str(e)}'
        }), 500

@app.route('/model-info', methods=['GET'])
def model_info():
    """Get information about the loaded model"""
    if model is None:
        return jsonify({
            'error': 'Model not loaded'
        }), 404
    
    try:
        info = {
            'model_type': type(model).__name__,
            'model_loaded': True,
            'expected_features': [
                'serumCreatinine', 'gfr', 'itching', 'fastingBloodSugar',
                'bunLevels', 'proteinInUrine', 'systolicBP', 'muscleCramps',
                'serumElectrolytesSodium', 'socioeconomicStatus'
            ]
        }
        
        # Try to get additional model info if available
        if hasattr(model, 'n_features_in_'):
            info['n_features'] = model.n_features_in_
        if hasattr(model, 'classes_'):
            info['classes'] = model.classes_.tolist()
            
        return jsonify(info)
        
    except Exception as e:
        return jsonify({
            'error': f'Error getting model info: {str(e)}'
        }), 500
model_loaded = load_model()
if not model_loaded:
    logger.warning("Starting server without model. Please add rfc_ckd_model.pkl to the backend directory.")

if __name__ == '__main__':
    # Run the Flask app
    app.run(host='0.0.0.0', port=5000)