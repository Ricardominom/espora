import { create } from 'zustand';
import { Client, CreateClientData, PaginatedResponse, PaginationParams } from '../types';
import { clientService } from '../services/clientService';

interface ClientState {
  clients: Client[];
  currentClient: Client | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  } | null;
}

interface ClientActions {
  fetchClients: (params?: PaginationParams) => Promise<void>;
  fetchClientById: (id: string) => Promise<void>;
  createClient: (data: CreateClientData) => Promise<Client>;
  updateClient: (id: string, data: Partial<CreateClientData>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  setCurrentClient: (client: Client | null) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useClientStore = create<ClientState & ClientActions>((set, get) => ({
  // Estado inicial
  clients: [],
  currentClient: null,
  isLoading: false,
  error: null,
  pagination: null,

  // Acciones
  fetchClients: async (params?: PaginationParams) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await clientService.getClients(params);
      
      set({
        clients: response.data,
        pagination: response.pagination,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Error al cargar clientes',
        isLoading: false,
      });
    }
  },

  fetchClientById: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const client = await clientService.getClientById(id);
      
      set({
        currentClient: client,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Error al cargar cliente',
        isLoading: false,
      });
    }
  },

  createClient: async (data: CreateClientData) => {
    try {
      set({ isLoading: true, error: null });
      
      const newClient = await clientService.createClient(data);
      
      set((state) => ({
        clients: [...state.clients, newClient],
        currentClient: newClient,
        isLoading: false,
      }));
      
      return newClient;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Error al crear cliente',
        isLoading: false,
      });
      throw error;
    }
  },

  updateClient: async (id: string, data: Partial<CreateClientData>) => {
    try {
      set({ isLoading: true, error: null });
      
      const updatedClient = await clientService.updateClient(id, data);
      
      set((state) => ({
        clients: state.clients.map(client => 
          client.id === id ? updatedClient : client
        ),
        currentClient: state.currentClient?.id === id ? updatedClient : state.currentClient,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Error al actualizar cliente',
        isLoading: false,
      });
    }
  },

  deleteClient: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      
      await clientService.deleteClient(id);
      
      set((state) => ({
        clients: state.clients.filter(client => client.id !== id),
        currentClient: state.currentClient?.id === id ? null : state.currentClient,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Error al eliminar cliente',
        isLoading: false,
      });
    }
  },

  setCurrentClient: (client: Client | null) => {
    set({ currentClient: client });
  },

  clearError: () => {
    set({ error: null });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
}));