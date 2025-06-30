import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import Logo from '../components/Logo';
import LogoutDialog from '../components/LogoutDialog';
import MenuBackground from '../components/MenuBackground';
import '../styles/overview.css';

const SelectAccountPage: React.FC = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => 
    document.body.classList.contains('dark-theme')
  );
  const { logout } = useAuthStore();
  
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

  // Lista de cuentas disponibles
  const accounts = [
    { id: 1, name: 'Juan Pérez', position: 'Alcalde', color: 'text-blue-500', isActive: true },
    { id: 2, name: 'María García', position: 'Gobernadora', color: 'text-emerald-500', isActive: true },
    { id: 3, name: 'Carlos López', position: 'Diputado', color: 'text-purple-500', isActive: false },
    { id: 4, name: 'Ana Martínez', position: 'Senadora', color: 'text-red-500', isActive: true },
    { id: 5, name: 'Roberto Silva', position: 'Presidente Municipal', color: 'text-yellow-500', isActive: false },
    { id: 6, name: 'Laura Hernández', position: 'Diputada Local', color: 'text-teal-500', isActive: true }
  ];

  const [accountStatuses, setAccountStatuses] = useState<{[key: number]: boolean}>(() => {
    const initialStatuses: {[key: number]: boolean} = {};
    accounts.forEach(account => {
      initialStatuses[account.id] = account.isActive;
    });
    return initialStatuses;
  });

  const toggleAccountStatus = (accountId: number, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevenir que se ejecute el click del botón principal
    setAccountStatuses(prev => ({
      ...prev,
      [accountId]: !prev[accountId]
    }));
  };

  const handleAccountSelect = (accountName: string, position: string) => {
    navigate('/client-dashboard', { 
      state: { 
        clientName: `${accountName} - ${position}` 
      }
    });
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
          <span className="overview-breadcrumb-separator">/</span>
          <button 
            onClick={() => navigate('/overview')}
            className="overview-breadcrumb-link"
          >
            Configuración de cuentas
          </button>
        </div>
        <h1 className="overview-title">
          Seleccionar cuenta
        </h1>
        <div className="header-right">
          <Logo />
        </div>
      </div>

      <div className={`overview-menu-grid ${isVisible ? 'visible' : ''}`} style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(143px, 1fr))', 
        gap: '1rem',
        maxWidth: '800px'
      }}>
        {accounts.map((account) => (
          <div key={account.id} className="menu-item-wrapper">
            <button
              className={`menu-item ${!accountStatuses[account.id] ? 'account-inactive' : ''}`}
              onClick={() => handleAccountSelect(account.name, account.position)}
            >
              {/* Indicador de estado en la esquina superior derecha */}
              <div 
                className={`account-status-indicator ${accountStatuses[account.id] ? 'status-active' : 'status-inactive'}`}
                onClick={(e) => toggleAccountStatus(account.id, e)}
                title={accountStatuses[account.id] ? 'Cuenta Activa - Click para desactivar' : 'Cuenta Inactiva - Click para activar'}
              >
                <div className="status-dot"></div>
              </div>
              
              <div className="menu-item-icon">
                <User size={35} className={account.color} />
              </div>
              
              {/* Badge de estado */}
              <div className={`account-status-badge ${accountStatuses[account.id] ? 'badge-active' : 'badge-inactive'}`}>
                {accountStatuses[account.id] ? 'ACTIVA' : 'INACTIVA'}
              </div>
            </button>
            <span className="menu-item-label">{account.name}</span>
            <span className="menu-item-subtitle">{account.position}</span>
          </div>
        ))}
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
    </div>
  );
};

export default SelectAccountPage;