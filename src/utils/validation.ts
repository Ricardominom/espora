// Utilidades de validación
export const validation = {
  // Validar email
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validar contraseña (mínimo 8 caracteres, al menos una mayúscula, una minúscula y un número)
  isValidPassword: (password: string): boolean => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  },

  // Validar teléfono (formato internacional básico)
  isValidPhone: (phone: string): boolean => {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  },

  // Validar URL
  isValidUrl: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  // Validar que un string no esté vacío
  isNotEmpty: (value: string): boolean => {
    return value.trim().length > 0;
  },

  // Validar longitud mínima
  hasMinLength: (value: string, minLength: number): boolean => {
    return value.length >= minLength;
  },

  // Validar longitud máxima
  hasMaxLength: (value: string, maxLength: number): boolean => {
    return value.length <= maxLength;
  },

  // Validar que sea un número
  isNumber: (value: string): boolean => {
    return !isNaN(Number(value)) && !isNaN(parseFloat(value));
  },

  // Validar que sea un número positivo
  isPositiveNumber: (value: string): boolean => {
    const num = parseFloat(value);
    return !isNaN(num) && num > 0;
  },

  // Validar fecha (formato YYYY-MM-DD)
  isValidDate: (date: string): boolean => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) return false;
    
    const dateObj = new Date(date);
    return dateObj instanceof Date && !isNaN(dateObj.getTime());
  },

  // Validar que una fecha sea futura
  isFutureDate: (date: string): boolean => {
    const dateObj = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dateObj > today;
  },

  // Validar archivo por extensión
  isValidFileType: (fileName: string, allowedTypes: string[]): boolean => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    return extension ? allowedTypes.includes(extension) : false;
  },

  // Validar tamaño de archivo (en bytes)
  isValidFileSize: (fileSize: number, maxSizeInMB: number): boolean => {
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    return fileSize <= maxSizeInBytes;
  },
};

// Mensajes de error para validaciones
export const validationMessages = {
  required: 'Este campo es obligatorio',
  invalidEmail: 'Ingresa un email válido',
  invalidPassword: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número',
  invalidPhone: 'Ingresa un número de teléfono válido',
  invalidUrl: 'Ingresa una URL válida',
  minLength: (min: number) => `Debe tener al menos ${min} caracteres`,
  maxLength: (max: number) => `No puede tener más de ${max} caracteres`,
  invalidNumber: 'Debe ser un número válido',
  invalidPositiveNumber: 'Debe ser un número positivo',
  invalidDate: 'Ingresa una fecha válida',
  invalidFutureDate: 'La fecha debe ser futura',
  invalidFileType: (types: string[]) => `Solo se permiten archivos: ${types.join(', ')}`,
  invalidFileSize: (maxSize: number) => `El archivo no puede ser mayor a ${maxSize}MB`,
};

// Función para validar formularios
export const validateForm = (
  data: Record<string, any>,
  rules: Record<string, any[]>
): Record<string, string> => {
  const errors: Record<string, string> = {};

  Object.keys(rules).forEach(field => {
    const value = data[field];
    const fieldRules = rules[field];

    for (const rule of fieldRules) {
      if (typeof rule === 'function') {
        const result = rule(value);
        if (result !== true) {
          errors[field] = result;
          break;
        }
      }
    }
  });

  return errors;
};

// Reglas de validación predefinidas
export const validationRules = {
  required: (value: any) => {
    if (value === null || value === undefined || value === '') {
      return validationMessages.required;
    }
    return true;
  },

  email: (value: string) => {
    if (value && !validation.isValidEmail(value)) {
      return validationMessages.invalidEmail;
    }
    return true;
  },

  password: (value: string) => {
    if (value && !validation.isValidPassword(value)) {
      return validationMessages.invalidPassword;
    }
    return true;
  },

  minLength: (min: number) => (value: string) => {
    if (value && !validation.hasMinLength(value, min)) {
      return validationMessages.minLength(min);
    }
    return true;
  },

  maxLength: (max: number) => (value: string) => {
    if (value && !validation.hasMaxLength(value, max)) {
      return validationMessages.maxLength(max);
    }
    return true;
  },

  positiveNumber: (value: string) => {
    if (value && !validation.isPositiveNumber(value)) {
      return validationMessages.invalidPositiveNumber;
    }
    return true;
  },
};