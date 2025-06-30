import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import Logo from '../components/Logo';
import ThemeToggle from '../components/ThemeToggle';
import TracklineBackground from '../components/TracklineBackground';
import '../styles/trackline.css';

const options = [
  { value: 'all', label: 'Todos los proyectos' },
  { value: 'active', label: 'Proyectos activos' },
  { value: 'completed', label: 'Proyectos completados' },
  { value: 'archived', label: 'Proyectos archivados' }
];

const TracklinePage: React.FC = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState('all');
  const [isDarkMode, setIsDarkMode] = useState(() => 
    document.body.classList.contains('dark-theme')
  );
  
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

  const handleThemeToggle = () => {
    if (isDarkMode) {
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(e.target.value);
  };

  return (
    <div className={`trackline-page ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      <TracklineBackground />
      <div className="trackline-header">
        <button 
          onClick={() => navigate('/dashboard')}
          className="back-link"
        >
          <ArrowLeft size={16} />
          <span>Volver al menú</span>
        </button>
        <h1 className="trackline-title">
          TrackLine
        </h1>
        <div className="header-right">
          <Logo />
          <ThemeToggle 
            isDarkMode={isDarkMode} 
            onToggle={handleThemeToggle} 
          />
        </div>
      </div>

      <div className={`trackline-content ${isVisible ? 'visible' : ''}`}>
        <div className="content-message">
          <h2>Gestión de Proyectos</h2>
          <p>Aquí podrás gestionar y hacer seguimiento de todos tus proyectos activos.</p>
          <p className="note">Para crear o seleccionar cuentas, ve a <strong>Overview de cuentas</strong> desde el menú principal.</p>
        </div>
      </div>
    </div>
  );
};

export default TracklinePage;