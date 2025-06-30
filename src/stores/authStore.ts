import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, LoginCredentials, AuthResponse } from '../types';
import { authenticateUser, User as AppUser } from '../data/users';

interface AuthState {
  user: AppUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  refreshToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      // Estado inicial
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Acciones
      login: async (credentials: LoginCredentials) => {
        try {
          set({ isLoading: true, error: null });

          // Autenticar con datos locales
          const user = authenticateUser(credentials.email, credentials.password);

          if (user) {
            // Generar un token falso para simular autenticación
            const fakeToken = `token_${Math.random().toString(36).substring(2)}`;
            
            // Guardar token en localStorage
            localStorage.setItem('authToken', fakeToken);
            
            set({
              user,
              token: fakeToken,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } else {
            throw new Error('Credenciales inválidas');
          }
        } catch (error: any) {
          set({
            error: error.message || 'Error al iniciar sesión',
            isLoading: false,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem('authToken');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      clearError: () => {
        set({ error: null });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      refreshToken: async () => {
        try {
          const currentToken = get().token;
          const currentUser = get().user;
          
          if (!currentToken || !currentUser) {
            get().logout();
            return;
          }
          
          // En una implementación real, aquí se renovaría el token
          // Por ahora solo verificamos que el usuario siga existiendo
          const user = authenticateUser(currentUser.email, 'password');
          
          if (!user) {
            get().logout();
          }
        } catch (error) {
          // Si falla el refresh, hacer logout
          get().logout();
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);