// Utilidades para manejo de localStorage con tipos seguros
export const storage = {
  // Obtener item del localStorage
  getItem: <T>(key: string, defaultValue?: T): T | null | undefined => {
    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return defaultValue || null;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error parsing localStorage item "${key}":`, error);
      return defaultValue || null;
    }
  },

  // Guardar item en localStorage
  setItem: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage item "${key}":`, error);
    }
  },

  // Eliminar item del localStorage
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage item "${key}":`, error);
    }
  },

  // Limpiar todo el localStorage
  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },

  // Verificar si una clave existe
  hasItem: (key: string): boolean => {
    return localStorage.getItem(key) !== null;
  },

  // Guardar datos del acuerdo de colaboración
  saveAgreementData: (clientName: string, selectedItems: {[key: string]: boolean}, formData: any) => {
    try {
      storage.setItem('selectedItems', selectedItems);
      storage.setItem('formData', formData); 
      storage.setItem('clientName', clientName);
    } catch (error) {
      console.error('Error saving agreement data:', error);
    }
  },

  // Cargar datos del acuerdo de colaboración
  loadAgreementData: () => {
    try {
      return {
        selectedItems: storage.getItem<{[key: string]: boolean}>('selectedItems'),
        formData: storage.getItem('formData'),
        clientName: storage.getItem<string>('clientName')
      };
    } catch (error) {
      console.error('Error loading agreement data:', error);
      return {
        selectedItems: null,
        formData: null,
        clientName: null
      };
    }
  },

  // Limpiar datos del acuerdo de colaboración
  clearAgreementData: () => {
    try {
      storage.removeItem('selectedItems');
      storage.removeItem('formData');
      storage.removeItem('clientName');
    } catch (error) {
      console.error('Error clearing agreement data:', error);
    }
  },

  // Guardar asignaciones de tareas
  saveTaskAssignments: (assignments: any[]) => {
    try {
      if (!assignments) {
        assignments = [];
      }
      storage.setItem('taskAssignments', assignments);
    } catch (error) {
      console.error('Error saving task assignments:', error);
    }
  },

  // Cargar asignaciones de tareas
  getTaskAssignments: () => {
    try {
      const assignments = storage.getItem<any[]>('taskAssignments') || [];
      return Array.isArray(assignments) ? assignments : [];
    } catch (error) {
      console.error('Error loading task assignments:', error);
      return [];
    }
  },

  // Guardar estado de completado de items
  saveCompletedItems: (completedItems: {[key: string]: boolean}) => {
    try {
      storage.setItem('completedItems', completedItems || {});
    } catch (error) {
      console.error('Error saving completed items:', error);
    }
  },

  // Cargar estado de completado de items
  getCompletedItems: () => {
    try {
      const completedItems = storage.getItem<{[key: string]: boolean}>('completedItems');
      return completedItems || {};
    } catch (error) {
      console.error('Error loading completed items:', error);
      return {};
    }
  },

  // Obtener todas las claves
  getAllKeys: (): string[] => {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        keys.push(key);
      }
    }
    return keys;
  },
};

// Utilidades específicas para el token de autenticación
export const authStorage = {
  getToken: (): string | null => {
    return storage.getItem<string>('authToken');
  },

  setToken: (token: string): void => {
    storage.setItem('authToken', token);
  },

  removeToken: (): void => {
    storage.removeItem('authToken');
  },

  hasToken: (): boolean => {
    return storage.hasItem('authToken');
  },
};

// Utilidades para datos de usuario
export const userStorage = {
  getUser: () => {
    return storage.getItem('user');
  },

  setUser: (user: any): void => {
    storage.setItem('user', user);
  },

  removeUser: (): void => {
    storage.removeItem('user');
  },

  hasUser: (): boolean => {
    return storage.hasItem('user');
  },
};

// Utilidades para configuraciones de la aplicación
export const appStorage = {
  getTheme: (): 'light' | 'dark' | null => {
    return storage.getItem<'light' | 'dark'>('theme');
  },

  setTheme: (theme: 'light' | 'dark'): void => {
    storage.setItem('theme', theme);
  },

  getLanguage: (): string | null => {
    return storage.getItem<string>('language');
  },

  setLanguage: (language: string): void => {
    storage.setItem('language', language);
  },

  getLastVisitedPage: (): string | null => {
    return storage.getItem<string>('lastVisitedPage');
  },

  setLastVisitedPage: (page: string): void => {
    storage.setItem('lastVisitedPage', page);
  },
};