const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface PredictionRequest {
  SerumCreatinine: string;
  GFR: string;
  Itching: string;
  FastingBloodSugar: string;
  BUNLevels: string;
  ProteinInUrine: string;
  MuscleCramps: string;
}

export interface PredictionResponse {
  prediction: {
    has_ckd: boolean;
    probability: number;
    risk_level: "Low" | "Moderate" | "High" | "Very High";
    ckd_stage: string;
  };
  analysis: {
    key_factors: string[];
    recommendations: string[];
  };
  metadata: {
    model_version: string;
    timestamp: string;
    features_used: string[];
  };
}

export interface ApiError {
  error: string;
}

class ApiService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error occurred");
    }
  }

  async healthCheck(): Promise<{ status: string; model_loaded: boolean }> {
    return this.makeRequest("/health");
  }

  async getModelInfo(): Promise<{
    model_type: string;
    model_loaded: boolean;
    expected_features: string[];
    n_features?: number;
    classes?: number[];
  }> {
    return this.makeRequest("/model-info");
  }

  async predict(data: PredictionRequest): Promise<PredictionResponse> {
    // Convert string values to numbers for the API
    const numericData = {
      SerumCreatinine: parseFloat(data.SerumCreatinine),
      GFR: parseFloat(data.GFR),
      Itching: parseFloat(data.Itching),
      FastingBloodSugar: parseFloat(data.FastingBloodSugar),
      BUNLevels: parseFloat(data.BUNLevels),
      ProteinInUrine: parseFloat(data.ProteinInUrine),
      MuscleCramps: parseFloat(data.MuscleCramps),
    };

    return this.makeRequest("/predict", {
      method: "POST",
      body: JSON.stringify(numericData),
    });
  }
}

export const apiService = new ApiService();
