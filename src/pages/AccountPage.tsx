import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Check, ChevronRight, ChevronLeft, LogOut } from 'lucide-react';
import Logo from '../components/Logo';
import LogoutDialog from '../components/LogoutDialog';
import AccessDeniedModal from '../components/AccessDeniedModal';
import { useAuthStore } from '../stores/authStore';
import { hasPermission } from '../data/users';
import '../styles/account.css';
import { storage } from '../utils/storage';

interface FormData {
  id: string;
  concept: string;
  cost: number;
  quantity: number;
  discount: number;
  subtotal: number;
}

const AccountPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [clientName, setClientName] = useState('');
  const [showAccessDeniedModal, setShowAccessDeniedModal] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const { logout, user } = useAuthStore();
  const [checkedItems, setCheckedItems] = useState<{[key: string]: boolean}>(() => {
    // Intentar cargar los items seleccionados desde localStorage
    const savedItems = storage.getItem<{[key: string]: boolean}>('selectedItems');
    return savedItems || {};
  });
  const [completedTabs, setCompletedTabs] = useState<Set<number>>(new Set([0])); // Tab 0 (estrategia) starts unlocked
  
  // Get theme from body class
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

  // Datos organizados por pestañas
  const tabsData = [
    {
      id: 'estrategia',
      title: 'Set Up Estrategia Digital',
      subtitle: 'Configuración inicial de la estrategia digital',
      data: [
        { id: 'A-101', concept: 'Diseño de la Estrategia Digital', cost: 0, quantity: 0, discount: 0, subtotal: 0 },
        { id: 'A-102', concept: 'Definiciones Iniciales Estratégicas', cost: 0, quantity: 0, discount: 0, subtotal: 0 },
        { id: 'A-103', concept: 'Integración de Data existente', cost: 0, quantity: 0, discount: 0, subtotal: 0 },
        { id: 'A-104', concept: 'Recopilación de Insights', cost: 0, quantity: 0, discount: 0, subtotal: 0 },
        { id: 'A-105', concept: 'Recopilación de Multimedia', cost: 0, quantity: 0, discount: 0, subtotal: 0 }
      ]
    },
    {
      id: 'antropologicos',
      title: 'Estudios Antropológicos',
      subtitle: 'Estudios antropológicos para la estrategia digital',
      data: [
        { id: 'A-106', concept: 'Análisis del Humor Social', cost: 0, quantity: 0, discount: 0, subtotal: 0 },
        { id: 'A-107', concept: 'Histograma del humor social', cost: 0, quantity: 0, discount: 0, subtotal: 0 },
        { id: 'A-108', concept: 'Estudio de identificación y definición del perfil y sus adjetivos', cost: 0, quantity: 0, discount: 0, subtotal: 0 },
        { id: 'A-109', concept: 'Identificación de los dilemas rentables', cost: 0, quantity: 0, discount: 0, subtotal: 0 },
        { id: 'A-110', concept: 'Fracturas antropológicas', cost: 0, quantity: 0, discount: 0, subtotal: 0 },
        { id: 'A-111', concept: 'Duelo de un tema', cost: 0, quantity: 0, discount: 0, subtotal: 0 },
        { id: 'A-112', concept: 'Matriz de valores', cost: 0, quantity: 0, discount: 0, subtotal: 0 },
        { id: 'A-113', concept: 'Psicografía General de los Adjetivos', cost: 0, quantity: 0, discount: 0, subtotal: 0 },
        { id: 'A-114', concept: 'Semiósfera General de los Adjetivos', cost: 0, quantity: 0, discount: 0, subtotal: 0 },
        { id: 'A-115', concept: 'Identificación de Microsegmentos Demográficos', cost: 0, quantity: 0, discount: 0, subtotal: 0 }
      ]
    },
    {
      id: 'otros-estudios',
      title: 'Otros Estudios',
      subtitle: 'Otros estudios para la estrategia digital',
      data: [
        { id: 'A-128', concept: 'Social Listening Base', cost: 0, quantity: 0, discount: 0, subtotal: 0 },
        { id: 'A-129', concept: 'Investigación en Sitio (Paneles)', cost: 0, quantity: 0, discount: 0, subtotal: 0 },
        { id: 'A-130', concept: 'Encuesta Basal', cost: 0, quantity: 0, discount: 0, subtotal: 0 }
      ]
    },
    {
      id: 'acompanamiento',
      title: 'Set Up Acompañamiento Digital',
      subtitle: 'Configuración del acompañamiento digital',
      data: [
        { id: 'A-201', concept: 'Definiciones iniciales para programa de acompañamiento', cost: 0, quantity: 0, discount: 0, subtotal: 0 },
        { id: 'A-202', concept: 'Diseño de proceso estratega digital en sitio (cuarto de coyuntura)', cost: 0, quantity: 0, discount: 0, subtotal: 0 },
        { id: 'A-203', concept: 'Diseño del sistema de acompañamiento (reporte diario)', cost: 0, quantity: 0, discount: 0, subtotal: 0 },
        { id: 'A-204', concept: 'Diseño del sistema de acompañamiento (playbook)', cost: 0, quantity: 0, discount: 0, subtotal: 0 },
        { id: 'A-205', concept: 'Diseño del proceso de comunicación instantánea', cost: 0, quantity: 0, discount: 0, subtotal: 0 },
        { id: 'A-206', concept: 'Diseño del proceso de levantamiento de imagen', cost: 0, quantity: 0, discount: 0, subtotal: 0 },
        { id: 'A-207', concept: 'Diseño del proceso de campañas concurrentes', cost: 0, quantity: 0, discount: 0, subtotal: 0 }
      ]
    },
    {
      id: 'gerencia',
      title: 'Set Up Gerencia Digital',
      subtitle: 'Configuración de la gerencia digital',
      data: [
        { id: 'A-301', concept: 'Definiciones iniciales para sistema de Gerencia Digital', cost: 0, quantity: 0, discount: 0, subtotal: 0 },
        { id: 'A-302', concept: 'Organigrama, funciones, metas, contratación participantes', cost: 0, quantity: 0, discount: 0, subtotal: 0 },
        { id: 'A-303', concept: 'Sistema de Gestión de desempeño', cost: 0, quantity: 0, discount: 0, subtotal: 0 },
        { id: 'A-304', concept: 'Procesos con áreas externas', cost: 0, quantity: 0, discount: 0, subtotal: 0 },
        { id: 'A-305', concept: 'Elaboración Presupuesto y flujo', cost: 0, quantity: 0, discount: 0, subtotal: 0 },
        { id: 'A-306', concept: 'Diseño de minuta', cost: 0, quantity: 0, discount: 0, subtotal: 0 },
        { id: 'A-307', concept: 'Diseño de playbook', cost: 0, quantity: 0, discount: 0, subtotal: 0 },
        { id: 'A-308', concept: 'Formato de parrilla', cost: 0, quantity: 0, discount: 0, subtotal: 0 },
        { id: 'A-309', concept: 'Diseño de sistema de reportes', cost: 0, quantity: 0, discount: 0, subtotal: 0 },
        { id: 'A-310', concept: 'Instalación de mesas, cuartos y torres', cost: 0, quantity: 0, discount: 0, subtotal: 0 }
      ]
    },
    {
      id: 'produccion',
      title: 'Set Up Producción',
      subtitle: 'Configuración de la producción',
      data: [
        { id: 'A-401', concept: 'Definiciones iniciales Producción', cost: 0, quantity: 0, discount: 0, subtotal: 0 },
        { id: 'A-402', concept: 'Identidad Gráfica', cost: 0, quantity: 0, discount: 0, subtotal: 0 },
        { id: 'A-403', concept: 'Sesión de fotos inicial', cost: 0, quantity: 0, discount: 0, subtotal: 0 },
        { id: 'A-404', concept: 'Benchmark digital', cost: 0, quantity: 0, discount: 0, subtotal: 0 },
        { id: 'A-405', concept: 'Estudio de tendencias gráficas', cost: 0, quantity: 0, discount: 0, subtotal: 0 },
        { id: 'A-406', concept: 'Optimización de contenidos iniciales', cost: 0, quantity: 0, discount: 0, subtotal: 0 }
      ]
    },
    {
      id: 'difusion',
      title: 'Set up Difusión',
      subtitle: 'Configuración de la difusión',
      data: [
        { id: 'A-501', concept: 'Definiciones Iniciales para difusión', cost: 0, quantity: 0, discount: 0, subtotal: 0 },
        { id: 'A-502', concept: 'Estudio de demografía digital', cost: 0, quantity: 0, discount: 0, subtotal: 0 },
        { id: 'A-503', concept: 'Estudio de audiencia de medios', cost: 0, quantity: 0, discount: 0, subtotal: 0 },
        { id: 'A-504', concept: 'Estudio de impacto de medios', cost: 0, quantity: 0, discount: 0, subtotal: 0 },
        { id: 'A-505', concept: 'Estudio de influenciadores', cost: 0, quantity: 0, discount: 0, subtotal: 0 },
        { id: 'A-506', concept: 'Estudio de fórmulas de viralización', cost: 0, quantity: 0, discount: 0, subtotal: 0 },
        { id: 'A-507', concept: 'Benchmark de difusión oficial', cost: 0, quantity: 0, discount: 0, subtotal: 0 },
        { id: 'A-508', concept: 'Benchmark de difusión alterna', cost: 0, quantity: 0, discount: 0, subtotal: 0 },
        { id: 'A-509', concept: 'Estudio de rentabilidad por microsegmento', cost: 0, quantity: 0, discount: 0, subtotal: 0 },
        { id: 'A-510', concept: 'Definición y recopilación de Bases de datos a gestar', cost: 0, quantity: 0, discount: 0, subtotal: 0 }
      ]
    }
  ];

  const [formData, setFormData] = useState<{[key: string]: FormData[]}>(() => {
    const initialData: {[key: string]: FormData[]} = {};
    tabsData.forEach(tab => {
      initialData[tab.id] = tab.data;
    });
    return initialData;
  });

  // Define currentTab early so it can be used in functions below
  const currentTab = tabsData[activeTab];

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
  
  // Verificar permisos al cargar la página
  useEffect(() => {
    if (user && !hasPermission(user, 'edit_accounts')) {
      setShowAccessDeniedModal(true);
    }
  }, [user]);

  const handleInputChange = (tabId: string, index: number, field: 'cost' | 'quantity' | 'discount', value: string) => {
    const newData = [...formData[tabId]];
    const numValue = parseFloat(value) || 0;
    const itemId = newData[index].id;
    
    newData[index][field] = numValue;
    
    // Calculate new subtotal
    const cost = newData[index].cost;
    const quantity = newData[index].quantity;
    const discount = newData[index].discount;
    
    const subtotal = cost * quantity * (1 - discount / 100);
    newData[index].subtotal = Math.round(subtotal * 100) / 100;
    
    setFormData(prev => ({
      ...prev,
      [tabId]: newData
    }));
    
    // Si el campo es quantity y se cambia a 0, desmarcar el checkbox
    if (field === 'quantity' && numValue === 0) {
      const updatedItems = {
        ...checkedItems,
        [itemId]: false
      };
      setCheckedItems(updatedItems);
      storage.setItem('selectedItems', updatedItems);
    }
    // Si el campo es quantity y se cambia a > 0, marcar el checkbox
    else if (field === 'quantity' && numValue > 0) {
      const updatedItems = {
        ...checkedItems,
        [itemId]: true
      };
      setCheckedItems(updatedItems);
      storage.setItem('selectedItems', updatedItems);
    }
  };

  const handleCheckboxChange = (itemId: string, tabId: string, index: number) => {
    const isChecked = !checkedItems[itemId];
    const updatedItems = {
      ...checkedItems,
      [itemId]: isChecked
    };
    
    setCheckedItems(updatedItems);
    
    // Guardar en localStorage
    storage.setItem('selectedItems', updatedItems);

    // Update quantity based on checkbox state
    const newQuantity = isChecked ? 1 : 0;
    handleInputChange(tabId, index, 'quantity', newQuantity.toString());
  };

  // Check if at least one checkbox is selected
  const hasSelectedItems = Object.values(checkedItems).some(checked => checked);

  // Check if all selected items in current tab have required fields completed
  const areCurrentTabItemsComplete = () => {
    if (!hasSelectedItems) return false;
    
    const currentTabItems = formData[currentTab.id];
    return currentTabItems.every(item => {
      const isChecked = checkedItems[item.id];
      if (!isChecked) return true; // Skip unchecked items
      
      // Check if required fields are completed
      return item.cost > 0 && item.quantity > 0;
    });
  };

  const isCurrentTabComplete = areCurrentTabItemsComplete();

  // Check if current tab has any selected items with incomplete data
  const hasIncompleteItemsInCurrentTab = () => {
    const currentTabItems = formData[currentTab.id];
    return currentTabItems.some(item => {
      const isChecked = checkedItems[item.id];
      if (!isChecked) return false; // Skip unchecked items
      
      // Check if required fields are incomplete
      return item.cost <= 0 || item.quantity <= 0;
    });
  };

  // Check if a tab has any selected items
  const hasSelectedItemsInTab = (tabId: string) => {
    const tabItems = formData[tabId];
    return tabItems.some(item => checkedItems[item.id]);
  };

  // Function to handle continue to next tab
  const handleContinueToNextTab = () => {
    if (isCurrentTabComplete) {
      // Mark current tab as completed and unlock next tab
      const newCompletedTabs = new Set(completedTabs);
      newCompletedTabs.add(activeTab);
      
      if (activeTab < tabsData.length - 1) {
        newCompletedTabs.add(activeTab + 1); // Unlock next tab
        setCompletedTabs(newCompletedTabs);
        setActiveTab(activeTab + 1); // Move to next tab
        
        // Guardar el estado actual de los datos del formulario
        storage.setItem('formData', formData);
      } else {
        // Last tab completed, go to checklist
        setCompletedTabs(newCompletedTabs);
        
        // Guardar el estado actual de los datos del formulario
        storage.setItem('formData', formData);
        
        navigate('/checklist-captura', { 
          state: { 
            clientName,
            selectedItems: checkedItems,
            allData: formData
          }
        });
      }
    }
  };

  // Check if a tab should be disabled (not completed and not current)
  const isTabDisabled = (tabIndex: number) => {
    return !completedTabs.has(tabIndex) && tabIndex !== activeTab;
  };

  const nextTab = () => {
    if (activeTab < tabsData.length - 1) {
      setActiveTab(activeTab + 1);
    }
  };

  const prevTab = () => {
    if (activeTab > 0) {
      setActiveTab(activeTab - 1);
    }
  };

  // Determinar si la sección actual es pequeña o grande
  const isSmallSection = currentTab.data.length <= 6; // 6 o menos items = sección pequeña
  return (
    <div className={`account-page ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      <div className="account-header">
        <div className="account-breadcrumb-container">
          <span className="account-breadcrumb-separator">/</span>
          <button 
            onClick={() => navigate('/dashboard')}
            className="account-breadcrumb-link"
          >
            Menú
          </button>
          <span className="account-breadcrumb-separator">/</span>
          <button 
            onClick={() => navigate('/overview-main')}
            className="account-breadcrumb-link"
          >
            Overview de cuentas
          </button>
          <span className="account-breadcrumb-separator">/</span>
          <button 
            onClick={() => navigate('/overview')}
            className="account-breadcrumb-link"
          >
            Configuración de cuentas
          </button>
          <span className="account-breadcrumb-separator">/</span>
          <button 
            onClick={() => navigate('/client-dashboard', { state: { clientName } })}
            className="account-breadcrumb-link"
          >
            {clientName ? clientName.split(' - ')[0] : 'Cliente'}
          </button>
        </div>
        
        <h1 className="client-name">Acuerdo de colaboración</h1>
        
        <div className="header-buttons">
          <button 
            className="account-button"
            onClick={() => setShowLogoutDialog(true)}
          >
            <LogOut size={16} />
            <span>Cerrar sesión</span>
          </button>
          <Logo />
        </div>
      </div>


      <LogoutDialog
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
      />
      
      <AccessDeniedModal
        isOpen={showAccessDeniedModal}
        onClose={() => {
          setShowAccessDeniedModal(false);
          navigate('/client-dashboard', { state: { clientName } });
        }}
        featureName="Acuerdo de Colaboración"
      />

      <div className={`account-content ${isVisible ? 'visible' : ''}`}>
        {/* Navegación de pestañas */}
        <div className="tabs-navigation">
          <div className="tabs-header">
            <h2 className="tabs-title">Configuración de Servicios</h2>
          </div>
          
          <div className="tabs-list">
            {tabsData.map((tab, index) => (
              <button
                key={tab.id}
                className={`tab-button ${index === activeTab ? 'active' : ''} ${isTabDisabled(index) ? 'disabled' : ''}`}
                disabled={isTabDisabled(index)}
                onClick={() => setActiveTab(index)}
              >
                <div className="tab-number">
                  {tab.id === 'estrategia' ? '1' :
                   tab.id === 'antropologicos' ? '1.1' :
                   tab.id === 'otros-estudios' ? '1.2' :
                   tab.id === 'acompanamiento' ? '2' :
                   tab.id === 'gerencia' ? '3' :
                   tab.id === 'produccion' ? '4' :
                   tab.id === 'difusion' ? '5' : index + 1}
                </div>
                <div className="tab-info">
                  <div className="tab-title">{tab.title}</div>
                  {!hasSelectedItemsInTab(tab.id) && (
                    <div className="tab-no-items">
                      No se contrataron items de este set
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Contenido del formulario */}
        <div className="form-content">
          <div className={`form-items ${isSmallSection ? 'small-section' : 'large-section'}`}>
            {formData[currentTab.id].map((item, index) => (
              <div key={item.id} className={`form-item ${!checkedItems[item.id] ? 'disabled' : 'selected'}`}>
                <div className="item-header">
                  <div className="item-checkbox">
                    <input 
                      type="checkbox" 
                      className="checkbox" 
                      checked={checkedItems[item.id] || false}
                      onChange={() => handleCheckboxChange(item.id, currentTab.id, index)}
                      id={`checkbox-${item.id}`}
                    />
                    <label htmlFor={`checkbox-${item.id}`} className="checkbox-label">
                      <span className="account-item-id">{item.id}</span>
                    </label>
                  </div>
                  <div className="item-concept">
                    <h4>{item.concept}</h4>
                  </div>
                </div>

                <div className="item-inputs">
                  <div className="input-group">
                    <label>Costo unitario</label>
                    <div className="input-with-prefix">
                      <span className="input-prefix">$</span>
                      <input
                        type="number"
                        value={item.cost}
                        onChange={(e) => handleInputChange(currentTab.id, index, 'cost', e.target.value)}
                        className="form-input"
                        min="0"
                        step="0.01"
                        disabled={!checkedItems[item.id]}
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <label>Cantidad</label>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleInputChange(currentTab.id, index, 'quantity', e.target.value)}
                      className="form-input"
                      min="1"
                      step="1"
                      disabled={!checkedItems[item.id]}
                      placeholder="1"
                    />
                  </div>

                  <div className="input-group">
                    <label>Descuento</label>
                    <div className="input-with-suffix">
                      <input
                        type="number"
                        value={item.discount}
                        onChange={(e) => handleInputChange(currentTab.id, index, 'discount', e.target.value)}
                        className="form-input"
                        min="0"
                        max="100"
                        step="1"
                        disabled={!checkedItems[item.id]}
                        placeholder="0"
                      />
                      <span className="input-suffix">%</span>
                    </div>
                  </div>

                  <div className="input-group">
                    <label>Subtotal</label>
                    <div className="subtotal-display">
                      ${item.subtotal.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navegación del formulario */}
        </div>
      </div>

      {hasSelectedItems && (
        <div className="continue-button-container">
          <button 
            className={`continue-button ${!isCurrentTabComplete ? 'disabled' : ''}`}
            disabled={!isCurrentTabComplete}
            onClick={handleContinueToNextTab}
          >
            <span className="button-text">
              {activeTab < tabsData.length - 1 ? 'Continuar' : 'Continuar al Checklist'}
            </span>
          </button>
        </div>
      )}

    </div>
  );
};

export default AccountPage; 