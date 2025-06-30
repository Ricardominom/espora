import { create } from 'zustand';
import { ChecklistData, ChecklistItem } from '../types';
import { checklistService } from '../services/checklistService';

interface ChecklistState {
  checklists: ChecklistData[];
  currentChecklist: ChecklistData | null;
  isLoading: boolean;
  error: string | null;
}

interface ChecklistActions {
  fetchChecklists: (clientId?: string) => Promise<void>;
  fetchChecklistById: (id: string) => Promise<void>;
  createChecklist: (clientId: string, agreementId: string, items: ChecklistItem[]) => Promise<ChecklistData>;
  updateChecklistItem: (checklistId: string, itemId: string, updates: Partial<ChecklistItem>) => Promise<void>;
  toggleItemCompletion: (checklistId: string, itemId: string) => Promise<void>;
  updateItemFieldValues: (checklistId: string, itemId: string, fieldValues: Record<string, string>) => Promise<void>;
  setCurrentChecklist: (checklist: ChecklistData | null) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useChecklistStore = create<ChecklistState & ChecklistActions>((set, get) => ({
  // Estado inicial
  checklists: [],
  currentChecklist: null,
  isLoading: false,
  error: null,

  // Acciones
  fetchChecklists: async (clientId?: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const checklists = await checklistService.getChecklists(clientId);
      
      set({
        checklists,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Error al cargar checklists',
        isLoading: false,
      });
    }
  },

  fetchChecklistById: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const checklist = await checklistService.getChecklistById(id);
      
      set({
        currentChecklist: checklist,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Error al cargar checklist',
        isLoading: false,
      });
    }
  },

  createChecklist: async (clientId: string, agreementId: string, items: ChecklistItem[]) => {
    try {
      set({ isLoading: true, error: null });
      
      const newChecklist = await checklistService.createChecklist(clientId, agreementId, items);
      
      set((state) => ({
        checklists: [...state.checklists, newChecklist],
        currentChecklist: newChecklist,
        isLoading: false,
      }));
      
      return newChecklist;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Error al crear checklist',
        isLoading: false,
      });
      throw error;
    }
  },

  updateChecklistItem: async (checklistId: string, itemId: string, updates: Partial<ChecklistItem>) => {
    try {
      set({ isLoading: true, error: null });
      
      const updatedChecklist = await checklistService.updateChecklistItem(checklistId, itemId, updates);
      
      set((state) => ({
        checklists: state.checklists.map(checklist => 
          checklist.id === checklistId ? updatedChecklist : checklist
        ),
        currentChecklist: state.currentChecklist?.id === checklistId ? updatedChecklist : state.currentChecklist,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Error al actualizar item del checklist',
        isLoading: false,
      });
    }
  },

  toggleItemCompletion: async (checklistId: string, itemId: string) => {
    try {
      const updatedChecklist = await checklistService.toggleItemCompletion(checklistId, itemId);
      
      set((state) => ({
        checklists: state.checklists.map(checklist => 
          checklist.id === checklistId ? updatedChecklist : checklist
        ),
        currentChecklist: state.currentChecklist?.id === checklistId ? updatedChecklist : state.currentChecklist,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Error al actualizar estado del item',
      });
    }
  },

  updateItemFieldValues: async (checklistId: string, itemId: string, fieldValues: Record<string, string>) => {
    try {
      const updatedChecklist = await checklistService.updateItemFieldValues(checklistId, itemId, fieldValues);
      
      set((state) => ({
        checklists: state.checklists.map(checklist => 
          checklist.id === checklistId ? updatedChecklist : checklist
        ),
        currentChecklist: state.currentChecklist?.id === checklistId ? updatedChecklist : state.currentChecklist,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Error al actualizar campos del item',
      });
    }
  },

  setCurrentChecklist: (checklist: ChecklistData | null) => {
    set({ currentChecklist: checklist });
  },

  clearError: () => {
    set({ error: null });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
}));