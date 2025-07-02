import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, ArrowRight, AlertCircle } from "lucide-react";
import { apiService, PredictionRequest } from "../services/api";

interface FormData {
  SerumCreatinine: string;
  GFR: string;
  Itching: string;
  FastingBloodSugar: string;
  BUNLevels: string;
  ProteinInUrine: string;
  MuscleCramps: string;
}

export const AssessmentPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    SerumCreatinine: "",
    GFR: "",
    Itching: "",
    FastingBloodSugar: "",
    BUNLevels: "",
    ProteinInUrine: "",
    MuscleCramps: "",
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string>("");

  const formFields = [
    {
      key: "SerumCreatinine" as keyof FormData,
      label: "Serum Creatinine",
      placeholder: "Enter value in mg/dL",
      type: "number",
      step: "0.1",
      min: "0.5",
      max: "15",
      unit: "mg/dL",
      description:
        "Normal range: 0.7-1.3 mg/dL for men, 0.6-1.1 mg/dL for women",
    },
    {
      key: "GFR" as keyof FormData,
      label: "Glomerular Filtration Rate (GFR)",
      placeholder: "Enter GFR value",
      type: "number",
      min: "15",
      max: "120",
      unit: "mL/min/1.73m²",
      description: "Normal range: >90 mL/min/1.73m²",
    },
    {
      key: "Itching" as keyof FormData,
      label: "Itching Severity",
      placeholder: "Rate from 0-10",
      type: "number",
      min: "0",
      max: "10",
      unit: "scale",
      description: "0 = No itching, 10 = Severe constant itching",
    },
    {
      key: "FastingBloodSugar" as keyof FormData,
      label: "Fasting Blood Sugar",
      placeholder: "Enter fasting glucose level",
      type: "number",
      min: "70",
      max: "400",
      unit: "mg/dL",
      description: "Normal range: 70-100 mg/dL",
    },
    {
      key: "BUNLevels" as keyof FormData,
      label: "Blood Urea Nitrogen (BUN)",
      placeholder: "Enter BUN level",
      type: "number",
      min: "5",
      max: "100",
      unit: "mg/dL",
      description: " Urea (mg/dL) / 2.14. Normal range: 7-20 mg/dL",
    },
    {
      key: "ProteinInUrine" as keyof FormData,
      label: "Protein in Urine",
      placeholder: "Enter protein level",
      type: "number",
      step: "0.01",
      min: "0",
      max: "5",
      unit: "g/day",
      description: "Normal range: <0.15 g/day",
    },
    {
      key: "MuscleCramps" as keyof FormData,
      label: "Muscle Cramps Frequency",
      placeholder: "Times per week (0-7)",
      type: "number",
      min: "0",
      max: "7",
      unit: "times/week",
      description: "How many times per week do you experience muscle cramps?",
    },
  ];

  const handleInputChange = (key: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: "" }));
    }
    if (apiError) {
      setApiError("");
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    Object.keys(formData).forEach((key) => {
      if (!formData[key as keyof FormData]) {
        newErrors[key as keyof FormData] = "This field is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setApiError("");

    try {
      // Call the Flask API
      const prediction = await apiService.predict(
        formData as PredictionRequest
      );

      // Store both form data and prediction results
      localStorage.setItem("assessmentData", JSON.stringify(formData));
      localStorage.setItem("predictionResults", JSON.stringify(prediction));

      // Navigate to results page
      navigate("/results");
    } catch (error) {
      console.error("Prediction error:", error);
      setApiError(
        error instanceof Error
          ? error.message
          : "Failed to get prediction. Please check if the Flask server is running."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl">
            <FileText className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-4">
          Medical Assessment
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Please provide accurate medical information for the most reliable
          assessment. All fields are required for proper analysis.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        {apiError && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center text-red-800">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span className="font-medium">Connection Error:</span>
            </div>
            <p className="text-red-700 mt-1">{apiError}</p>
            <p className="text-red-600 text-sm mt-2">
              Make sure the Flask server is running
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formFields.map((field) => (
              <div key={field.key} className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  {field.label}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <input
                    type={field.type}
                    value={formData[field.key]}
                    onChange={(e) =>
                      handleInputChange(field.key, e.target.value)
                    }
                    placeholder={field.placeholder}
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors[field.key]
                        ? "border-red-300 bg-red-50"
                        : "border-slate-300 bg-white hover:border-slate-400"
                    }`}
                  />
                  <span className="absolute right-3 top-3 text-sm text-slate-500">
                    {field.unit}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{field.description}</p>
                {errors[field.key] && (
                  <div className="flex items-center text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors[field.key]}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-2">
                  Important Medical Disclaimer:
                </p>
                <ul className="space-y-1 text-blue-700">
                  <li>
                    • This assessment uses machine learning for educational and
                    screening purposes only
                  </li>
                  <li>
                    • Results should not replace professional medical
                    consultation
                  </li>
                  <li>
                    • Always consult with qualified healthcare providers for
                    diagnosis and treatment
                  </li>
                  <li>• Ensure all medical values are current and accurate</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-center pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-teal-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Analyzing with ML Model...
                </>
              ) : (
                <>
                  Generate ML Assessment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
