import React from 'react';
import { ShieldAlert, X } from 'lucide-react';

interface AccessDeniedModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
}

const AccessDeniedModal: React.FC<AccessDeniedModalProps> = ({ 
  isOpen, 
  onClose, 
  featureName 
}) => {
  // Detectar el tema actual desde el body
  const isDarkMode = document.body.classList.contains('dark-theme');

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm ${
      isDarkMode ? 'bg-black/50' : 'bg-black/30'
    }`}>
      <div className={`w-full max-w-md p-6 rounded-xl shadow-2xl animate-in fade-in duration-200 ${
        isDarkMode 
          ? 'bg-zinc-900/90 border border-white/10' 
          : 'bg-white/95 border border-red-200/30 shadow-red-100/20'
      }`} style={{
        transform: 'translateY(0)',
        animation: 'modalSlideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${
              isDarkMode ? 'bg-red-500/20' : 'bg-red-100'
            }`}>
              <ShieldAlert size={20} className={isDarkMode ? 'text-red-400' : 'text-red-500'} />
            </div>
            <h2 className={`text-xl font-semibold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Acceso denegado
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
          <p className="mb-2">No tienes permisos suficientes para acceder a esta sección.</p>
          <p className={`mt-2 p-3 rounded-lg text-sm ${
            isDarkMode ? 'bg-white/5 text-white/70' : 'bg-red-50 text-red-700'
          }`}>
            La función <span className="font-semibold">{featureName}</span> requiere privilegios de administrador.
          </p>
          <p className="mt-3 text-sm">Contacta al administrador del sistema si necesitas acceso a esta funcionalidad.</p>
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              isDarkMode
                ? 'bg-white/10 hover:bg-white/15 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
            }`}
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccessDeniedModal;