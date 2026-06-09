import { User } from '../types/auth.types';

// API Configuration and Service
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
const PREDICT_BASE_URL = import.meta.env.VITE_PREDICT_URL || 'http://localhost:5001';

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface OTPVerificationResponse {
  message: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface PredictResponse {
  disease: string;
  confidence: number;
  mock_mode?: boolean;
}

export interface PredictErrorResponse {
  error: string;
  setup_required?: boolean;
  message?: string;
}

// API Service Class
class ApiService {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  // Get auth token from localStorage
  private getAuthToken(): string | null {
    const token = localStorage.getItem('accessToken');
    if (token === 'undefined' || token === 'null' || !token) {
      return null;
    }
    return token;
  }

  // Get refresh token from localStorage
  private getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  // Set auth tokens
  private setAuthTokens(accessToken: string, refreshToken?: string): void {
    if (accessToken && accessToken !== 'undefined' && accessToken !== 'null') {
      localStorage.setItem('accessToken', accessToken);
    } else {
      localStorage.removeItem('accessToken');
    }
    
    if (refreshToken && refreshToken !== 'undefined' && refreshToken !== 'null') {
      localStorage.setItem('refreshToken', refreshToken);
    } else {
      localStorage.removeItem('refreshToken');
    }
  }

  // Clear auth tokens
  private clearAuthTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  // Make HTTP request
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();

    const config: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        // Include validation errors in the error message if available
        const errorMessage = data.message || 'Request failed';
        const errorDetails = data.errors ? `: ${JSON.stringify(data.errors)}` : '';
        throw new Error(errorMessage + errorDetails);
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // Auth API Methods
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.data) {
      this.setAuthTokens(response.data.accessToken, response.data.refreshToken);
    }

    return response.data!;
  }

  async register(userData: {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    mobile: string;
    role: string;
    acceptedTerms: boolean;
  }): Promise<RegisterResponse> {
    const response = await this.request<RegisterResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.success && response.data && response.data.accessToken) {
      this.setAuthTokens(response.data.accessToken, response.data.refreshToken);
    }

    return response.data!;
  }

  async forgotPassword(email: string): Promise<ForgotPasswordResponse> {
    const response = await this.request<ForgotPasswordResponse>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });

    return response.data!;
  }

  async resendOTP(email: string): Promise<ForgotPasswordResponse & { devOtp?: string }> {
    const response = await this.request<ForgotPasswordResponse & { devOtp?: string }>('/auth/resend-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });

    return response.data!;
  }

  async verifyOTP(email: string, otp: string, type: string = 'email_verification'): Promise<any> {
    const response = await this.request<any>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp, type }),
    });

    if (response.success && response.data && response.data.accessToken) {
      this.setAuthTokens(response.data.accessToken, response.data.refreshToken);
      this.setCurrentUser(response.data.user);
    }

    return response.data!;
  }

  async resetPassword(email: string, otp: string, newPassword: string, confirmPassword: string): Promise<ResetPasswordResponse> {
    const response = await this.request<ResetPasswordResponse>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, otp, newPassword, confirmPassword }),
    });

    return response.data!;
  }

  async getProfile(): Promise<any> {
    const response = await this.request<any>('/auth/profile', {
      method: 'GET',
    });

    return response.data!;
  }

  async updateProfile(profileData: {
    firstName?: string;
    lastName?: string;
    mobile?: string;
    age?: number;
    skinType?: string;
    allergies?: string[];
    medicalHistory?: string;
  }): Promise<any> {
    const response = await this.request<any>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });

    return response.data!;
  }

  async changePassword(currentPassword: string, newPassword: string, confirmPassword: string): Promise<any> {
    const response = await this.request<any>('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
    });

    return response.data!;
  }

  async logout(): Promise<void> {
    try {
      await this.request('/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearAuthTokens();
    }
  }

  async refreshToken(): Promise<{ accessToken: string; refreshToken: string }> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await this.request<{ accessToken: string; refreshToken: string }>('/auth/refresh-token', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });

    if (response.success && response.data) {
      this.setAuthTokens(response.data.accessToken, response.data.refreshToken);
    }

    return response.data!;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getAuthToken();
    return !!token && token !== 'undefined' && token !== 'null';
  }

  // Get current user from token (if needed)
  getCurrentUser(): any {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Set current user
  setCurrentUser(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  // Clear current user
  clearCurrentUser(): void {
    localStorage.removeItem('user');
  }

  /**
   * Predict skin condition from image (calls Python ML backend).
   * @param imageFile - File from input type="file"
   * @param model - Model name: densenet | inception | mobilenet | xception
   */
  async predictSkinImage(
    imageData: File | string,
    model: string
  ): Promise<PredictResponse> {
    const url = `${PREDICT_BASE_URL}/predict?model=${encodeURIComponent(model)}`;
    
    let config: RequestInit;
    
    if (typeof imageData === 'string') {
        // Send as JSON with imageUrl
        config = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageUrl: imageData })
        };
    } else {
        // Send as FormData with image file
        const formData = new FormData();
        formData.append('image', imageData);
        config = {
            method: 'POST',
            body: formData
        };
    }
    
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      const err = data as PredictErrorResponse;
      throw new Error(err.message || err.error || 'Prediction failed');
    }

    return data as PredictResponse;
  }

  /**
   * Analyze symptoms using text-based ML model.
   */
  async analyzeSymptoms(symptoms: string[]): Promise<PredictResponse & { advice: string; severity: string; diagnosis: string }> {
    const url = `${PREDICT_BASE_URL}/analyze_symptoms`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symptoms })
    });
    
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || data.error || 'Symptom analysis failed');
    }
    return data;
  }

  /**
   * Run detailed comparison across ALL loaded AI models.
   */
  async compareModels(
    imageData: File | string
  ): Promise<{ results: Record<string, PredictResponse>; mock_mode: boolean }> {
    const url = `${PREDICT_BASE_URL}/predict?model=all`;
    
    let config: RequestInit;
    
    if (typeof imageData === 'string') {
        config = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageUrl: imageData })
        };
    } else {
        const formData = new FormData();
        formData.append('image', imageData);
        config = {
            method: 'POST',
            body: formData
        };
    }
    
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Comparison failed');
    }

    return data;
  }

  /**
   * Health check for prediction service (models loaded, mock mode).
   */
  async predictHealth(): Promise<{
    status: string;
    models_loaded: string[];
    mock_mode: boolean;
    message?: string;
  }> {
    const response = await fetch(`${PREDICT_BASE_URL}/health`);
    const data = await response.json();
    return data;
  }

  // Diagnosis History API Methods
  async requestDiagnosis(data: {
    imageUrl?: string;
    symptoms: string[];
    description?: string;
    aiInsight?: any;
  }): Promise<ApiResponse> {
    return await this.request<any>('/diagnosis/request', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getPendingRequests(): Promise<any[]> {
    const response = await this.request<any[]>('/diagnosis/pending', {
      method: 'GET',
    });
    return response.data!;
  }

  async finalizeDiagnosis(id: string, diagnosisData: {
    prediction?: {
      disease: string;
      confidence: number;
      modelUsed: string;
    };
    recommendations?: string[];
    doctorNotes?: string;
    status: string;
    isVisibleToPatient?: boolean;
    isUrgent?: boolean;
  }): Promise<ApiResponse> {
    return await this.request<any>(`/diagnosis/${id}/finalize`, {
      method: 'PATCH',
      body: JSON.stringify(diagnosisData),
    });
  }

  async getMyDiagnoses(): Promise<any[]> {
    const response = await this.request<any[]>('/diagnosis/my', {
      method: 'GET',
    });
    return response.data!;
  }

  async getCompletedCases(): Promise<any[]> {
    const response = await this.request<any[]>('/diagnosis/completed', {
      method: 'GET',
    });
    return response.data!;
  }

  async getAnalytics(): Promise<any> {
    const response = await this.request<any>('/diagnosis/analytics', {
      method: 'GET',
    });
    return response.data!;
  }

  async getDiagnosisById(id: string): Promise<any> {
    const response = await this.request<any>(`/diagnosis/${id}`, {
      method: 'GET',
    });
    return response.data!;
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
