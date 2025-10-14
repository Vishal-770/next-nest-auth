import { api } from "./api";

// Types
export interface SignupData {
  name: string;
  email: string;
  password: string;
}

export interface SignupResponse {
  id: string;
  name: string;
  email: string;
  verified: boolean;
  message: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: string;
  name: string;
  email: string;
}

export interface VerifyEmailData {
  code: string;
}

export interface VerifyEmailResponse {
  success: boolean;
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
    verified: boolean;
  };
}

// Auth API calls
export const authApi = {
  // Signup
  signup: async (data: SignupData): Promise<SignupResponse> => {
    const response = await api.post<SignupResponse>("/auth/signup", data);
    return response.data;
  },

  // Login
  login: async (data: LoginData): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/auth/signin", data);
    return response.data;
  },

  // Verify email
  verifyEmail: async (data: VerifyEmailData): Promise<VerifyEmailResponse> => {
    const response = await api.post<VerifyEmailResponse>("/auth/verify", data);
    return response.data;
  },
};
