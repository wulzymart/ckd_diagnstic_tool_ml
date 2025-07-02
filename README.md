# Chronic Kidney Disease Predictor

A full-stack web application for predicting chronic kidney disease risk using machine learning. This application consists of a Flask backend API and a React frontend interface.

## Project Overview

This application helps physicians and individuals identify early signs of kidney disease through a machine learning model trained on key medical indicators. Users can input their medical parameters and receive a risk assessment, CKD stage classification, key risk factors, and personalized medical recommendations.

## Repository Structure

```
├── backend/               # Flask API server
│   ├── app.py             # Main Flask application
│   ├── requirements.txt   # Python dependencies
│   └── rfc_ckd_model.pkl  # Trained machine learning model
├── fe/                    # React frontend application
│   ├── src/               # Source code
│   ├── package.json       # Node.js dependencies
│   └── .env               # Environment variables
└── kidney_disease.ipynb   # Jupyter notebook for model development
```

## Backend Setup

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

### Installation

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install the required dependencies:

```bash
pip install -r requirements.txt
```

3. Ensure the model file is in place:
   - The `rfc_ckd_model.pkl` file should be in the `backend/` directory
   - If you're experiencing issues with the model loading, it might be due to Python version compatibility. You can regenerate the model using the provided Jupyter notebook.

### Running the Backend

1. Start the Flask server:

```bash
python app.py
```

The server will run on `http://localhost:5000`.

**Note:** If you use `flask run` instead of `python app.py`, you may need to set the Flask environment variables:

```bash
set FLASK_APP=app.py
flask run
```

## Frontend Setup

### Prerequisites

- Node.js 16 or higher
- npm or pnpm (Node.js package managers)

### Installation

1. Navigate to the frontend directory:

```bash
cd fe
```

2. Install the required dependencies:

```bash
npm install
# or if using pnpm
pnpm install
```

3. Configure the environment:
   - The `.env` file should contain `VITE_API_BASE_URL='http://localhost:5000'`
   - Ensure this matches your backend server address

### Running the Frontend (Development)

1. Start the development server:

```bash
npm run dev
# or if using pnpm
pnpm dev
```

The development server will run on `http://localhost:5173` by default.

### Building for Production

1. Create a production build:

```bash
npm run build
# or if using pnpm
pnpm build
```

2. The build output will be in the `dist/` directory, which can be served by any static file server.

## Using the Application

1. Start both the backend and frontend servers
2. Open your browser to the frontend URL (default: `http://localhost:5173`)
3. Navigate to the Assessment page
4. Fill in the medical parameters form
5. Submit the form to receive your kidney disease risk assessment

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

### GET /health

Health check endpoint to verify server status and model loading.

### GET /model-info

Returns information about the loaded ML model.

### Backend Connection Issues

1. Verify the backend server is running
2. Check that the `VITE_API_BASE_URL` in the frontend `.env` file matches your backend URL
3. Ensure CORS is properly configured in the backend

## License

This project is licensed under the MIT License - see the LICENSE file for details.
