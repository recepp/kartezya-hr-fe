import { HR_ENDPOINTS } from '@/contants/urls';
import axiosInstance from '@/helpers/api/axiosInstance';
import { getErrorMessage } from '@/helpers/HelperUtils';
import { toast } from 'react-toastify';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    token: string;
    user: {
      id: number;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
    };
  };
  error?: string;
}

export interface UserProfile {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

// Cookie management utilities
const setCookie = (name: string, value: string, days: number = 7) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

const getCookie = (name: string): string | null => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

const deleteCookie = (name: string) => {
  document.cookie = `${name}=; Max-Age=-99999999; path=/`;
};

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    console.log('Auth service login called with:', { email: credentials.email, password: '***' });
    try {
      const response = await axiosInstance.post(HR_ENDPOINTS.AUTH.LOGIN, credentials);
      console.log('Raw axios response:', response);
      const data = response.data as LoginResponse;
      console.log('Parsed response data:', data);
      
      if (data.success && data.data.token) {
        // Store token and user info in both localStorage and cookies
        localStorage.setItem('hr_auth_token', data.data.token);
        localStorage.setItem('hr_user_profile', JSON.stringify(data.data.user));
        setCookie('hr_auth_token', data.data.token, 7); // 7 days
        console.log('Token stored successfully');
      }
      
      return data;
    } catch (error: any) {
      console.error('Auth service error:', error);
      console.error('Error response:', error.response);
      console.error('Error response data:', error.response?.data);
      
      // Handle specific error cases
      let errorMessage = getErrorMessage(error);
      console.log('Processed error message:', errorMessage);
      
      // Check for 401 Unauthorized error
      if (error.response && error.response.status === 401) {
        errorMessage = 'E-posta adresiniz yada şifreniz hatalı';
        console.log('401 error detected, custom message:', errorMessage);
      }
      
      // Don't show toast for login errors, let the component handle it
      // toast.error(errorMessage);
      
      // Create a custom error object with user-friendly message
      const customError = new Error(String(errorMessage));
      (customError as any).originalError = error;
      console.log('Throwing custom error:', customError);
      throw customError;
    }
  },

  getProfile: async (): Promise<UserProfile> => {
    try {
      const response = await axiosInstance.get(HR_ENDPOINTS.AUTH.PROFILE);
      const profile = response.data.data as UserProfile;
      localStorage.setItem('hr_user_profile', JSON.stringify(profile));
      return profile;
    } catch (error) {
      toast.error(getErrorMessage(error));
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    try {
      await axiosInstance.post(HR_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear all storage
      localStorage.removeItem('hr_auth_token');
      localStorage.removeItem('hr_user_profile');
      deleteCookie('hr_auth_token');
      window.location.href = '/login';
    }
  },

  getCurrentUser: (): UserProfile | null => {
    const userStr = localStorage.getItem('hr_user_profile');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: (): boolean => {
    return !!(localStorage.getItem('hr_auth_token') || getCookie('hr_auth_token'));
  },

  getToken: (): string | null => {
    return localStorage.getItem('hr_auth_token') || getCookie('hr_auth_token');
  }
};
