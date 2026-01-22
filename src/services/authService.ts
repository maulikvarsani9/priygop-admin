import { apiClient, apiEndpoints } from '../lib/api';
import type { LoginRequest, LoginResponse, User } from '../types/api';

export const authService = {
  // Login
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>(apiEndpoints.auth.login, data);
    return response;
  },

  // Logout
  logout: async (): Promise<void> => {
    await apiClient.post(apiEndpoints.auth.logout);
  },

  // Get current user profile
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<{ user: User }>(apiEndpoints.auth.profile);
    return response.user;
  },
};

