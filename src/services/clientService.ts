import { Client, CreateClientData, PaginatedResponse, PaginationParams } from '../types';
import apiClient from '../config/api';

export const clientService = {
  // Obtener todos los clientes con paginación
  getClients: async (params?: PaginationParams): Promise<PaginatedResponse<Client>> => {
    const response = await apiClient.get('/clients', { params });
    return response.data.data;
  },

  // Obtener cliente por ID
  getClientById: async (id: string): Promise<Client> => {
    const response = await apiClient.get(`/clients/${id}`);
    return response.data.data;
  },

  // Crear nuevo cliente
  createClient: async (data: CreateClientData): Promise<Client> => {
    const response = await apiClient.post('/clients', data);
    return response.data.data;
  },

  // Actualizar cliente
  updateClient: async (id: string, data: Partial<CreateClientData>): Promise<Client> => {
    const response = await apiClient.put(`/clients/${id}`, data);
    return response.data.data;
  },

  // Eliminar cliente
  deleteClient: async (id: string): Promise<void> => {
    await apiClient.delete(`/clients/${id}`);
  },

  // Buscar clientes
  searchClients: async (query: string): Promise<Client[]> => {
    const response = await apiClient.get('/clients/search', {
      params: { q: query }
    });
    return response.data.data;
  },

  // Obtener estadísticas de clientes
  getClientStats: async (): Promise<{
    total: number;
    active: number;
    inactive: number;
    thisMonth: number;
  }> => {
    const response = await apiClient.get('/clients/stats');
    return response.data.data;
  },
};