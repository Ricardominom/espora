import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Calendar, CheckSquare, Clock, AlertCircle, User, CheckCircle, FileText, ArrowUp, Layers, Briefcase, Activity, Users, UserCheck, Info } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { hasPermission, getUserById } from '../data/users';
import LogoutDialog from '../components/LogoutDialog';
import MenuBackground from '../components/MenuBackground';
import { storage } from '../utils/storage';
import InputModal from '../components/InputModal';
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
  const [projectItems, setProjectItems] = useState<ProjectItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [taskAssignments, setTaskAssignments] = useState<TaskAssignment[]>([]);
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
    setIsLoading(true);

    // Función para cargar las tareas
    const loadTasks = () => {
      try {
        // Cargar las asignaciones de tareas desde localStorage 
        const savedAssignments = storage.getItem<TaskAssignment[]>('taskAssignments') || [];
        
        // Filtrar solo las tareas asignadas al usuario actual
        if (user) {
          const userTasks = savedAssignments.filter(task => task.userId === user.id);
          setTaskAssignments(userTasks);
        }
      } catch (error) {
        console.error('Error loading task assignments:', error);
      }
    };
    
    // Cargar tareas inicialmente
    loadTasks();
    setTimeout(() => {
      loadProjectItems();
      setIsLoading(false);
    }, 1000);
    
    // Configurar un intervalo para verificar periódicamente si hay nuevas tareas
    const intervalId = setInterval(loadTasks, 3000);
    
    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  }, [user]);

  // Función para cargar los ítems del proyecto desde localStorage
  const loadProjectItems = () => {
    try {
      // Cargar los ítems seleccionados y los datos del formulario desde localStorage
      const selectedItems = storage.getItem<{[key: string]: boolean}>('selectedItems') || {};
      const formData = storage.getItem<{[key: string]: any[]}>('formData');
      
      if (formData) {
        const items: ProjectItem[] = [];
        
        // Procesar cada sección y agregar solo los items seleccionados
        Object.entries(formData).forEach(([sectionId, data]: [string, any[]]) => {
          data.forEach((item) => {
            if (selectedItems[item.id]) {
              items.push({
                id: item.id,
                concept: item.concept,
                section: getSectionName(sectionId),
                sectionId: sectionId,
                completed: false
              });
            }
          });
        });
        
        setProjectItems(items);
      }
      
      // Cargar también el estado de completado de los items
      const completedItems = storage.getItem<{[key: string]: boolean}>('completedItems') || {};
      if (completedItems && projectItems.length > 0) {
        setProjectItems(prevItems => 
          prevItems.map(item => ({
            ...item,
            completed: completedItems[item.id] || false
          }))
        );
      }
    } catch (error) {
      console.error('Error loading project items:', error);
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
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeekStart = new Date(today);
    nextWeekStart.setDate(today.getDate() + 7 - today.getDay());
    
    const nextWeekEnd = new Date(nextWeekStart);
    nextWeekEnd.setDate(nextWeekStart.getDate() + 6);
    
    return taskAssignments.filter(task => {
      // Si la categoría es "all", mostrar todas las tareas
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

    // Si la categoría es "all", mostrar el total de tareas
    if (categoryId === 'all') return taskAssignments.length;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeekStart = new Date(today);
    nextWeekStart.setDate(today.getDate() + 7 - today.getDay());
    
    const nextWeekEnd = new Date(nextWeekStart);
    nextWeekEnd.setDate(nextWeekStart.getDate() + 6);
    
    return taskAssignments.filter(task => {
      if (!task.dueDate) return categoryId === 'no-date';
      
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
          WORKHUB
        </h1>
        
        <div className="header-right"></div>
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
                      <div className="task-card-section">{task.section}</div>
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
                      <h3 className="task-card-title">{task.concept || "Tarea sin nombre"}</h3>
                      <div className="task-card-footer">
                        <div className="task-card-code">{task.itemId || task.code}</div>
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
                <p>Cargando datos del proyecto...</p>
              </div>
            ) : (
              <div className="project-table-wrapper">
                <table className="project-table">
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Concepto</th>
                      <th>Sección</th>
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
                    {projectItems.length > 0 ? (
                      projectItems.map((item) => (
                        <tr key={item.id} className={item.completed ? "completed-item" : ""}>
                          <td className="item-code-cell">
                            {item.id}
                          </td>
                          <td className="item-concept-cell">
                            {item.concept}
                          </td>
                          <td className="item-section-cell">
                            {item.section}
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
                      ))
                    ) : (
                      <tr>
                        <td colSpan={26} className="empty-project-message">
                          <div className="empty-project-content">
                            <Briefcase size={48} />
                            <h3>No hay ítems de proyecto</h3>
                            <p>Aún no se han agregado ítems al acuerdo de colaboración</p>
                          </div>
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