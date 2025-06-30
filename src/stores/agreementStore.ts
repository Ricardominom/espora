import { create } from 'zustand';
import { Agreement, ServiceItem } from '../types';
import { agreementService } from '../services/agreementService';

interface AgreementState {
  agreements: Agreement[];
  currentAgreement: Agreement | null;
  selectedServices: ServiceItem[];
  isLoading: boolean;
  error: string | null;
}

interface AgreementActions {
  fetchAgreements: (clientId?: string) => Promise<void>;
  fetchAgreementById: (id: string) => Promise<void>;
  createAgreement: (clientId: string, services: ServiceItem[]) => Promise<Agreement>;
  updateAgreement: (id: string, data: Partial<Agreement>) => Promise<void>;
  deleteAgreement: (id: string) => Promise<void>;
  addSelectedService: (service: ServiceItem) => void;
  removeSelectedService: (serviceId: string) => void;
  updateSelectedService: (serviceId: string, updates: Partial<ServiceItem>) => void;
  clearSelectedServices: () => void;
  setCurrentAgreement: (agreement: Agreement | null) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAgreementStore = create<AgreementState & AgreementActions>((set, get) => ({
  // Estado inicial
  agreements: [],
  currentAgreement: null,
  selectedServices: [],
  isLoading: false,
  error: null,

  // Acciones
  fetchAgreements: async (clientId?: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const agreements = await agreementService.getAgreements(clientId);
      
      set({
        agreements,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Error al cargar acuerdos',
        isLoading: false,
      });
    }
  },

  fetchAgreementById: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const agreement = await agreementService.getAgreementById(id);
      
      set({
        currentAgreement: agreement,
        selectedServices: agreement.services,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Error al cargar acuerdo',
        isLoading: false,
      });
    }
  },

  createAgreement: async (clientId: string, services: ServiceItem[]) => {
    try {
      set({ isLoading: true, error: null });
      
      const newAgreement = await agreementService.createAgreement(clientId, services);
      
      set((state) => ({
        agreements: [...state.agreements, newAgreement],
        currentAgreement: newAgreement,
        isLoading: false,
      }));
      
      return newAgreement;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Error al crear acuerdo',
        isLoading: false,
      });
      throw error;
    }
  },

  updateAgreement: async (id: string, data: Partial<Agreement>) => {
    try {
      set({ isLoading: true, error: null });
      
      const updatedAgreement = await agreementService.updateAgreement(id, data);
      
      set((state) => ({
        agreements: state.agreements.map(agreement => 
          agreement.id === id ? updatedAgreement : agreement
        ),
        currentAgreement: state.currentAgreement?.id === id ? updatedAgreement : state.currentAgreement,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Error al actualizar acuerdo',
        isLoading: false,
      });
    }
  },

  deleteAgreement: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      
      await agreementService.deleteAgreement(id);
      
      set((state) => ({
        agreements: state.agreements.filter(agreement => agreement.id !== id),
        currentAgreement: state.currentAgreement?.id === id ? null : state.currentAgreement,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Error al eliminar acuerdo',
        isLoading: false,
      });
    }
  },

  addSelectedService: (service: ServiceItem) => {
    set((state) => ({
      selectedServices: [...state.selectedServices, service],
    }));
  },

  removeSelectedService: (serviceId: string) => {
    set((state) => ({
      selectedServices: state.selectedServices.filter(service => service.id !== serviceId),
    }));
  },

  updateSelectedService: (serviceId: string, updates: Partial<ServiceItem>) => {
    set((state) => ({
      selectedServices: state.selectedServices.map(service =>
        service.id === serviceId ? { ...service, ...updates } : service
      ),
    }));
  },

  clearSelectedServices: () => {
    set({ selectedServices: [] });
  },

  setCurrentAgreement: (agreement: Agreement | null) => {
    set({ currentAgreement: agreement });
  },

  clearError: () => {
    set({ error: null });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
}));