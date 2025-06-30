import { FileUpload } from '../types';
import apiClient from '../config/api';

export const fileService = {
  // Obtener archivos de un cliente
  getFiles: async (clientId: string, category?: string): Promise<FileUpload[]> => {
    const params = category ? { category } : {};
    const response = await apiClient.get(`/files/client/${clientId}`, { params });
    return response.data.data;
  },

  // Subir archivo
  uploadFile: async (
    clientId: string, 
    file: File, 
    category: string,
    onProgress?: (progress: number) => void
  ): Promise<FileUpload> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('clientId', clientId);
    formData.append('category', category);

    const response = await apiClient.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });

    return response.data.data;
  },

  // Eliminar archivo
  deleteFile: async (fileId: string): Promise<void> => {
    await apiClient.delete(`/files/${fileId}`);
  },

  // Renombrar archivo
  renameFile: async (fileId: string, newName: string): Promise<FileUpload> => {
    const response = await apiClient.patch(`/files/${fileId}/rename`, {
      fileName: newName,
    });
    return response.data.data;
  },

  // Descargar archivo
  downloadFile: async (fileId: string): Promise<void> => {
    const response = await apiClient.get(`/files/${fileId}/download`, {
      responseType: 'blob',
    });

    // Crear URL del blob y descargar
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    
    // Obtener nombre del archivo desde headers
    const contentDisposition = response.headers['content-disposition'];
    const fileName = contentDisposition
      ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
      : 'download';
    
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  // Obtener URL de vista previa
  getPreviewUrl: async (fileId: string): Promise<string> => {
    const response = await apiClient.get(`/files/${fileId}/preview`);
    return response.data.data.url;
  },

  // Obtener información del archivo
  getFileInfo: async (fileId: string): Promise<FileUpload> => {
    const response = await apiClient.get(`/files/${fileId}`);
    return response.data.data;
  },
};