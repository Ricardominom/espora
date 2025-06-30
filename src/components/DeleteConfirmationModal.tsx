import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  itemName
}) => {
  // Detectar el tema actual desde el body
  const isDarkMode = document.body.classList.contains('dark-theme');

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm ${
        isDarkMode ? 'bg-black/50' : 'bg-black/30'
      }`}
      onClick={handleOverlayClick}
    >
      <div 
        className={`w-full max-w-md p-6 rounded-xl shadow-2xl animate-in fade-in duration-200 ${
          isDarkMode 
            ? 'bg-zinc-900/90 border border-white/10' 
            : 'bg-white/95 border border-blue-200/30 shadow-blue-100/20'
        }`}
        style={{
          transform: 'translateY(0)',
          animation: 'modalSlideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${
              isDarkMode ? 'bg-red-500/20' : 'bg-red-100'
            }`}>
              <AlertTriangle size={20} className={isDarkMode ? 'text-red-400' : 'text-red-500'} />
            </div>
            <h2 className={`text-xl font-semibold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Confirmar eliminación
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`transition-colors ${
              isDarkMode 
                ? 'text-white/60 hover:text-white' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <X size={20} />
          </button>
        </div>
        
        <div className={`mb-6 ${
          isDarkMode ? 'text-white/80' : 'text-gray-600'
        }`}>
          <p className="mb-2">¿Estás seguro de que deseas eliminar este elemento?</p>
          <p className="text-sm font-medium py-2 px-3 rounded-md bg-opacity-50 border border-opacity-20 inline-block mt-1 max-w-full overflow-hidden text-ellipsis whitespace-nowrap" 
            style={{
              backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)', 
              borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
              maxWidth: '300px',
              whiteSpace: 'normal',
              wordBreak: 'break-word',
              display: 'block'
            }}
          >
            {itemName}
          </p>
          <p className="mt-3 text-sm">Esta acción no se puede deshacer.</p>
        </div>
        
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              isDarkMode
                ? 'text-white/70 hover:text-white hover:bg-white/10'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition-all ${
              isDarkMode
                ? 'bg-red-500/80 hover:bg-red-500'
                : 'bg-red-500 hover:bg-red-600 shadow-lg hover:shadow-red-200/50'
            }`}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;