import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Construction, ArrowLeft, LogOut } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import Logo from '../components/Logo';
import LogoutDialog from '../components/LogoutDialog';
import '../styles/construction.css';

const ConstructionPage: React.FC = () => {
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

  return (
    <div className="construction-page">
      <div className="construction-overlay" />
      <div className="construction-overlay" style={{ transform: 'rotate(180deg)' }} />
      
      <div className="construction-header">
        <button 
          onClick={() => navigate('/dashboard')}
          className="back-link"
        >
          <ArrowLeft size={16} />
          <span>Volver al menú</span>
        </button>
        <div className="header-right">
          <Logo />
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

      <div className={`construction-content ${isVisible ? 'visible' : ''}`}>
        <div className="icon-container">
          <Construction className="construction-icon" size={64} />
        </div>
        <h1 className="text-white">Sitio en construcción</h1>

        <div className="progress-bar">
          <div className="progress-value" />
        </div>
      </div>
    </div>
  );
};

export default ConstructionPage;