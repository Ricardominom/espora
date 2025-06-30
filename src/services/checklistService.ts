import { ChecklistData, ChecklistItem } from '../types';
import apiClient from '../config/api';

export const checklistService = {
  // Obtener checklists
  getChecklists: async (clientId?: string): Promise<ChecklistData[]> => {
    const params = clientId ? { clientId } : {};
    const response = await apiClient.get('/checklists', { params });
    return response.data.data;
  },

  // Obtener checklist por ID
  getChecklistById: async (id: string): Promise<ChecklistData> => {
    const response = await apiClient.get(`/checklists/${id}`);
    return response.data.data;
  },

  // Crear nuevo checklist
  createChecklist: async (
    clientId: string, 
    agreementId: string, 
    items: ChecklistItem[]
  ): Promise<ChecklistData> => {
    const response = await apiClient.post('/checklists', {
      clientId,
      agreementId,
      items,
    });
    return response.data.data;
  },

  // Actualizar item del checklist
  updateChecklistItem: async (
    checklistId: string, 
    itemId: string, 
    updates: Partial<ChecklistItem>
  ): Promise<ChecklistData> => {
    const response = await apiClient.patch(`/checklists/${checklistId}/items/${itemId}`, updates);
    return response.data.data;
  },

  // Alternar completado de un item
  toggleItemCompletion: async (checklistId: string, itemId: string): Promise<ChecklistData> => {
    const response = await apiClient.patch(`/checklists/${checklistId}/items/${itemId}/toggle`);
    return response.data.data;
  },

  // Actualizar valores de campos de un item
  updateItemFieldValues: async (
    checklistId: string, 
    itemId: string, 
    fieldValues: Record<string, string>
  ): Promise<ChecklistData> => {
    const response = await apiClient.patch(`/checklists/${checklistId}/items/${itemId}/fields`, {
      fieldValues,
    });
    return response.data.data;
  },

  // Obtener progreso del checklist
  getChecklistProgress: async (checklistId: string): Promise<{
    completedCount: number;
    totalCount: number;
    progressPercentage: number;
  }> => {
    const response = await apiClient.get(`/checklists/${checklistId}/progress`);
    return response.data.data;
  },

  // Marcar checklist como completado
  completeChecklist: async (checklistId: string): Promise<ChecklistData> => {
    const response = await apiClient.patch(`/checklists/${checklistId}/complete`);
    return response.data.data;
  },

  // Exportar checklist a PDF
  exportChecklistToPdf: async (checklistId: string): Promise<void> => {
    const response = await apiClient.get(`/checklists/${checklistId}/export`, {
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `checklist-${checklistId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};