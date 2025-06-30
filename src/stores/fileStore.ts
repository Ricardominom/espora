import { create } from 'zustand';
import { FileUpload } from '../types';
import { fileService } from '../services/fileService';

interface FileState {
  files: FileUpload[];
  isLoading: boolean;
  error: string | null;
  uploadProgress: number;
}

interface FileActions {
  fetchFiles: (clientId: string, category?: string) => Promise<void>;
  uploadFile: (clientId: string, file: File, category: string) => Promise<FileUpload>;
  deleteFile: (fileId: string) => Promise<void>;
  renameFile: (fileId: string, newName: string) => Promise<void>;
  downloadFile: (fileId: string) => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  setUploadProgress: (progress: number) => void;
}

export const useFileStore = create<FileState & FileActions>((set, get) => ({
  // Estado inicial
  files: [],
  isLoading: false,
  error: null,
  uploadProgress: 0,

  // Acciones
  fetchFiles: async (clientId: string, category?: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const files = await fileService.getFiles(clientId, category);
      
      set({
        files,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Error al cargar archivos',
        isLoading: false,
      });
    }
  },

  uploadFile: async (clientId: string, file: File, category: string) => {
    try {
      set({ isLoading: true, error: null, uploadProgress: 0 });
      
      const uploadedFile = await fileService.uploadFile(
        clientId, 
        file, 
        category,
        (progress) => {
          set({ uploadProgress: progress });
        }
      );
      
      set((state) => ({
        files: [...state.files, uploadedFile],
        isLoading: false,
        uploadProgress: 100,
      }));
      
      return uploadedFile;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Error al subir archivo',
        isLoading: false,
        uploadProgress: 0,
      });
      throw error;
    }
  },

  deleteFile: async (fileId: string) => {
    try {
      set({ isLoading: true, error: null });
      
      await fileService.deleteFile(fileId);
      
      set((state) => ({
        files: state.files.filter(file => file.id !== fileId),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Error al eliminar archivo',
        isLoading: false,
      });
    }
  },

  renameFile: async (fileId: string, newName: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const updatedFile = await fileService.renameFile(fileId, newName);
      
      set((state) => ({
        files: state.files.map(file => 
          file.id === fileId ? updatedFile : file
        ),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Error al renombrar archivo',
        isLoading: false,
      });
    }
  },

  downloadFile: async (fileId: string) => {
    try {
      await fileService.downloadFile(fileId);
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Error al descargar archivo',
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setUploadProgress: (progress: number) => {
    set({ uploadProgress: progress });
  },
}));