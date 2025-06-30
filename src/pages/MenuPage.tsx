import React, { useState, Fragment } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Volume2, VolumeX, LayoutDashboard, Briefcase, Users, DollarSign, FileText, Calendar, Wallet, BookOpen, UserCog, MessageSquare, FolderLock, Lock, FlaskRound as Flask, GraduationCap } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { hasPermission } from '../data/users';
import LogoutDialog from '../components/LogoutDialog';
import Logo from '../components/Logo';
import UserAvatar from '../components/UserAvatar';
import ThemeToggle from '../components/ThemeToggle';
import MenuBackground from '../components/MenuBackground';
import BackgroundAudio from '../components/BackgroundAudio';
import AccessDeniedModal from '../components/AccessDeniedModal';
import '../styles/menu.css';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  path?: string;
}

const MenuPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showAccessDeniedModal, setShowAccessDeniedModal] = useState(false);
  const [deniedFeature, setDeniedFeature] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(() => 
    document.body.classList.contains('dark-theme')
  );
  const { logout, user } = useAuthStore();
  
  // Get theme from body class
  React.useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.body.classList.contains('dark-theme'));
    });
    
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleThemeToggle = () => {
    if (isDarkMode) {
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
    }
  };

  const handleMenuItemClick = (item: MenuItem) => {
    // Verificar permisos según la sección
    if (item.id === 'overview' && (!user || !hasPermission(user, 'create_accounts'))) {
      setDeniedFeature('Gestión de Cuentas');
      setShowAccessDeniedModal(true);
      return;
    }
    
    // Navegar a la página correspondiente
    if (item.path) {
      navigate(item.path);
    } else {
      navigate('/construction');
    }
  };

    // Si tiene permisos o no se requieren permisos especiales para esta sección

  const menuItems: MenuItem[] = [
    { 
      id: 'overview',
      label: 'Overview de cuentas',
      icon: <LayoutDashboard size={35} className="text-blue-500" />,
      color: '',
      path: '/overview-main'
    },
    { 
      id: 'workhub',
      label: 'WorkHub',
      icon: <Users size={35} className="text-emerald-500" />,
      color: '',
      path: '/workhub'
    },
    { 
      id: 'trackline',
      label: 'TrackLine',
      icon: <Briefcase size={35} className="text-red-500" />,
      color: '',
      path: '/construction'
    },
    { 
      id: 'sales-force',
      label: 'Sales Force',
      icon: <DollarSign size={35} className="text-purple-500" />,
      color: ''
    },
    { 
      id: 'people-ops',
      label: 'People Operations',
      icon: <UserCog size={35} className="text-teal-500" />,
      color: ''
    },
    { 
      id: 'agenda',
      label: 'Agenda Espora',
      icon: <Calendar size={35} className="text-yellow-500" />,
      color: ''
    },
    { 
      id: 'moneyflow',
      label: 'MoneyFlow',
      icon: <Wallet size={35} className="text-blue-400" />,
      color: ''
    },
    { 
      id: 'knowledge',
      label: 'Knowledge Base',
      icon: <BookOpen size={35} className="text-orange-500" />,
      color: ''
    },
    { 
      id: 'gestion-acuerdos',
      label: 'Gestión de Acuerdos',
      icon: <FileText size={35} className="text-green-500" />,
      color: ''
    },
    { 
      id: 'chat',
      label: 'Espora Chat',
      icon: <MessageSquare size={35} className="text-violet-500" />,
      color: ''
    },
    { 
      id: 'boveda-cliente',
      label: 'Bóveda del Cliente',
      icon: <FolderLock size={35} className="text-green-600" />,
      color: ''
    },
    { 
      id: 'boveda-espora',
      label: 'Bóveda Espora',
      icon: <Lock size={35} className="text-amber-500" />,
      color: ''
    },
    { 
      id: 'lab',
      label: 'Espora Lab',
      icon: <Flask size={35} className="text-slate-500" />,
      color: ''
    },
    { 
      id: 'campus',
      label: 'Espora Campus',
      icon: <GraduationCap size={35} className="text-red-600" />,
      color: ''
    }
  ];

  return (
    <div className={`menu-page ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      <BackgroundAudio isMuted={isMuted} />
      <MenuBackground />

      <div className="menu-header">
        <div className="header-content">
          <Logo />
          <ThemeToggle 
            isDarkMode={isDarkMode} 
            onToggle={handleThemeToggle} 
          />
        </div>
      </div>

      <button
        className="audio-control-button"
        onClick={() => setIsMuted(!isMuted)}
        title={isMuted ? "Activar sonido" : "Silenciar"}
      >
        {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>

      <button 
        className="logout-button"
        onClick={() => setShowLogoutDialog(true)}
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

      <div className="grid-container">
        <div className={`grid-row ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          {menuItems.slice(0, 7).map((item) => (
            <div key={item.id} className="menu-item-wrapper">
              <button
                className={`menu-item bg-gradient-to-br ${item.color}`}
                onClick={() => handleMenuItemClick(item)}
              >
                <div className="menu-item-icon">
                  {item.icon}
                </div>
                <div className="menu-item-reflection" />
              </button>
              <span className="menu-item-label">{item.label}</span>
            </div>
          ))}
        </div>
        <div className={`grid-row ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          {menuItems.slice(7).map((item) => (
            <div key={item.id} className="menu-item-wrapper">
              <button
                className={`menu-item bg-gradient-to-br ${item.color}`}
                onClick={() => handleMenuItemClick(item)}
              >
                <div className="menu-item-icon">
                  {item.icon}
                </div>
                <div className="menu-item-reflection" />
              </button>
              <span className="menu-item-label">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuPage;