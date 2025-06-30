import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, FileText, Handshake, Settings, Presentation } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { hasPermission } from '../data/users';
import Logo from '../components/Logo';
import LogoutDialog from '../components/LogoutDialog';
import AccessDeniedModal from '../components/AccessDeniedModal';
import MenuBackground from '../components/MenuBackground';
import '../styles/overview.css';

const ClientDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
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
    // Get client name from location state if available
    const state = location.state as { clientName?: string };
    if (state?.clientName) {
      setClientName(state.clientName);
    }
  }, [location]);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const menuItems = [
    {
      id: 'expediente',
      label: 'Expediente electrónico',
      icon: <FileText size={35} className="text-blue-500" />,
      path: '/expediente-electronico'
    },
    {
      id: 'acuerdo',
      label: 'Acuerdo de colaboración',
      icon: <Handshake size={35} className="text-emerald-500" />,
      path: '/construction'
    },
    {
      id: 'eho',
      label: 'EHO',
      icon: <Settings size={35} className="text-purple-500" />,
      path: '/account'
    },
    {
      id: 'presentacion',
      label: 'Presentación inicial',
      icon: <Presentation size={35} className="text-orange-500" />,
      path: '/construction'
    }
  ];

  const handleMenuItemClick = (item: typeof menuItems[0]) => {
    // Verificar permisos según la sección
    if (item.id === 'eho' && (!user || !hasPermission(user, 'edit_checklist'))) {
      setDeniedFeature('EHO (Engagement Hands-Off)');
      setShowAccessDeniedModal(true);
      return;
    }
    
    // Si tiene permisos o no se requieren permisos especiales para esta sección
    switch (item.id) {
      case 'expediente':
        navigate('/expediente-electronico', { state: { clientName } });
        break;
      case 'acuerdo':
        navigate('/account', { state: { clientName } });
        break;
      case 'eho':
        navigate('/checklist-captura', { state: { clientName } });
        break;
      case 'presentacion':
        navigate('/presentacion-inicial', { state: { clientName } });
        break;
      default:
        navigate(item.path);
        break;
    }
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
            Overview
          </button>
          <span className="overview-breadcrumb-separator">/</span>
          <button 
            onClick={() => navigate('/overview')}
            className="overview-breadcrumb-link"
          >
            Configuración
          </button>
          <span className="overview-breadcrumb-separator">/</span>
          <button 
            onClick={() => navigate('/select-account')}
            className="overview-breadcrumb-link"
          >
            Seleccionar
          </button>
        </div>
        <div className="client-title-container">
          {clientName ? (
            <>
              <h1 className="client-name-line">
                {clientName.split(' - ')[0]}
              </h1>
              <h2 className="client-position-line">
                {clientName.split(' - ')[1]}
              </h2>
            </>
          ) : (
            <h1 className="overview-title">Dashboard del Cliente</h1>
          )}
        </div>
        <div className="header-right">
          <Logo />
        </div>
      </div>

      <div className={`overview-menu-grid ${isVisible ? 'visible' : ''}`} style={{ 
        display: 'flex', 
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: '1rem',
        maxWidth: '800px',
        flexWrap: 'nowrap'
      }}>
        {menuItems.map((item) => (
          <div key={item.id} className="menu-item-wrapper">
            <button
              className="menu-item"
              onClick={() => handleMenuItemClick(item)}
            >
              <div className="menu-item-icon">
                {item.icon}
              </div>
            </button>
            <span className="menu-item-label">{item.label}</span>
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
      
      <AccessDeniedModal
        isOpen={showAccessDeniedModal}
        onClose={() => setShowAccessDeniedModal(false)}
        featureName={deniedFeature}
      />
    </div>
  );
};

export default ClientDashboardPage;