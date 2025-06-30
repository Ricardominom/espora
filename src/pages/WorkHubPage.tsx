import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Calendar, CheckSquare, Clock, AlertCircle, CheckCircle, FileText, ArrowUp, Layers, Briefcase, Users, Clock4 } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { hasPermission } from '../data/users';
import LogoutDialog from '../components/LogoutDialog';
import MenuBackground from '../components/MenuBackground';
import { storage } from '../utils/storage';
import InputModal from '../components/InputModal';
import SelectAccountModalForWorkHub from '../components/SelectAccountModalForWorkHub';
import AccountBadge from '../components/AccountBadge';
import '../styles/workhub.css';

interface TaskAssignment {
  itemId: string;
  userId: string;
  concept: string;
  dueDate: string;
  section: string;
  sectionId?: string;
  completed?: boolean;
  code?: string;
}

interface ProjectItem {
  id: string;
  concept: string;
  section: string;
  sectionId: string;
  completed?: boolean;
}

const WorkHubPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [isVisible, setIsVisible] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [activeTab, setActiveTab] = useState<'tareas' | 'proyecto'>('tareas');
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<{id: number, name: string} | null>(() => {
    // Intentar cargar la cuenta seleccionada desde localStorage
    const savedAccount = storage.getItem<{id: number, name: string}>('selectedWorkHubAccount');
    return savedAccount;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [projectItems, setProjectItems] = useState<ProjectItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('today');
  const [taskAssignments, setTaskAssignments] = useState<TaskAssignment[]>([]); 
  const [groupedItems, setGroupedItems] = useState<{[key: string]: (ProjectItem | TaskAssignment)[]}>({}); 
  const [sectionOrder, setSectionOrder] = useState<string[]>([]);
  const [fieldValues, setFieldValues] = useState<{[key: string]: string}>(() => {
    // Intentar cargar los valores de los campos desde localStorage
    const savedValues = storage.getItem<{[key: string]: string}>('fieldValues');
    return savedValues || {};
  });
  const [modalState, setModalState] = useState({
    isOpen: false,
    fieldName: '',
    fieldType: 'text' as 'text' | 'number' | 'select',
    initialValue: '',
    selectOptions: [] as { value: string; label: string }[],
    onSave: (value: string) => {}
  });
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

    const loadData = () => {
      // Cargar tareas
      try {
        // Cargar las asignaciones de tareas desde localStorage pero filtrar las dummy
        let savedAssignments = storage.getItem<TaskAssignment[]>('taskAssignments') || [];
        
        // Filtrar solo tareas reales (que tengan un itemId que comience con A- o B-)
        savedAssignments = savedAssignments.filter(task => 
          task.itemId && (task.itemId.startsWith('A-') || task.itemId.startsWith('B-'))
        );
        
        // Filtrar solo las tareas asignadas al usuario actual
        if (user) {
          const userTasks = savedAssignments.filter(task => task.userId === user.id);
          setTaskAssignments(userTasks);
        }
      } catch (error) {
        console.error('Error loading task assignments:', error);
        setTaskAssignments([]);
      }
      
      // Cargar ítems del proyecto si hay una cuenta seleccionada
      if (selectedAccount) {
        loadProjectItems();
      }
    };
    
    // Cargar datos inicialmente
    loadData();
  }, [user, selectedAccount]);

  // Combine project items and task assignments for the project tab
  useEffect(() => {
    // Create a combined list of project items and task assignments
    const combined: (ProjectItem | TaskAssignment)[] = [];
    
    // Solo agregar items si hay una cuenta seleccionada
    if (selectedAccount) {
      // Agregar los items del proyecto filtrados por la cuenta seleccionada
      combined.push(...projectItems);
      
      // Add task assignments that aren't already in project items
      taskAssignments.forEach(task => {
        // Check if this task is already in project items
        const existingItem = projectItems.find(item => item.id === task.itemId);
        
        // If not found and it's a valid task with an itemId, add it
        if (!existingItem && task.itemId && (task.itemId.startsWith('A-') || task.itemId.startsWith('B-'))) {
          combined.push({
            id: task.itemId,
            concept: task.concept || "Tarea sin nombre",
            section: task.section || "Sin sección",
            sectionId: task.sectionId || "",
            completed: task.completed || false,
            isTaskAssignment: true
          });
        }
      });
    }
    
    // Group items by section
    const grouped: {[key: string]: (ProjectItem | TaskAssignment)[]} = {};
    
    combined.forEach(item => {
      const sectionId = item.sectionId || 'unknown';
      const sectionName = getSectionNameFromId(sectionId);
      
      if (!grouped[sectionName]) {
        grouped[sectionName] = [];
      }
      
      grouped[sectionName].push(item);
    });
    
    // Define the order of sections
    const order = [
      'Set Up Estrategia Digital',
      'Estudios Antropológicos',
      'Otros Estudios',
      'Set Up Acompañamiento Digital',
      'Set Up Gerencia Digital',
      'Set Up Producción',
      'Set up Difusión'
    ];
    
    setGroupedItems(grouped);
    setSectionOrder(order);
  }, [projectItems, taskAssignments, selectedAccount]);

  // Función para cargar los ítems del proyecto desde localStorage
  const loadProjectItems = () => {
    try {
      if (!selectedAccount || !selectedAccount.id) {
        setProjectItems([]);
        return;
      }
      
      // Cargar los ítems seleccionados y los datos del formulario para la cuenta actual
      const selectedItems = storage.getItem<{[key: string]: boolean}>('selectedItems') || {};
      const formData = storage.getItem<{[key: string]: any[]}>('formData') || {};
      const completedItems = storage.getItem<{[key: string]: boolean}>('completedItems') || {};
      
      // Crear un identificador para la cuenta actual
      const accountKey = `account-${selectedAccount.id}`;
      
      // Filtrar los ítems que pertenecen a la cuenta seleccionada usando el accountKey
      const items: ProjectItem[] = [];
      
      // Procesar cada sección
      Object.entries(formData).forEach(([sectionId, data]: [string, any[]]) => {
        data.forEach((item) => {
          // Solo incluir items reales (que comiencen con A- o B-) y que estén seleccionados
          const itemKey = `${accountKey}-${item.id}`;
          if (selectedItems[item.id] && (item.id.startsWith('A-') || item.id.startsWith('B-'))) {            
            items.push({
              id: item.id,
              concept: item.concept,
              section: getSectionName(sectionId),
              sectionId: sectionId,
              completed: completedItems[item.id] || false
            });
          }
        });
      });
      
      // Actualizar el estado con los ítems filtrados
      setProjectItems(items);
      console.log(`Loaded ${items.length} items for account ${selectedAccount.name}`);
    } catch (error) {
      console.error('Error loading project items:', error);
      setProjectItems([]);
    }
  };

  // Función para obtener el nombre de la sección
  const getSectionName = (sectionId: string): string => {
    const sectionMapping: {[key: string]: string} = {
      'estrategia': 'Set Up Estrategia Digital',
      'antropologicos': 'Estudios Antropológicos', 
      'otros-estudios': 'Otros Estudios',
      'acompanamiento': 'Set Up Acompañamiento Digital',
      'gerencia': 'Set Up Gerencia Digital',
      'produccion': 'Set Up Producción',
      'difusion': 'Set up Difusión'
    };
    
    return sectionMapping[sectionId] || sectionId;
  };

  // Función para obtener las tareas según la categoría seleccionada
  const getFilteredTasks = () => {
    if (!taskAssignments.length) return [];
    
    // Filtrar solo tareas reales (que tengan un itemId que comience con A- o B-)
    const realTasks = taskAssignments.filter(task => 
      task.itemId && (task.itemId.startsWith('A-') || task.itemId.startsWith('B-'))
    );
    
    if (!realTasks.length) return [];
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeekStart = new Date(today);
    nextWeekStart.setDate(today.getDate() + 7 - today.getDay());
    
    const nextWeekEnd = new Date(nextWeekStart);
    nextWeekEnd.setDate(nextWeekStart.getDate() + 6);
    
    return taskAssignments.filter(task => {
      // Si la categoría es "all", mostrar todas las tareas reales
      if (selectedCategory === 'all') return true;
      
      if (!task.dueDate) return selectedCategory === 'no-date'; 
      
      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      
      switch (selectedCategory) {
        case 'past':
          return dueDate < today;
        case 'today':
          return dueDate.getTime() === today.getTime();
        case 'this-week':
          const thisWeekEnd = new Date(today);
          thisWeekEnd.setDate(today.getDate() + (6 - today.getDay()));
          return dueDate > today && dueDate <= thisWeekEnd;
        case 'next-week':
          return dueDate >= nextWeekStart && dueDate <= nextWeekEnd;
        case 'later':
          return dueDate > nextWeekEnd;
        case 'no-date':
          return !task.dueDate;
        default:
          return true;
      }
    });
  };

  const filteredTasks = getFilteredTasks();

  // Función para obtener el conteo de tareas por categoría
  const getTaskCountForCategory = (categoryId: string) => {
    if (!taskAssignments.length) return 0;
    
    // Filtrar solo tareas reales (que tengan un itemId que comience con A- o B-)
    const realTasks = taskAssignments.filter(task => 
      task.itemId && (task.itemId.startsWith('A-') || task.itemId.startsWith('B-'))
    );
    
    if (!realTasks.length) return 0;

    // Si la categoría es "all", mostrar el total de tareas
    if (categoryId === 'all') return realTasks.length;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeekStart = new Date(today);
    nextWeekStart.setDate(today.getDate() + 7 - today.getDay());
    
    const nextWeekEnd = new Date(nextWeekStart);
    nextWeekEnd.setDate(nextWeekStart.getDate() + 6);
    
    return taskAssignments.filter(task => {
      if (!task.dueDate || !task.itemId || !(task.itemId.startsWith('A-') || task.itemId.startsWith('B-'))) return false;
      
      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      
      switch (categoryId) {
        case 'past':
          return dueDate < today;
        case 'today':
          return dueDate.getTime() === today.getTime();
        case 'this-week':
          const thisWeekEnd = new Date(today);
          thisWeekEnd.setDate(today.getDate() + (6 - today.getDay()));
          return dueDate > today && dueDate <= thisWeekEnd;
        case 'next-week':
          return dueDate >= nextWeekStart && dueDate <= nextWeekEnd;
        case 'later':
          return dueDate > nextWeekEnd;
        case 'no-date':
          return !task.dueDate;
        default:
          return true;
      }
    }).length;
  };

  const timeCategories = [
    { id: 'all', label: 'Todas', icon: <Calendar size={16} /> },
    { id: 'past', label: 'Días anteriores', icon: <Clock size={16} /> },
    { id: 'today', label: 'Hoy', icon: <Calendar size={16} /> },
    { id: 'this-week', label: 'Esta semana', icon: <Calendar size={16} /> },
    { id: 'next-week', label: 'Siguiente semana', icon: <Calendar size={16} /> },
    { id: 'later', label: 'Después', icon: <Calendar size={16} /> },
    { id: 'no-date', label: 'Sin fecha', icon: <Calendar size={16} /> }
  ];
  
  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };
  
  // Función para abrir el modal
  const openModal = (
    itemId: string, 
    fieldName: string, 
    fieldType: 'text' | 'number' | 'select' = 'text',
    selectOptions: { value: string; label: string }[] = []
  ) => {
    const fieldKey = `${itemId}-${fieldName}`;
    const currentValue = fieldValues[fieldKey] || '';
    
    setModalState({
      isOpen: true,
      fieldName,
      fieldType,
      initialValue: currentValue,
      selectOptions,
      onSave: (value: string) => {
        const updatedValues = {
          ...fieldValues,
          [fieldKey]: value
        };
        setFieldValues(updatedValues);
        
        // Guardar en localStorage
        storage.setItem('fieldValues', updatedValues);
      }
    });
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setModalState(prev => ({
      ...prev,
      isOpen: false
    }));
  };

  // Función para obtener el valor de un campo
  const getFieldValue = (itemId: string, fieldName: string) => {
    const fieldKey = `${itemId}-${fieldName}`;
    return fieldValues[fieldKey] || '';
  };
  
  {/* Mapeo de secciones con sus títulos correctos */}
  const sectionMapping = {
    'estrategia': 'Set Up Estrategia Digital',
    'antropologicos': 'Estudios Antropológicos', 
    'otros-estudios': 'Otros Estudios',
    'acompanamiento': 'Set Up Acompañamiento Digital',
    'gerencia': 'Set Up Gerencia Digital',
    'produccion': 'Set Up Producción',
    'difusion': 'Set up Difusión'
  };
  
  // Función para obtener el nombre de la sección a partir del sectionId
  const getSectionNameFromId = (sectionId: string): string => {
    return sectionMapping[sectionId as keyof typeof sectionMapping] || sectionId;
  };

  // Función para manejar la selección de cuenta
  const handleSelectAccount = (accountId: number, accountName: string) => {
    setSelectedAccount({ id: accountId, name: accountName });
    setIsLoading(true); 
    
    // Simular carga de datos
    setTimeout(() => {
      // Guardar la cuenta seleccionada en localStorage
      storage.setItem('selectedWorkHubAccount', { id: accountId, name: accountName });
      
      // Recargar los datos del proyecto para esta cuenta
      loadProjectItems(); 
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className={`workhub-page ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      <MenuBackground />
      
      <div className="workhub-header">
        <div className="workhub-breadcrumb-container">
          <span className="workhub-breadcrumb-separator">/</span>
          <button 
            onClick={() => navigate('/dashboard')}
            className="workhub-breadcrumb-link"
          >
            Menú
          </button>
        </div>
        
        <h1 className="workhub-title">
          Mi workhub {selectedAccount && activeTab === 'proyecto' && <AccountBadge accountName={selectedAccount.name} />}
        </h1>
        
        <div className="header-right">
          {activeTab === 'proyecto' && <button 
            className="account-select-button"
            onClick={() => setShowAccountModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              backdropFilter: 'blur(10px)',
              ...(isDarkMode ? {
                background: 'rgba(147, 112, 219, 0.15)',
                border: '1px solid rgba(147, 112, 219, 0.3)',
                color: 'rgba(255, 255, 255, 0.9)'
              } : {
                background: 'rgba(1, 113, 226, 0.1)',
                border: '1px solid rgba(1, 113, 226, 0.3)',
                color: '#0171E2'
              })
            }}
          > 
            <Users size={16} style={{ flexShrink: 0 }} />
            <span>Seleccionar cuenta</span>
          </button>}
        </div>
      </div>

      <div className={`workhub-content ${isVisible ? 'visible' : ''}`}>
        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button 
            className={`tab-button ${activeTab === 'tareas' ? 'active' : ''}`}
            onClick={() => setActiveTab('tareas')}
          >
            <span>TAREAS</span>
          </button>
          <button 
            className={`tab-button ${activeTab === 'proyecto' ? 'active' : ''}`}
            onClick={() => setActiveTab('proyecto')}
          >
            <span>PROYECTO</span>
          </button>
        </div>
        
        {/* Time Categories - Solo mostrar cuando el tab activo es 'tareas' */}
        {activeTab === 'tareas' && (
          <div className="time-categories">
            {timeCategories.map(category => (
              <button 
                key={category.id} 
                className={`time-category ${selectedCategory === category.id ? 'active' : ''} ${getTaskCountForCategory(category.id) === 0 ? 'empty' : ''}`}
                onClick={() => handleCategoryClick(category.id)}
              >
                <div className="category-count">{getTaskCountForCategory(category.id)}</div>
                <div className="category-label">
                  {category.icon}
                  <span>{category.label}</span>
                </div>
                {selectedCategory === category.id && (
                  <div className="selected-indicator">
                    <CheckCircle size={14} />
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
        
        {/* Task Cards Grid - 20% más grande */}
        {activeTab === 'tareas' ? (
          <div className="task-cards-container">
            <div className="task-cards-grid">
              {filteredTasks && filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <div key={task.itemId} className="task-card">
                    <div className="task-card-header">
                      <div className="task-card-section">{task.section || "Sin sección"}</div>
                      <div className="task-card-date">
                        <Calendar size={14} />
                        <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString('es-ES', { 
                          year: 'numeric',
                          month: 'short', 
                          day: 'numeric' 
                        }) : 'Sin fecha'}</span>
                      </div>
                    </div>
                    <div className="task-card-content">
                      <h3 className="task-card-title">{task.concept || task.itemId || "Tarea sin nombre"}</h3>
                      <div className="task-card-footer">
                        <div className="task-card-code">{task.itemId || task.code || "Sin código"}</div>
                        {task.completed && (
                          <div className="task-completed-badge">
                            <CheckCircle size={16} />
                            <span>Completada</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-tasks-message">
                  <AlertCircle size={48} />
                  <h3>No tienes tareas asignadas</h3>
                  <p>No se encontraron tareas en esta categoría</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="project-table-container">
            {isLoading ? (
              <div className="project-loading-state">
                <div className="loading-spinner"></div>
                <p>Cargando datos de la cuenta...</p>
              </div>
            ) : (
              <div className="project-table-wrapper">
                <table className="project-table" style={{ tableLayout: 'fixed' }}>
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Subele...</th>
                      <th>Fase</th>
                      <th>Línea estratégica</th>
                      <th>Microcampaña</th>
                      <th>Estatus</th>
                      <th>Gerente</th>
                      <th>Colaboradores</th>
                      <th>Nombre del colaborador</th>
                      <th>Perfil de colaborador</th>
                      <th>Solicitud y entrega</th>
                      <th>Semana en curso</th>
                      <th>Tipo de item</th>
                      <th>Cantidad V...</th>
                      <th>Cantidad Pr...</th>
                      <th>Cantidad A...</th>
                      <th>Fecha de finalización</th>
                      <th>Repositorio de co...</th>
                      <th>Repositorio firma...</th>
                      <th>Enlace de repositorio</th>
                      <th>Desarrollo creativo</th>
                      <th>Fecha testeo</th>
                      <th>Estatus testeo</th>
                      <th>Entrega al cliente</th>
                      <th>Nombre del archivo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedAccount && Object.keys(groupedItems).length > 0 ? (
                      sectionOrder.map(sectionName => {
                        const items = groupedItems[sectionName] || [];
                        if (items.length === 0) return null; // No mostrar secciones vacías

                        return (
                          <React.Fragment key={sectionName}>
                            <tr className="section-header">
                              <td colSpan={26} className="section-title">
                                {sectionName}
                              </td>
                            </tr>
                            {items.map((item) => (
                              <tr key={item.id} className={item.completed ? "completed-item" : ""}>
                                <td className="item-code-cell">
                                  <div className="item-code">{item.id}</div>
                                  <div className="item-concept-cell">{item.concept}</div>
                                </td>
                                <td>
                                  <button className="project-action-btn upload-btn">
                                    <ArrowUp size={16} />
                                  </button>
                                </td>
                                <td>
                                  <input 
                                    type="text" 
                                    className="project-input" 
                                    value={getFieldValue(item.id, 'fase')}
                                    placeholder="Fase" 
                                    readOnly
                                    onClick={() => openModal(item.id, 'Fase')}
                                  />
                                </td>
                                <td>
                                  <input 
                                    type="text" 
                                    className="project-input" 
                                    value={getFieldValue(item.id, 'linea_estrategica')}
                                    placeholder="Línea estratégica" 
                                    readOnly
                                    onClick={() => openModal(item.id, 'Línea estratégica')}
                                  />
                                </td>
                                <td>
                                  <input 
                                    type="text" 
                                    className="project-input" 
                                    value={getFieldValue(item.id, 'microcampana')}
                                    placeholder="Microcampaña" 
                                    readOnly
                                    onClick={() => openModal(item.id, 'Microcampaña')}
                                  />
                                </td>
                                <td>
                                  <input 
                                    type="text" 
                                    className="project-input" 
                                    value={getFieldValue(item.id, 'estatus')}
                                    placeholder="Estatus" 
                                    readOnly
                                    onClick={() => openModal(item.id, 'Estatus')}
                                  />
                                </td>
                                <td>
                                  <input 
                                    type="text" 
                                    className="project-input" 
                                    value={getFieldValue(item.id, 'gerente')}
                                    placeholder="Gerente" 
                                    readOnly
                                    onClick={() => openModal(item.id, 'Gerente')}
                                  />
                                </td>
                                <td>
                                  <input 
                                    type="text" 
                                    className="project-input" 
                                    value={getFieldValue(item.id, 'colaboradores')}
                                    placeholder="Colaboradores" 
                                    readOnly
                                    onClick={() => openModal(item.id, 'Colaboradores')}
                                  />
                                </td>
                                <td>
                                  <input 
                                    type="text" 
                                    className="project-input" 
                                    value={getFieldValue(item.id, 'nombre_colaborador')}
                                    placeholder="Nombre del colaborador" 
                                    readOnly
                                    onClick={() => openModal(item.id, 'Nombre del colaborador')}
                                  />
                                </td>
                                <td>
                                  <input 
                                    type="text" 
                                    className="project-input" 
                                    value={getFieldValue(item.id, 'perfil_colaborador')}
                                    placeholder="Perfil de colaborador" 
                                    readOnly
                                    onClick={() => openModal(item.id, 'Perfil de colaborador')}
                                  />
                                </td>
                                <td>
                                  <input 
                                    type="text" 
                                    className="project-input" 
                                    value={getFieldValue(item.id, 'solicitud_entrega')}
                                    placeholder="Solicitud y entrega" 
                                    readOnly
                                    onClick={() => openModal(item.id, 'Solicitud y entrega')}
                                  />
                                </td>
                                <td>
                                  <input 
                                    type="text" 
                                    className="project-input" 
                                    value={getFieldValue(item.id, 'semana_curso')}
                                    placeholder="Semana en curso" 
                                    readOnly
                                    onClick={() => openModal(item.id, 'Semana en curso')}
                                  />
                                </td>
                                <td>
                                  <input 
                                    type="text" 
                                    className="project-input" 
                                    value={getFieldValue(item.id, 'tipo_item')}
                                    placeholder="Tipo de item" 
                                    readOnly
                                    onClick={() => openModal(item.id, 'Tipo de item')}
                                  />
                                </td>
                                <td>
                                  <input 
                                    type="text" 
                                    className="project-input" 
                                    value={getFieldValue(item.id, 'cantidad_v')}
                                    placeholder="Cantidad V..." 
                                    readOnly
                                    onClick={() => openModal(item.id, 'Cantidad V...', 'number')}
                                  />
                                </td>
                                <td>
                                  <input 
                                    type="text" 
                                    className="project-input" 
                                    value={getFieldValue(item.id, 'cantidad_pr')}
                                    placeholder="Cantidad Pr..." 
                                    readOnly
                                    onClick={() => openModal(item.id, 'Cantidad Pr...', 'number')}
                                  />
                                </td>
                                <td>
                                  <input 
                                    type="text" 
                                    className="project-input" 
                                    value={getFieldValue(item.id, 'cantidad_a')}
                                    placeholder="Cantidad A..." 
                                    readOnly
                                    onClick={() => openModal(item.id, 'Cantidad A...', 'number')}
                                  />
                                </td>
                                <td>
                                  <input 
                                    type="date" 
                                    className="project-input" 
                                    value={getFieldValue(item.id, 'fecha_finalizacion')}
                                    onChange={(e) => {
                                      const updatedValues = {
                                        ...fieldValues,
                                        [`${item.id}-fecha_finalizacion`]: e.target.value
                                      };
                                      setFieldValues(updatedValues);
                                      storage.setItem('fieldValues', updatedValues);
                                    }}
                                  />
                                </td>
                                <td>
                                  <input 
                                    type="text" 
                                    className="project-input" 
                                    value={getFieldValue(item.id, 'repositorio_co')}
                                    placeholder="Repositorio de co..." 
                                    readOnly
                                    onClick={() => openModal(item.id, 'Repositorio de co...')}
                                  />
                                </td>
                                <td>
                                  <input 
                                    type="text" 
                                    className="project-input" 
                                    value={getFieldValue(item.id, 'repositorio_firma')}
                                    placeholder="Repositorio firma..." 
                                    readOnly
                                    onClick={() => openModal(item.id, 'Repositorio firma...')}
                                  />
                                </td>
                                <td>
                                  <input 
                                    type="text" 
                                    className="project-input" 
                                    value={getFieldValue(item.id, 'enlace_repositorio')}
                                    placeholder="Enlace de repositorio" 
                                    readOnly
                                    onClick={() => openModal(item.id, 'Enlace de repositorio')}
                                  />
                                </td>
                                <td>
                                  <input 
                                    type="text" 
                                    className="project-input" 
                                    value={getFieldValue(item.id, 'desarrollo_creativo')}
                                    placeholder="Desarrollo creativo" 
                                    readOnly
                                    onClick={() => openModal(item.id, 'Desarrollo creativo')}
                                  />
                                </td>
                                <td>
                                  <input 
                                    type="date" 
                                    className="project-input" 
                                    value={getFieldValue(item.id, 'fecha_testeo')}
                                    onChange={(e) => {
                                      const updatedValues = {
                                        ...fieldValues,
                                        [`${item.id}-fecha_testeo`]: e.target.value
                                      };
                                      setFieldValues(updatedValues);
                                      storage.setItem('fieldValues', updatedValues);
                                    }}
                                  />
                                </td>
                                <td>
                                  <input 
                                    type="text" 
                                    className="project-input" 
                                    value={getFieldValue(item.id, 'estatus_testeo')}
                                    placeholder="Estatus testeo" 
                                    readOnly
                                    onClick={() => openModal(item.id, 'Estatus testeo')}
                                  />
                                </td>
                                <td>
                                  <input 
                                    type="text" 
                                    className="project-input" 
                                    value={getFieldValue(item.id, 'entrega_cliente')}
                                    placeholder="Entrega al cliente" 
                                    readOnly
                                    onClick={() => openModal(item.id, 'Entrega al cliente')}
                                  />
                                </td>
                                <td>
                                  <input 
                                    type="text" 
                                    className="project-input" 
                                    value={getFieldValue(item.id, 'nombre_archivo')}
                                    placeholder="Nombre del archivo" 
                                    readOnly
                                    onClick={() => openModal(item.id, 'Nombre del archivo')}
                                  />
                                </td>
                              </tr>
                            ))}
                          </React.Fragment>
                        );
                      })
                    ) : (
                      <tr style={{ height: '300px' }}>
                        <td colSpan={26} className="empty-project-message" style={{ display: 'table-cell', verticalAlign: 'middle', textAlign: 'center', height: '300px' }}>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      <InputModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onSave={modalState.onSave}
        initialValue={modalState.initialValue}
        fieldName={modalState.fieldName}
        fieldType={modalState.fieldType}
        selectOptions={modalState.selectOptions}
      />

      <SelectAccountModalForWorkHub
        isOpen={showAccountModal}
        onClose={() => setShowAccountModal(false)}
        onSelectAccount={handleSelectAccount} 
      />

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

export default WorkHubPage;