import { LoginCredentials, AuthResponse, User } from '../types';
import apiClient from '../config/api';

export const authService = {
  // Iniciar sesión
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data.data;
  },

  // Cerrar sesión
  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  // Refrescar token
  refreshToken: async (): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/refresh');
    return response.data.data;
  },

  // Obtener perfil del usuario actual
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get('/auth/profile');
    return response.data.data;
  },

  // Cambiar contraseña
  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await apiClient.put('/auth/change-password', {
      currentPassword,
      newPassword,
    });
  },

  // Solicitar restablecimiento de contraseña
  requestPasswordReset: async (email: string): Promise<void> => {
    await apiClient.post('/auth/forgot-password', { email });
  },

  // Restablecer contraseña
  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    await apiClient.post('/auth/reset-password', {
      token,
      newPassword,
    });
  },

  // Verificar si el token es válido
  verifyToken: async (): Promise<boolean> => {
    try {
      await apiClient.get('/auth/verify');
      return true;
    } catch {
      return false;
    }
  },
};