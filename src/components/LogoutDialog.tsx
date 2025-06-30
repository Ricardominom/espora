import React from 'react';
import { X } from 'lucide-react';
import { storage } from '../utils/storage';
import { useAuthStore } from '../stores/authStore';

interface LogoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
}

const LogoutDialog: React.FC<LogoutDialogProps> = ({ isOpen, onClose, onConfirm = undefined }) => {
  // Detectar el tema actual desde el body
  const isDarkMode = document.body.classList.contains('dark-theme');
  const { logout } = useAuthStore();

  if (!isOpen) return null;

  const handleConfirmLogout = () => {
    // Limpiar datos del localStorage al cerrar sesión
    storage.clearAgreementData();
    logout();
    
    // Si hay una función onConfirm personalizada, ejecutarla después del logout
    if (onConfirm) {
      onConfirm();
    }
    
    // Cerrar el diálogo
    onClose();
  };

  return (
    <div className={`fixed inset-0 backdrop-blur-[2px] z-50 flex items-center justify-center ${
      isDarkMode ? 'bg-black/30' : 'bg-black/20'
    }`}>
      <div className={`w-full max-w-md p-6 rounded-2xl shadow-2xl animate-in fade-in duration-200 backdrop-blur-xl transition-all ${
        isDarkMode 
          ? 'bg-zinc-900/70 border border-white/10' 
          : 'bg-white/95 border border-blue-200/30 shadow-blue-100/20'
      }`} style={isDarkMode ? {} : {
        backgroundColor: 'rgba(253, 253, 254, 0.95)',
        borderColor: 'rgba(212, 235, 246, 0.3)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1), 0 8px 32px rgba(1, 113, 226, 0.05)'
      }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-xl font-semibold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`} style={isDarkMode ? {} : { color: '#2c3e50' }}>Cerrar sesión</h2>
          <button
            onClick={onClose}
            className={`transition-colors ${
              isDarkMode 
                ? 'text-white/60 hover:text-white' 
                : 'text-gray-500 hover:text-gray-700'
            }`} style={isDarkMode ? {} : { 
              color: '#718096',
            }}
          >
            <X size={20} />
          </button>
        </div>
        
        <p className={`mb-6 ${
          isDarkMode ? 'text-white/80' : 'text-gray-600'
        }`} style={isDarkMode ? {} : {
          color: '#4a5568'
        }}>
          ¿Estás seguro que deseas cerrar la sesión?
        </p>
        
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              isDarkMode
                ? 'text-white/70 hover:text-white hover:bg-white/10'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`} style={isDarkMode ? {} : {
              color: '#718096'
            }}
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirmLogout}
            className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition-all backdrop-blur-sm ${
              isDarkMode
                ? 'bg-red-500/80 hover:bg-red-500'
                : 'bg-red-500 hover:bg-red-600 shadow-lg hover:shadow-red-200/50'
            }`} style={isDarkMode ? {} : {
              backgroundColor: '#e53e3e',
              boxShadow: '0 4px 12px rgba(229, 62, 62, 0.2)'
            }}
            onMouseEnter={(e) => !isDarkMode && (e.currentTarget.style.backgroundColor = '#c53030')}
            onMouseLeave={(e) => !isDarkMode && (e.currentTarget.style.backgroundColor = '#e53e3e')}
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutDialog;