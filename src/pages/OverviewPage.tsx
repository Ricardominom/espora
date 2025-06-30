import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UserPlus, Users, LogOut } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { hasPermission } from '../data/users';
import Logo from '../components/Logo';
import ThemeToggle from '../components/ThemeToggle';
import CreateAccountModal from '../components/CreateAccountModal';
import SelectAccountModal from '../components/SelectAccountModal';
import LogoutDialog from '../components/LogoutDialog';
import AccessDeniedModal from '../components/AccessDeniedModal';
import MenuBackground from '../components/MenuBackground';
import '../styles/overview.css';

const OverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [shouldShowElements, setShouldShowElements] = useState(true);
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [clientName, setClientName] = useState('');
  const [showAccessDeniedModal, setShowAccessDeniedModal] = useState(false);
  const [deniedFeature, setDeniedFeature] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(() => 
    document.body.classList.contains('dark-theme')
  );
  const { logout, user } = useAuthStore();
  
  // Listen for theme changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.body.classList.contains('dark-theme'));
    });
    
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (isCreateModalOpen || isSelectModalOpen) {
      // Mantener elementos visibles durante la apertura del modal
      setShouldShowElements(true);
    } else {
      // Pequeño delay solo al cerrar
      const timer = setTimeout(() => setShouldShowElements(true), 100);
      return () => clearTimeout(timer);
    }
  }, [isCreateModalOpen, isSelectModalOpen]);

  const handleThemeToggle = () => {
    if (isDarkMode) {
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
    }
  };

  const handleCreateAccountClick = () => {
    if (user && hasPermission(user, 'create_accounts')) {
      setIsCreateModalOpen(true);
    } else {
      setDeniedFeature('Crear Cuenta');
      setShowAccessDeniedModal(true);
    }
  };

  const handleSelectAccountClick = () => {
    navigate('/select-account');
  };

  return (
    <div className={`overview-page ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      <MenuBackground />
      <div className="overview-header">
        <div className="overview-breadcrumb-container">
          <span className="overview-breadcrumb-separator">/</span>
          <button 
            onClick={() => navigate('/dashboard')}
            className="overview-breadcrumb-link"
          >
            Menú
          </button>
          <span className="overview-breadcrumb-separator">/</span>
          <button 
            onClick={() => navigate('/overview-main')}
            className="overview-breadcrumb-link"
          >
            Overview de cuentas
          </button>
        </div>
        <h1 className={`overview-title ${shouldShowElements ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
          Configuración de cuentas
        </h1>
        <div className="header-right">
          <Logo />
        </div>
      </div>

      <div className={`overview-menu-grid ${isVisible && shouldShowElements ? 'visible' : ''}`}>
        <div className="menu-item-wrapper">
          <button
            className="menu-item"
            onClick={handleCreateAccountClick}
          >
            <div className="menu-item-icon">
              <UserPlus size={35} className="text-blue-500" />
            </div>
          </button>
          <span className="menu-item-label">Crear Cuenta</span>
        </div>
        
        <div className="menu-item-wrapper">
          <button
            className="menu-item"
            onClick={handleSelectAccountClick}
          >
            <div className="menu-item-icon">
              <Users size={35} className="text-emerald-500" />
            </div>
          </button>
          <span className="menu-item-label">Seleccionar Cuenta</span>
        </div>
      </div>
      <button 
        className="logout-button"
        onClick={() => setShowLogoutDialog(true)}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          border: 'none',
          borderRadius: '20px',
          fontSize: '0.875rem',
          cursor: 'pointer',
          zIndex: 10,
          backdropFilter: 'blur(10px)',
          transition: 'all 0.2s ease',
          ...(isDarkMode ? {
            background: 'rgba(59, 130, 246, 0.15)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            color: 'rgba(255, 255, 255, 0.7)'
          } : {
            background: 'rgba(253, 253, 254, 0.95)',
            color: '#0171E2',
            border: '2px solid #0171E2',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
          })
        }}
      >
        <LogOut size={16} />
        <span>Cerrar sesión</span>
      </button>

      <LogoutDialog
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
      />

      
      <CreateAccountModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateAccount={setClientName}
      />
      
      <AccessDeniedModal
        isOpen={showAccessDeniedModal}
        onClose={() => setShowAccessDeniedModal(false)}
        featureName={deniedFeature}
      />
    </div>
  );
};

export default OverviewPage;