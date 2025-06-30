import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Circle, LogOut, Trash2 } from 'lucide-react';
import { User, getAllUsers, hasPermission, getUserById } from '../data/users';
import Logo from '../components/Logo';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import { useAuthStore } from '../stores/authStore';
import AccessDeniedModal from '../components/AccessDeniedModal';
import InputModal from '../components/InputModal';
import LogoutDialog from '../components/LogoutDialog';
import { storage } from '../utils/storage';
import '../styles/checklist-captura.css';
import '../styles/input-modal.css';

interface ChecklistItem {
  id: string;
  concept: string;
  section: string;
  sectionId: string;
  completed: boolean;
}

interface TaskAssignment {
  itemId: string;
  userId: string;
  concept: string;
  dueDate: string;
  section: string;
  sectionId: string;
}

const ChecklistCapturaPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [clientName, setClientName] = useState('');
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [users, setUsers] = useState<Omit<User, 'password'>[]>([]);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showAccessDeniedModal, setShowAccessDeniedModal] = useState(false);
  const { logout, user: currentUser } = useAuthStore();
  const [taskAssignments, setTaskAssignments] = useState<TaskAssignment[]>(() => {
    try {
      // Intentar cargar las asignaciones de tareas desde localStorage
      const savedAssignments = storage.getItem<TaskAssignment[]>('taskAssignments');
      return savedAssignments || [];
    } catch (error) {
      console.error('Error loading task assignments:', error);
      return [];
    }
  });
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
  
  // Estado para la fecha de vencimiento de las tareas
  const [dueDates, setDueDates] = useState<{[key: string]: string}>(() => {
    try {
      // Intentar cargar las fechas desde localStorage
      const savedDates = storage.getItem<{[key: string]: string}>('dueDates');
      return savedDates || {};
    } catch (error) {
      console.error('Error loading due dates:', error);
      return {};
    }
  });
  
  // Refs for scroll synchronization
  const horizontalScrollRef = useRef<HTMLDivElement>(null);
  const tableMainContainerRef = useRef<HTMLDivElement>(null);

  // Cargar usuarios disponibles
  useEffect(() => {
    const availableUsers = getAllUsers();
    setUsers(availableUsers);
  }, []);
  
  // Get theme from body class
  const isDarkMode = document.body.classList.contains('dark-theme');

  // Mouse wheel horizontal scroll handler
  useEffect(() => {
    const handleWheelScroll = (e: WheelEvent) => {
      // Check if we're scrolling over the table area
      const tableContainer = tableMainContainerRef.current;
      const horizontalScroll = horizontalScrollRef.current;
      
      if (!tableContainer || !horizontalScroll) return;
      
      // Get the table container bounds
      const rect = tableContainer.getBoundingClientRect();
      const isOverTable = (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      );
      
      if (isOverTable) {
        // Prevent default vertical scroll
        e.preventDefault();
        
        // Convert vertical wheel movement to horizontal scroll
        const scrollAmount = e.deltaY * 2; // Multiply for faster scroll
        const currentScrollLeft = tableContainer.scrollLeft;
        const newScrollLeft = currentScrollLeft + scrollAmount;
        
        // Apply scroll to both containers
        tableContainer.scrollLeft = newScrollLeft;
        horizontalScroll.scrollLeft = newScrollLeft;
      }
    };
    
    // Add event listener to the document
    document.addEventListener('wheel', handleWheelScroll, { passive: false });
    
    // Cleanup
    return () => {
      document.removeEventListener('wheel', handleWheelScroll);
    };
  }, []);

  // Mapeo de secciones con sus títulos correctos
  const sectionMapping = {
    'estrategia': 'Set Up Estrategia Digital',
    'antropologicos': 'Estudios Antropológicos', 
    'otros-estudios': 'Otros Estudios',
    'acompanamiento': 'Set Up Acompañamiento Digital',
    'gerencia': 'Set Up Gerencia Digital',
    'produccion': 'Set Up Producción',
    'difusion': 'Set up Difusión'
  };

  useEffect(() => {
    const state = location.state as any;
    if (state && state.clientName) {
      setClientName(state.clientName);
    }
    
    // Si no hay datos en el state, intentar cargar desde localStorage
    if (!state || !state.selectedItems || !state.allData) {
      const savedItems = storage.getItem<{[key: string]: boolean}>('selectedItems');
      const savedFormData = storage.getItem<{[key: string]: any}>('formData');
      
      if (savedItems && savedFormData) {
        generateChecklistItems(savedItems, savedFormData);
      }
    } else {
      generateChecklistItems(state.selectedItems, state.allData);
    }
  }, [location]);

  // Función para generar los items del checklist
  const generateChecklistItems = (selectedItems: {[key: string]: boolean}, allData: {[key: string]: any[]}) => {
    const items: ChecklistItem[] = [];
    
    // Ensure we have the client name
    const clientNameToUse = clientName || storage.getItem<string>('clientName') || 'Cliente';

    // Process each section type
    Object.entries(allData).forEach(([sectionId, data]: [string, any[]]) => {
      data.forEach((item) => {
        if (selectedItems[item.id]) {
          const sectionName = sectionMapping[sectionId as keyof typeof sectionMapping] || sectionId;

          items.push({
            id: item.id,
            concept: item.concept,
            section: sectionName,
            sectionId: sectionId,
            completed: false
          });
        }
      });
    });

    // Sort items by section order and then by item ID
    const sectionOrder = ['estrategia', 'antropologicos', 'otros-estudios', 'acompanamiento', 'gerencia', 'produccion', 'difusion'];
    items.sort((a, b) => {
      const sectionIndexA = sectionOrder.indexOf(a.sectionId);
      const sectionIndexB = sectionOrder.indexOf(b.sectionId);
      
      if (sectionIndexA !== sectionIndexB) {
        return sectionIndexA - sectionIndexB;
      }
      
      // If same section, sort by item ID
      return a.id.localeCompare(b.id);
    });

    setChecklistItems(items);
  };

  useEffect(() => {
    setIsVisible(true); 
    
    // Cargar el estado de completado de los items desde localStorage
    const savedCompletedItems = storage.getItem<{[key: string]: boolean}>('completedItems');
    if (savedCompletedItems) {
      setChecklistItems(prevItems => 
        prevItems.map(item => ({
          ...item,
          completed: savedCompletedItems[item.id] || false
        }))
      );
    }
  }, []);

  const toggleItemCompletion = (itemId: string) => {
    // Actualizar el estado de los items
    const updatedItems = checklistItems.map(item => 
      item.id === itemId ? {
        ...item,
        completed: !item.completed
      } : item
    );
    
    setChecklistItems(updatedItems);
    
    // Guardar el estado de completado en localStorage
    const completedItemsMap = updatedItems.reduce((acc, item) => {
      acc[item.id] = item.completed;
      return acc;
    }, {} as {[key: string]: boolean});
    
    storage.setItem('completedItems', completedItemsMap);
    
    // Update task assignments if this item is assigned to someone
    const assignedUserId = getFieldValue(itemId, 'assignedUser');
    if (assignedUserId) {
      const item = checklistItems.find(item => item.id === itemId);
      if (item) {
        // Obtener el nuevo estado de completado
        const isCompleted = updatedItems.find(i => i.id === itemId)?.completed || false;
        
        // Find if there's an existing assignment
        const assignmentIndex = taskAssignments.findIndex(a => a.itemId === itemId);
        if (assignmentIndex >= 0) {
          const updatedAssignments = [...taskAssignments];
          // Add completed status to the assignment
          updatedAssignments[assignmentIndex] = {
            ...updatedAssignments[assignmentIndex],
            completed: isCompleted
          };
          setTaskAssignments(updatedAssignments);
          
          // Save to localStorage
          storage.setItem('taskAssignments', updatedAssignments);
        } else if (assignedUserId) {
          // Si no existe una asignación pero hay un usuario asignado, crear una nueva
          const newAssignment: TaskAssignment = {
            itemId,
            userId: assignedUserId,
            concept: item.concept,
            section: item.section,
            sectionId: item.sectionId,
            dueDate: dueDates[itemId] || '',
            completed: isCompleted
          };
          
          const newAssignments = [...taskAssignments, newAssignment];
          setTaskAssignments(newAssignments);
          storage.setItem('taskAssignments', newAssignments);
        }
      }
    }
  };

  // Función para eliminar un item del checklist
  const handleDeleteItem = (itemId: string) => {
    // Mostrar el modal de confirmación
    if (currentUser && hasPermission(currentUser, 'edit_checklist')) { 
      setItemToDelete(itemId);
    } else {
      // Mostrar modal de acceso denegado
      setShowAccessDeniedModal(true);
    }
  };

  // Función para confirmar la eliminación
  const confirmDelete = () => {
    if (!itemToDelete) return;
    
    setChecklistItems(prev => prev.filter(item => item.id !== itemToDelete));

    // Eliminar el item de las asignaciones de tareas
    const updatedAssignments = taskAssignments.filter(assignment => assignment.itemId !== itemToDelete);
    setTaskAssignments(updatedAssignments);
    storage.setItem('taskAssignments', updatedAssignments);
    
    // Eliminar el estado de completado del item
    const completedItems = storage.getItem<{[key: string]: boolean}>('completedItems') || {};
    delete completedItems[itemToDelete];
    storage.setItem('completedItems', completedItems);
    
    // Actualizar el conteo de progreso
    const updatedItems = checklistItems.filter(item => item.id !== itemToDelete);
    const completedCount = updatedItems.filter(item => item.completed).length;
    const totalCount = updatedItems.length;
    const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
    
    // También eliminar los valores de campo asociados a este item
    const updatedFieldValues = { ...fieldValues };
    Object.keys(updatedFieldValues).forEach(key => {
      if (key.startsWith(`${itemToDelete}-`)) {
        delete updatedFieldValues[key];
      }
    });
    
    setFieldValues(updatedFieldValues);
    storage.setItem('fieldValues', updatedFieldValues);
    
    // Cerrar el modal
    setItemToDelete(null);
  };

  // Group items by section
  const groupedItems = checklistItems.reduce((acc, item) => {
    if (!acc[item.section]) {
      acc[item.section] = [];
    }
    acc[item.section].push(item);
    return acc;
  }, {} as Record<string, ChecklistItem[]>);

  // Get sections in the correct order
  const orderedSections = Object.keys(sectionMapping)
    .map(sectionId => sectionMapping[sectionId as keyof typeof sectionMapping])
    .filter(sectionName => groupedItems[sectionName] && groupedItems[sectionName].length > 0);

  const completedCount = checklistItems.filter(item => item.completed).length;
  const totalCount = checklistItems.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  // Función para abrir el modal
  const openModal = (
    itemId: string, 
    fieldName: string, 
    fieldType: 'text' | 'number' | 'select' = 'text',
    selectOptions: { value: string; label: string }[] = []
  ) => {
    // Verificar si el usuario actual tiene permisos para editar el checklist
    if (currentUser && hasPermission(currentUser, 'edit_checklist')) {
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
    } else {
      // Mostrar modal de acceso denegado
      setShowAccessDeniedModal(true);
    }
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

  // Función para manejar la asignación de usuario
  const handleUserAssignment = (itemId: string, userId: string) => {
    const fieldKey = `${itemId}-assignedUser`;
    const item = checklistItems.find(item => item.id === itemId);

    // Verificar si el usuario actual tiene permisos para asignar tareas
    if (currentUser && hasPermission(currentUser, 'assign_tasks')) {
      const updatedValues = {
        ...fieldValues,
        [fieldKey]: userId
      };
      setFieldValues(updatedValues);

      // Si se seleccionó un usuario y existe el item, actualizar las asignaciones de tareas
      if (userId && item) { 
        // Verificar si ya existe una asignación para este item
        const existingAssignmentIndex = taskAssignments.findIndex(
          assignment => assignment.itemId === itemId
        );
        
        if (existingAssignmentIndex >= 0) {
          // Actualizar la asignación existente
          const updatedAssignments = [...taskAssignments];
          updatedAssignments[existingAssignmentIndex] = {
            ...updatedAssignments[existingAssignmentIndex],
            userId: userId,
           concept: item.concept,
          clientName: clientNameToUse, // Add client name to the assignment
           section: item.section,
           sectionId: item.sectionId,
            clientName: clientName, // Agregar referencia al cliente
            completed: item.completed
          };
          setTaskAssignments(updatedAssignments);
          storage.setItem('taskAssignments', updatedAssignments);
        } else {
          // Crear una nueva asignación
          const newAssignment = {
            itemId, 
            userId, 
            concept: item.concept, 
            clientName: clientNameToUse, // Add client name to the assignment
            section: item.section,
            sectionId: item.sectionId,
            dueDate: dueDates[itemId] || '',
            clientName: clientName, // Agregar referencia al cliente
            completed: item.completed
          };
          
          const newAssignments = [...taskAssignments, newAssignment];
          setTaskAssignments(newAssignments);
          storage.setItem('taskAssignments', newAssignments);
        }
      }
      
      // Guardar en localStorage
      storage.setItem('fieldValues', updatedValues);
    } else {
      // Mostrar modal de acceso denegado
      setShowAccessDeniedModal(true);
    }
  };

  // Función para manejar el cambio de fecha de vencimiento
  const handleDueDateChange = (itemId: string, date: string) => {
    // Actualizar el estado de fechas
    // Ensure the date is stored without timezone adjustments
    const updatedDates = { ...dueDates, [itemId]: date };
    setDueDates(updatedDates);
    
    // Actualizar la asignación de tarea si existe
    const assignmentIndex = taskAssignments.findIndex(a => a.itemId === itemId);
    if (assignmentIndex >= 0) {
      const updatedAssignments = [...taskAssignments]; 
      updatedAssignments[assignmentIndex].dueDate = date; // Store the exact date string
      setTaskAssignments(updatedAssignments);
      
      // Guardar en localStorage
      storage.setItem('taskAssignments', updatedAssignments);
    }
    
    // Guardar en localStorage
    storage.setItem('dueDates', updatedDates);
  };

  // Efecto para guardar las asignaciones de tareas cuando cambian
  useEffect(() => {
    storage.setItem('taskAssignments', taskAssignments);
    
    // También guardar el estado de completado de los items
    const completedItemsMap = checklistItems.reduce((acc, item) => {
      acc[item.id] = item.completed;
      return acc;
    }, {} as {[key: string]: boolean});
    
    storage.setItem('completedItems', completedItemsMap);
  }, [taskAssignments]);

  // Opciones para los selects
  const tipoOptions = [
    { value: 'freelance', label: 'FREELANCE' },
    { value: 'interno', label: 'INTERNO' }
  ];

  const cuentasOptions = [
    { value: 'compartido', label: 'COMPARTIDO' },
    { value: 'no_compartido', label: 'NO COMPARTIDO' }
  ];

  const contratacionOptions = [
    { value: 'imss', label: 'IMSS' },
    { value: 'honorarios', label: 'HONORARIOS' },
    { value: 'imss_honorarios', label: 'IMSS+HONORARIOS' }
  ];

  return (
    <div className={`checklist-captura-page ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      <div className="checklist-header">
        <div className="header-left">
          <div className="breadcrumb-container">
            <span className="breadcrumb-separator">/</span>
            <button 
              onClick={() => navigate('/dashboard')}
              className="breadcrumb-link"
            >
              Menú
            </button>
            <span className="breadcrumb-separator">/</span>
            <button 
              onClick={() => navigate('/overview-main')}
              className="breadcrumb-link"
            >
              Overview
            </button>
            <span className="breadcrumb-separator">/</span>
            <button 
              onClick={() => navigate('/overview')}
              className="breadcrumb-link"
            >
              Configuración
            </button>
            <span className="breadcrumb-separator">/</span>
            <button 
              onClick={() => navigate('/select-account')}
              className="breadcrumb-link"
            >
              Seleccionar
            </button>
            <span className="breadcrumb-separator">/</span>
            <button 
              onClick={() => navigate('/client-dashboard', { state: { clientName } })}
              className="breadcrumb-link"
            >
              {clientName ? clientName.split(' - ')[0] : 'Cliente'}
            </button>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-link current-page">
              EHO
            </span>
          </div>
        </div>
        
        <div className="header-info">
          <h1 className="page-title">Engagement Hands-Off</h1>
          <h2 className="client-name">{clientName}</h2>
        </div>
        
        <div className="header-right">
          <div className="progress-info">
            <span className="progress-text">
              {completedCount} de {totalCount} completados
            </span>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
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
        onClose={() => {
          // Guardar las asignaciones de tareas antes de cerrar sesión
          storage.setItem('taskAssignments', taskAssignments);
          setShowLogoutDialog(false);
        }}
      />

      <div className={`checklist-content ${isVisible ? 'visible' : ''}`}>
        <div className="checklist-table-container">
          {/* Barra de scroll horizontal superior */}
          <div 
            ref={horizontalScrollRef}
            className="table-horizontal-scroll"
            onScroll={(e) => {
              if (tableMainContainerRef.current) {
                tableMainContainerRef.current.scrollLeft = e.currentTarget.scrollLeft;
              }
            }}
          >
            <div className="table-scroll-content"></div>
          </div>
          
          {/* Contenedor principal con scroll vertical */}
          <div 
            ref={tableMainContainerRef}
            className="table-main-container"
            onScroll={(e) => {
              // Sincronizar el scroll horizontal con la barra superior
              if (horizontalScrollRef.current) {
                horizontalScrollRef.current.scrollLeft = e.currentTarget.scrollLeft;
              }
            }}
          >
            <table className="checklist-table">
              <thead>
                <tr>
                  <th>✓</th>
                  <th>Eliminar</th>
                  <th>Código</th>
                  <th>Concepto</th> 
                  <th>Perfil</th>
                  <th>Tipo</th>
                  <th>Fecha de entrega</th>
                  <th>Kpi</th>
                  <th>Meta</th>
                  <th>Frecuencia</th>
                  <th>Duración</th>
                  <th>Sueldo/Costo</th>
                  <th>Otros Items</th>
                  <th>Otras Cuentas</th>
                  <th>Tipo de Contratación</th>
                  <th>Días de Pago</th>
                  <th>Contrato a Firmar</th>
                  <th>Propuesta</th>
                  <th>Escritorio, Silla Etc</th>
                  <th>Viajes/Hospedajes Descriptivo</th>
                  <th>Viajes/Hospedajes Monto</th>
                  <th>Equipo de Cómputo</th>
                  <th>Recursos Tecnológicos y Materiales Adicionales Descriptivo</th>
                  <th>Recursos Tecnológicos y Materiales Adicionales Monto</th>
                  <th>Empresa Descriptivo</th>
                  <th>Empresa Monto</th>
                  <th>Pauta Descriptivo</th>
                  <th>Pauta Monto</th>
                  <th>Otros Gastos Descriptivos</th>
                  <th>Otros Gastos Monto</th>
                </tr>
              </thead>
              <tbody>
                {orderedSections.map((sectionName) => {
                  const items = groupedItems[sectionName];
                  return (
                  <React.Fragment key={sectionName}>
                    <tr className="section-header">
                      <td colSpan={27} className="section-title">
                        {sectionName}
                      </td>
                    </tr>
                    {items.map((item) => (
                      <tr key={item.id} className={item.completed ? 'completed' : ''}>
                        <td className="checkbox-cell">
                          <button
                            className="checkbox-button"
                            onClick={() => toggleItemCompletion(item.id)}
                          >
                            {item.completed ? (
                              <CheckCircle2 size={18} className="check-icon completed" />
                            ) : (
                              <Circle size={18} className="check-icon" />
                            )}
                          </button>
                        </td>
                        <td className="delete-cell">
                          <button
                            className="delete-button"
                            onClick={() => handleDeleteItem(item.id)}
                            title="Eliminar elemento"
                          >
                            <Trash2 size={18} className="delete-icon" />
                          </button>
                        </td>
                        <td className="checklist-item-id">{item.id}</td>
                        <td className="task-cell" style={{ minWidth: "200px", maxWidth: "200px" }}>{item.concept}</td>
                        <td>
                          <select
                            className="table-input"
                            value={getFieldValue(item.id, 'assignedUser') || ''}
                            onChange={(e) => handleUserAssignment(item.id, e.target.value)}
                            disabled={!currentUser || !hasPermission(currentUser, 'assign_tasks')} 
                          >
                            <option value="">Seleccionar...</option>
                            {users.map(user => (
                              <option key={user.id} value={user.id}>
                                {user.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <input 
                            type="text" 
                            className="table-input"
                            value={getFieldValue(item.id, 'tipo')}
                            placeholder="Tipo" 
                            readOnly
                            onClick={() => openModal(item.id, 'Tipo', 'select', tipoOptions)}
                          />
                        </td>
                        <td>
                          <input 
                            type="date" 
                            className="table-input"
                            value={dueDates[item.id] || ''}
                            onChange={(e) => handleDueDateChange(item.id, e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                          />
                        </td>
                        <td>
                          <input 
                            type="text" 
                            className="table-input"
                            value={getFieldValue(item.id, 'kpi')}
                            placeholder="KPI" 
                            readOnly
                            onClick={() => openModal(item.id, 'KPI')}
                          />
                        </td>
                        <td>
                          <input 
                            type="text" 
                            className="table-input"
                            value={getFieldValue(item.id, 'meta')}
                            placeholder="Meta" 
                            readOnly
                            onClick={() => openModal(item.id, 'Meta')}
                          />
                        </td>
                        <td>
                          <input 
                            type="text" 
                            className="table-input"
                            value={getFieldValue(item.id, 'frecuencia')}
                            placeholder="Frecuencia" 
                            readOnly
                            onClick={() => openModal(item.id, 'Frecuencia')}
                          />
                        </td>
                        <td>
                          <input 
                            type="text" 
                            className="table-input"
                            value={getFieldValue(item.id, 'duracion')}
                            placeholder="Duración" 
                            readOnly
                            onClick={() => openModal(item.id, 'Duración')}
                          />
                        </td>
                        <td>
                          <input 
                            type="text" 
                            className="table-input"
                            value={getFieldValue(item.id, 'sueldo')}
                            placeholder="Sueldo/Costo" 
                            readOnly
                            onClick={() => openModal(item.id, 'Sueldo/Costo', 'number')}
                          />
                        </td>
                        <td>
                          <input 
                            type="text" 
                            className="table-input"
                            value={getFieldValue(item.id, 'otros_items')}
                            placeholder="Otros items" 
                            readOnly
                            onClick={() => openModal(item.id, 'Otros Items')}
                          />
                        </td>
                        <td>
                          <input 
                            type="text" 
                            className="table-input"
                            value={getFieldValue(item.id, 'otras_cuentas')}
                            placeholder="Otras Cuentas"
                            readOnly
                            onClick={() => openModal(item.id, 'Otras Cuentas', 'select', cuentasOptions)}
                          />
                        </td>
                        <td>
                          <input 
                            type="text" 
                            className="table-input"
                            value={getFieldValue(item.id, 'tipo_contratacion')}
                            placeholder="Tipo de Contratación"
                            readOnly
                            onClick={() => openModal(item.id, 'Tipo de Contratación', 'select', contratacionOptions)}
                          />
                        </td>
                        <td>
                          <input 
                            type="text" 
                            className="table-input"
                            value={getFieldValue(item.id, 'dias_pago')}
                            placeholder="Días de pago" 
                            readOnly
                            onClick={() => openModal(item.id, 'Días de Pago')}
                          />
                        </td>
                        <td>
                          <input 
                            type="text" 
                            className="table-input"
                            value={getFieldValue(item.id, 'contrato')}
                            placeholder="Contrato" 
                            readOnly
                            onClick={() => openModal(item.id, 'Contrato a Firmar')}
                          />
                        </td>
                        <td>
                          <input 
                            type="text" 
                            className="table-input"
                            value={getFieldValue(item.id, 'propuesta')}
                            placeholder="Propuesta" 
                            readOnly
                            onClick={() => openModal(item.id, 'Propuesta')}
                          />
                        </td>
                        <td>
                          <input 
                            type="text" 
                            className="table-input"
                            value={getFieldValue(item.id, 'escritorio')}
                            placeholder="Escritorio, silla, etc." 
                            readOnly
                            onClick={() => openModal(item.id, 'Escritorio, Silla Etc')}
                          />
                        </td>
                        <td>
                          <input 
                            type="text" 
                            className="table-input"
                            value={getFieldValue(item.id, 'viajes_desc')}
                            placeholder="Viajes/Hospedajes desc." 
                            readOnly
                            onClick={() => openModal(item.id, 'Viajes/Hospedajes Descriptivo')}
                          />
                        </td>
                        <td>
                          <input 
                            type="text" 
                            className="table-input"
                            value={getFieldValue(item.id, 'viajes_monto')}
                            placeholder="Monto viajes" 
                            readOnly
                            onClick={() => openModal(item.id, 'Viajes/Hospedajes Monto', 'number')}
                          />
                        </td>
                        <td>
                          <input 
                            type="text" 
                            className="table-input"
                            value={getFieldValue(item.id, 'equipo_computo')}
                            placeholder="Equipo de cómputo" 
                            readOnly
                            onClick={() => openModal(item.id, 'Equipo de Cómputo')}
                          />
                        </td>
                        <td>
                          <input 
                            type="text" 
                            className="table-input"
                            value={getFieldValue(item.id, 'recursos_desc')}
                            placeholder="Recursos tecnológicos desc." 
                            readOnly
                            onClick={() => openModal(item.id, 'Recursos Tecnológicos y Materiales Adicionales Descriptivo')}
                          />
                        </td>
                        <td>
                          <input 
                            type="text" 
                            className="table-input"
                            value={getFieldValue(item.id, 'recursos_monto')}
                            placeholder="Monto recursos" 
                            readOnly
                            onClick={() => openModal(item.id, 'Recursos Tecnológicos y Materiales Adicionales Monto', 'number')}
                          />
                        </td>
                        <td>
                          <input 
                            type="text" 
                            className="table-input"
                            value={getFieldValue(item.id, 'empresa_desc')}
                            placeholder="Empresa desc." 
                            readOnly
                            onClick={() => openModal(item.id, 'Empresa Descriptivo')}
                          />
                        </td>
                        <td>
                          <input 
                            type="text" 
                            className="table-input"
                            value={getFieldValue(item.id, 'empresa_monto')}
                            placeholder="Monto empresa" 
                            readOnly
                            onClick={() => openModal(item.id, 'Empresa Monto', 'number')}
                          />
                        </td>
                        <td>
                          <input 
                            type="text" 
                            className="table-input"
                            value={getFieldValue(item.id, 'pauta_desc')}
                            placeholder="Pauta desc." 
                            readOnly
                            onClick={() => openModal(item.id, 'Pauta Descriptivo')}
                          />
                        </td>
                        <td>
                          <input 
                            type="text" 
                            className="table-input"
                            value={getFieldValue(item.id, 'pauta_monto')}
                            placeholder="Monto pauta" 
                            readOnly
                            onClick={() => openModal(item.id, 'Pauta Monto', 'number')}
                          />
                        </td>
                        <td>
                          <input 
                            type="text" 
                            className="table-input"
                            value={getFieldValue(item.id, 'otros_gastos_desc')}
                            placeholder="Otros gastos desc." 
                            readOnly
                            onClick={() => openModal(item.id, 'Otros Gastos Descriptivos')}
                          />
                        </td>
                        <td>
                          <input 
                            type="text" 
                            className="table-input"
                            value={getFieldValue(item.id, 'otros_gastos_monto')}
                            placeholder="Monto otros" 
                            readOnly
                            onClick={() => openModal(item.id, 'Otros Gastos Monto', 'number')}
                          />
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                );
                })}
              </tbody>
            </table>
          </div>
        </div>
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
      
      <DeleteConfirmationModal
        isOpen={itemToDelete !== null}
        onClose={() => setItemToDelete(null)}
        onConfirm={confirmDelete}
        itemName={checklistItems.find(item => item.id === itemToDelete)?.concept || 'este elemento'}
      />
      
      <AccessDeniedModal
        isOpen={showAccessDeniedModal}
        onClose={() => setShowAccessDeniedModal(false)}
        featureName="Edición de Checklist"
      />
    </div>
  );
};

export default ChecklistCapturaPage;