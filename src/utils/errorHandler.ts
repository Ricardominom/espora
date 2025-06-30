import { ApiError } from '../types';

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const handleApiError = (error: any): ApiError => {
  if (error.response) {
    // Error de respuesta del servidor
    return {
      success: false,
      message: error.response.data?.message || 'Error del servidor',
      errors: error.response.data?.errors,
    };
  } else if (error.request) {
    // Error de red
    return {
      success: false,
      message: 'Error de conexión. Verifica tu conexión a internet.',
    };
  } else {
    // Error de configuración
    return {
      success: false,
      message: error.message || 'Error desconocido',
    };
  }
};

export const getErrorMessage = (error: any): string => {
  if (typeof error === 'string') {
    return error;
  }

  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.message) {
    return error.message;
  }

  return 'Ha ocurrido un error inesperado';
};

export const isNetworkError = (error: any): boolean => {
  return !error.response && error.request;
};

export const isServerError = (error: any): boolean => {
  return error.response && error.response.status >= 500;
};

export const isClientError = (error: any): boolean => {
  return error.response && error.response.status >= 400 && error.response.status < 500;
};

export const isAuthError = (error: any): boolean => {
  return error.response && (error.response.status === 401 || error.response.status === 403);
};