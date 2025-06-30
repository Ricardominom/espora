// Tipos para la autenticación
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

// Tipos para clientes
export interface Client {
  id: string;
  name: string;
  position: string;
  electionDate: string;
  campaignStart: string;
  socialMedia: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    tiktok?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateClientData {
  name: string;
  position: string;
  electionDate: string;
  campaignStart: string;
  socialMedia: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    tiktok?: string;
  };
}

// Tipos para servicios y acuerdos
export interface ServiceItem {
  id: string;
  code: string;
  concept: string;
  category: string;
  cost: number;
  quantity: number;
  discount: number;
  subtotal: number;
  isSelected: boolean;
}

export interface Agreement {
  id: string;
  clientId: string;
  services: ServiceItem[];
  totalAmount: number;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

// Tipos para archivos
export interface FileUpload {
  id: string;
  clientId: string;
  fileName: string;
  originalName: string;
  fileType: string;
  fileSize: number;
  filePath: string;
  category: 'expediente' | 'presentacion' | 'documento';
  uploadedAt: string;
}

// Tipos para checklist EHO
export interface ChecklistItem {
  id: string;
  itemCode: string;
  assignedUserId?: string;
  concept: string;
  section: string;
  sectionId: string;
  completed: boolean;
  accountId?: number;
  fieldValues: Record<string, string>;
}

export interface ChecklistData {
  id: string;
  clientId: string;
  agreementId: string;
  items: ChecklistItem[];
  completedCount: number;
  totalCount: number;
  progressPercentage: number;
  createdAt: string;
  updatedAt: string;
}

// Tipos para respuestas de API
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

// Tipos para paginación
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}