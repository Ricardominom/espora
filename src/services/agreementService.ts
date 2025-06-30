import { Agreement, ServiceItem } from '../types';
import apiClient from '../config/api';

export const agreementService = {
  // Obtener todos los acuerdos
  getAgreements: async (clientId?: string): Promise<Agreement[]> => {
    const params = clientId ? { clientId } : {};
    const response = await apiClient.get('/agreements', { params });
    return response.data.data;
  },

  // Obtener acuerdo por ID
  getAgreementById: async (id: string): Promise<Agreement> => {
    const response = await apiClient.get(`/agreements/${id}`);
    return response.data.data;
  },

  // Crear nuevo acuerdo
  createAgreement: async (clientId: string, services: ServiceItem[]): Promise<Agreement> => {
    const response = await apiClient.post('/agreements', {
      clientId,
      services,
    });
    return response.data.data;
  },

  // Actualizar acuerdo
  updateAgreement: async (id: string, data: Partial<Agreement>): Promise<Agreement> => {
    const response = await apiClient.put(`/agreements/${id}`, data);
    return response.data.data;
  },

  // Eliminar acuerdo
  deleteAgreement: async (id: string): Promise<void> => {
    await apiClient.delete(`/agreements/${id}`);
  },

  // Obtener servicios disponibles
  getAvailableServices: async (): Promise<ServiceItem[]> => {
    const response = await apiClient.get('/agreements/services');
    return response.data.data;
  },

  // Calcular total del acuerdo
  calculateAgreementTotal: async (services: ServiceItem[]): Promise<{
    subtotal: number;
    discount: number;
    total: number;
  }> => {
    const response = await apiClient.post('/agreements/calculate', { services });
    return response.data.data;
  },

  // Cambiar estado del acuerdo
  updateAgreementStatus: async (id: string, status: Agreement['status']): Promise<Agreement> => {
    const response = await apiClient.patch(`/agreements/${id}/status`, { status });
    return response.data.data;
  },
};