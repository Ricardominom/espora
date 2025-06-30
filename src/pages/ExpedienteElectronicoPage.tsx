import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, ChevronLeft, ChevronRight, Check, FileText, User, TrendingUp, ShoppingCart, Award, Target } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { hasPermission } from '../data/users';
import Logo from '../components/Logo';
import LogoutDialog from '../components/LogoutDialog';
import AccessDeniedModal from '../components/AccessDeniedModal';
import MenuBackground from '../components/MenuBackground';
import '../styles/expediente-electronico.css';

interface FormData {
  // Datos de registro
  cliente: string;
  cuentaAnalitica: string;
  fechaCaptura: string;
  responsableCaptura: string;
  ultimaActualizacion: string;
  gradoConfiabilidad: 'nivel1' | 'nivel2' | 'nivel3' | 'nivel4' | '';
  nivelConfiabilidadGeneral: string;
  
  // Pre Venta
  // Generales del cliente
  nombres: string;
  apellidos: string;
  cargoActual: string;
  fechaNacimiento: string;
  lugarNacimiento: string;
  educacion: string;
  objetivoCliente: string;
  trayectoriaPolitica: string;
  contrincantesEmociones: string;
  personajesAversion: string;
  ideologiaPolitica: string;
  temaDigitalRelevante: string;
  ligaFacebook: string;
  ligaInstagram: string;
  ligaTwitter: string;
  ligaTiktok: string;
  ligaSitioWeb: string;
  ligaYoutube: string;
  ligaLinkedin: string;
  
  // Datos demográficos
  poblacionGeneral: string;
  poblacionDigital: string;
  padronElectoral: string;
  
  // Psicográficos
  miedos: string;
  intereses: string;
  enojos: string;
  valores: string;
  envidia: string;
  aspiraciones: string;
  
  // Oportunidad
  frontPresentacion: string;
  motivoEleccion: string;
  tipoPresentacion: string;
  objetivoEstrategiaDigital: string;
  comentariosExtraPresentacion: string;
  
  // Post Venta - Criterios para la presentación
  empresa: string;
  front: string;
  servicioContratado: string;
  servicioProducto: string;
  precio: string;
  nivelRelacionCliente: string;
  extensionProyecto: string;
  presupuestoVenta: string;
  disposicionInvertir: string;
  
  // Post Venta - Información contextual
  anticipacionCuenta: string;
  nombreContacto: string;
  equipoDigitalPrevio: string;
  conocimientoEstrategias: string;
  envioImplante: string;
  sergioJoseEnCampana: string;
  empresaCompetencia: string;
  relacionPrevia: string;
  
  // Post Cierre
  postCierre: Record<string, any>;
}

const ExpedienteElectronicoPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [clientName, setClientName] = useState('');
  const [showAccessDeniedModal, setShowAccessDeniedModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(() => 
    document.body.classList.contains('dark-theme')
  );
  const { logout, user } = useAuthStore();
  
  const [formData, setFormData] = useState<FormData>({
    cliente: '',
    cuentaAnalitica: '',
    fechaCaptura: new Date().toISOString().split('T')[0],
    responsableCaptura: '',
    ultimaActualizacion: new Date().toISOString().split('T')[0],
    gradoConfiabilidad: '',
    nivelConfiabilidadGeneral: '',
    
    // Pre Venta - Generales del cliente
    nombres: '',
    apellidos: '',
    cargoActual: '',
    fechaNacimiento: '',
    lugarNacimiento: '',
    educacion: '',
    objetivoCliente: '',
    trayectoriaPolitica: '',
    contrincantesEmociones: '',
    personajesAversion: '',
    ideologiaPolitica: '',
    temaDigitalRelevante: '',
    ligaFacebook: '',
    ligaInstagram: '',
    ligaTwitter: '',
    ligaTiktok: '',
    ligaSitioWeb: '',
    ligaYoutube: '',
    ligaLinkedin: '',
    
    // Pre Venta - Datos demográficos
    poblacionGeneral: '',
    poblacionDigital: '',
    padronElectoral: '',
    
    // Pre Venta - Psicográficos
    miedos: '',
    intereses: '',
    enojos: '',
    valores: '',
    envidia: '',
    aspiraciones: '',
    
    // Oportunidad
    frontPresentacion: '',
    motivoEleccion: '',
    tipoPresentacion: '',
    objetivoEstrategiaDigital: '',
    comentariosExtraPresentacion: '',
    
    // Post Venta - Criterios para la presentación
    empresa: '',
    front: '',
    servicioContratado: '',
    servicioProducto: '',
    precio: '',
    nivelRelacionCliente: '',
    extensionProyecto: '',
    presupuestoVenta: '',
    disposicionInvertir: '',
    
    // Post Venta - Información contextual
    anticipacionCuenta: '',
    nombreContacto: '',
    equipoDigitalPrevio: '',
    conocimientoEstrategias: '',
    envioImplante: '',
    sergioJoseEnCampana: '',
    empresaCompetencia: '',
    relacionPrevia: '',
    
    // Post Cierre - Información política
    cargoContratacion: '',
    cargoAspiracion: '',
    posicionPolitica: '',
    tipoCandidatura: '',
    nombrePartido: '',
    cambioPolitico: '',
    empresaCompetenciaPostCierre: '',
    
    // Post Cierre - Información sobre personalidad del cliente
    aperturaNegocios: '',
    personalidadPredominante: '',
    motivacionPrincipal: '',
    
    // Post Cierre - Retrospectiva de negocios
    compraPrevia: '',
    montoPagado: '',
    tipoContrato: '',
    tipoCompra: '',
    inversionProyecto: '',
    inversionistaAmigo: '',
    tiempoVenta: '',
    montoContrato: '',
    montoInvertidoCierre: '',
    decisionCompra: '',
    
    // Post Cierre - Customer Success Management
    recomendacion: '',
    recontratacion: '',
    recontratacionEmpresa: '',
    
    // Post Cierre - Información política
    cargoContratacion: '',
    cargoAspiracion: '',
    posicionPolitica: '',
    tipoCandidatura: '',
    nombrePartido: '',
    cambioPolitico: '',
    empresaCompetenciaPostCierre: '',
    
    // Post Cierre - Información sobre personalidad del cliente
    aperturaNegocios: '',
    personalidadPredominante: '',
    motivacionPrincipal: '',
    
    // Post Cierre - Retrospectiva de negocios
    compraPrevia: '',
    montoPagado: '',
    tipoContrato: '',
    tipoCompra: '',
    inversionProyecto: '',
    inversionistaAmigo: '',
    tiempoVenta: '',
    montoContrato: '',
    montoInvertidoCierre: '',
    decisionCompra: ''
  });

  // Calcular el progreso total basado en campos completados
  const calculateProgress = () => {
    const allFields = Object.values(formData).flat();
    const completedFields = allFields.filter(value => value.trim() !== '').length;
    const totalFields = allFields.length;
    return totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;
  };
  
  const progressPercentage = calculateProgress();
  const metaPercentage = 85; // Meta fija del 85%
  const confiabilidad = Math.min(progressPercentage / 10, 10).toFixed(2); // Escala de 0-10

  const steps = [
    {
      id: 'datos-registro',
      title: 'Datos de Registro',
      icon: <FileText size={24} />,
      color: 'text-blue-500'
    },
    {
      id: 'pre-venta',
      title: 'Pre Venta',
      icon: <User size={24} />,
      color: 'text-emerald-500'
    },
    {
      id: 'oportunidad',
      title: 'Oportunidad',
      icon: <TrendingUp size={24} />,
      color: 'text-purple-500'
    },
    {
      id: 'post-venta',
      title: 'Post Venta',
      icon: <ShoppingCart size={24} />,
      color: 'text-orange-500'
    },
    {
      id: 'post-cierre',
      title: 'Post Cierre',
      icon: <Award size={24} />,
      color: 'text-red-500'
    }
  ];
  
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
      setFormData(prev => ({
        ...prev,
        cliente: state.clientName.split(' - ')[0] || ''
      }));
    }
  }, [location]);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  // Verificar permisos al cargar la página
  useEffect(() => {
    if (user && !hasPermission(user, 'edit_expediente')) {
      setShowAccessDeniedModal(true);
    }
  }, [user]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Lista de servicios/productos con precios
  const serviciosProductos = [
    { id: 'sp1', nombre: 'Estrategia Digital Básica', precio: '50000' },
    { id: 'sp2', nombre: 'Estrategia Digital Avanzada', precio: '100000' },
    { id: 'sp3', nombre: 'Gestión de Redes Sociales', precio: '35000' },
    { id: 'sp4', nombre: 'Creación de Contenido', precio: '45000' },
    { id: 'sp5', nombre: 'Análisis de Datos', precio: '60000' },
    { id: 'sp6', nombre: 'Consultoría Política', precio: '80000' },
    { id: 'sp7', nombre: 'Diseño Gráfico', precio: '40000' },
    { id: 'sp8', nombre: 'Producción Audiovisual', precio: '75000' },
    { id: 'sp9', nombre: 'Gestión de Campañas', precio: '90000' },
    { id: 'sp10', nombre: 'Monitoreo de Medios', precio: '30000' },
    { id: 'sp11', nombre: 'Investigación de Mercado', precio: '55000' },
    { id: 'sp12', nombre: 'Desarrollo Web', precio: '65000' },
    { id: 'sp13', nombre: 'SEO y SEM', precio: '40000' },
    { id: 'sp14', nombre: 'Capacitación de Equipos', precio: '25000' },
    { id: 'sp15', nombre: 'Gestión de Crisis', precio: '70000' }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log('Formulario enviado:', formData);
    // Aquí se conectaría con el backend
  };

  const renderDatosRegistro = () => (
    <div className="form-step-content">
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="cliente">Cliente</label>
          <input
            type="text"
            id="cliente"
            value={formData.cliente}
            onChange={(e) => handleInputChange('cliente', e.target.value)}
            className="form-input"
            placeholder="Nombre del cliente"
          />
        </div>

        <div className="form-group">
          <label htmlFor="cuentaAnalitica">Cuenta Analítica</label>
          <input
            type="text"
            id="cuentaAnalitica"
            value={formData.cuentaAnalitica}
            onChange={(e) => handleInputChange('cuentaAnalitica', e.target.value)}
            className="form-input"
            placeholder="Código de cuenta analítica"
          />
        </div>

        <div className="form-group">
          <label htmlFor="fechaCaptura">Fecha de Captura</label>
          <input
            type="date"
            id="fechaCaptura"
            value={formData.fechaCaptura}
            onChange={(e) => handleInputChange('fechaCaptura', e.target.value)}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="responsableCaptura">Responsable de Captura</label>
          <input
            type="text"
            id="responsableCaptura"
            value={formData.responsableCaptura}
            onChange={(e) => handleInputChange('responsableCaptura', e.target.value)}
            className="form-input"
            placeholder="Nombre del responsable"
          />
        </div>

        <div className="form-group">
          <label htmlFor="ultimaActualizacion">Última Actualización</label>
          <input
            type="date"
            id="ultimaActualizacion"
            value={formData.ultimaActualizacion}
            onChange={(e) => handleInputChange('ultimaActualizacion', e.target.value)}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="gradoConfiabilidad">Grado de Confiabilidad de la Información</label>
          <select
            id="gradoConfiabilidad"
            value={formData.gradoConfiabilidad}
            onChange={(e) => handleInputChange('gradoConfiabilidad', e.target.value as FormData['gradoConfiabilidad'])}
            className="form-input"
            style={{ backgroundPosition: 'right 0.75rem center', backgroundSize: '16px', backgroundRepeat: 'no-repeat' }}
          >
            <option value="">Seleccionar nivel</option>
            <option value="nivel1">Nivel 1</option>
            <option value="nivel2">Nivel 2</option>
            <option value="nivel3">Nivel 3</option>
            <option value="nivel4">Nivel 4</option>
          </select>
        </div>

        <div className="form-group form-group-full">
          <label htmlFor="nivelConfiabilidadGeneral">Nivel de Confiabilidad (General)</label>
          <textarea
            id="nivelConfiabilidadGeneral"
            value={formData.nivelConfiabilidadGeneral}
            onChange={(e) => handleInputChange('nivelConfiabilidadGeneral', e.target.value)}
            className="form-input form-textarea"
            placeholder="Descripción general del nivel de confiabilidad"
            rows={4}
          />
        </div>
      </div>
    </div>
  );

  const renderPreVentaGenerales = () => (
    <div className="form-step-content">
      <h3 className="form-section-title">Generales del cliente</h3>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="nombres">Nombre(s)</label>
          <input
            type="text"
            id="nombres"
            value={formData.nombres}
            onChange={(e) => handleInputChange('nombres', e.target.value)}
            className="form-input"
            placeholder="Nombre(s) del cliente"
          />
        </div>

        <div className="form-group">
          <label htmlFor="apellidos">Apellido(s)</label>
          <input
            type="text"
            id="apellidos"
            value={formData.apellidos}
            onChange={(e) => handleInputChange('apellidos', e.target.value)}
            className="form-input"
            placeholder="Apellido(s) del cliente"
          />
        </div>

        <div className="form-group">
          <label htmlFor="cargoActual">Cargo actual</label>
          <input
            type="text"
            id="cargoActual"
            value={formData.cargoActual}
            onChange={(e) => handleInputChange('cargoActual', e.target.value)}
            className="form-input"
            placeholder="Cargo actual del cliente"
          />
        </div>

        <div className="form-group">
          <label htmlFor="fechaNacimiento">Fecha de nacimiento</label>
          <input
            type="date"
            id="fechaNacimiento"
            value={formData.fechaNacimiento}
            onChange={(e) => handleInputChange('fechaNacimiento', e.target.value)}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="lugarNacimiento">Lugar de nacimiento</label>
          <input
            type="text"
            id="lugarNacimiento"
            value={formData.lugarNacimiento}
            onChange={(e) => handleInputChange('lugarNacimiento', e.target.value)}
            className="form-input"
            placeholder="Ciudad, Estado, País"
          />
        </div>

        <div className="form-group form-group-full">
          <label htmlFor="educacion">Educación (breve)</label>
          <textarea
            id="educacion"
            value={formData.educacion}
            onChange={(e) => handleInputChange('educacion', e.target.value)}
            className="form-input form-textarea"
            placeholder="Resumen de formación educativa"
            rows={3}
          />
        </div>

        <div className="form-group form-group-full">
          <label htmlFor="objetivoCliente">Objetivo del cliente</label>
          <textarea
            id="objetivoCliente"
            value={formData.objetivoCliente}
            onChange={(e) => handleInputChange('objetivoCliente', e.target.value)}
            className="form-input form-textarea"
            placeholder="Objetivo principal del cliente"
            rows={3}
          />
        </div>

        <div className="form-group form-group-full">
          <label htmlFor="trayectoriaPolitica">Trayectoria política</label>
          <textarea
            id="trayectoriaPolitica"
            value={formData.trayectoriaPolitica}
            onChange={(e) => handleInputChange('trayectoriaPolitica', e.target.value)}
            className="form-input form-textarea"
            placeholder="Resumen de trayectoria política"
            rows={3}
          />
        </div>

        <div className="form-group form-group-full">
          <label htmlFor="contrincantesEmociones">Contrincantes que generan emociones negativas (máx. 3)</label>
          <textarea
            id="contrincantesEmociones"
            value={formData.contrincantesEmociones}
            onChange={(e) => handleInputChange('contrincantesEmociones', e.target.value)}
            className="form-input form-textarea"
            placeholder="Nombre de contrincantes (máximo 3)"
            rows={3}
          />
        </div>

        <div className="form-group form-group-full">
          <label htmlFor="personajesAversion">Personajes o instituciones que generan aversión (máx. 3)</label>
          <textarea
            id="personajesAversion"
            value={formData.personajesAversion}
            onChange={(e) => handleInputChange('personajesAversion', e.target.value)}
            className="form-input form-textarea"
            placeholder="Personajes o instituciones (máximo 3)"
            rows={3}
          />
        </div>

        <div className="form-group">
          <label htmlFor="ideologiaPolitica">Ideología política</label>
          <input
            type="text"
            id="ideologiaPolitica"
            value={formData.ideologiaPolitica}
            onChange={(e) => handleInputChange('ideologiaPolitica', e.target.value)}
            className="form-input"
            placeholder="Ideología política del cliente"
          />
        </div>

        <div className="form-group form-group-full">
          <label htmlFor="temaDigitalRelevante">Tema en medios digitales relevante a considerar o resaltar</label>
          <textarea
            id="temaDigitalRelevante"
            value={formData.temaDigitalRelevante}
            onChange={(e) => handleInputChange('temaDigitalRelevante', e.target.value)}
            className="form-input form-textarea"
            placeholder="Tema relevante en medios digitales"
            rows={3}
          />
        </div>

        <div className="form-group">
          <label htmlFor="ligaFacebook">Liga de Facebook</label>
          <input
            type="url"
            id="ligaFacebook"
            value={formData.ligaFacebook}
            onChange={(e) => handleInputChange('ligaFacebook', e.target.value)}
            className="form-input"
            placeholder="https://facebook.com/usuario"
          />
        </div>

        <div className="form-group">
          <label htmlFor="ligaInstagram">Liga de Instagram</label>
          <input
            type="url"
            id="ligaInstagram"
            value={formData.ligaInstagram}
            onChange={(e) => handleInputChange('ligaInstagram', e.target.value)}
            className="form-input"
            placeholder="https://instagram.com/usuario"
          />
        </div>

        <div className="form-group">
          <label htmlFor="ligaTwitter">Liga de Twitter</label>
          <input
            type="url"
            id="ligaTwitter"
            value={formData.ligaTwitter}
            onChange={(e) => handleInputChange('ligaTwitter', e.target.value)}
            className="form-input"
            placeholder="https://twitter.com/usuario"
          />
        </div>

        <div className="form-group">
          <label htmlFor="ligaTiktok">Liga de TikTok</label>
          <input
            type="url"
            id="ligaTiktok"
            value={formData.ligaTiktok}
            onChange={(e) => handleInputChange('ligaTiktok', e.target.value)}
            className="form-input"
            placeholder="https://tiktok.com/@usuario"
          />
        </div>

        <div className="form-group">
          <label htmlFor="ligaSitioWeb">Liga de Sitio Web</label>
          <input
            type="url"
            id="ligaSitioWeb"
            value={formData.ligaSitioWeb}
            onChange={(e) => handleInputChange('ligaSitioWeb', e.target.value)}
            className="form-input"
            placeholder="https://ejemplo.com"
          />
        </div>

        <div className="form-group">
          <label htmlFor="ligaYoutube">Liga de YouTube</label>
          <input
            type="url"
            id="ligaYoutube"
            value={formData.ligaYoutube}
            onChange={(e) => handleInputChange('ligaYoutube', e.target.value)}
            className="form-input"
            placeholder="https://youtube.com/channel/ID"
          />
        </div>

        <div className="form-group">
          <label htmlFor="ligaLinkedin">Liga de LinkedIn</label>
          <input
            type="url"
            id="ligaLinkedin"
            value={formData.ligaLinkedin}
            onChange={(e) => handleInputChange('ligaLinkedin', e.target.value)}
            className="form-input"
            placeholder="https://linkedin.com/in/usuario"
          />
        </div>
      </div>

      <h3 className="form-section-title">Datos demográficos</h3>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="poblacionGeneral">Población general</label>
          <input
            type="text"
            id="poblacionGeneral"
            value={formData.poblacionGeneral}
            onChange={(e) => handleInputChange('poblacionGeneral', e.target.value)}
            className="form-input"
            placeholder="Número de habitantes"
          />
        </div>

        <div className="form-group">
          <label htmlFor="poblacionDigital">Población digital</label>
          <input
            type="text"
            id="poblacionDigital"
            value={formData.poblacionDigital}
            onChange={(e) => handleInputChange('poblacionDigital', e.target.value)}
            className="form-input"
            placeholder="Número de usuarios digitales"
          />
        </div>

        <div className="form-group">
          <label htmlFor="padronElectoral">Padrón electoral</label>
          <input
            type="text"
            id="padronElectoral"
            value={formData.padronElectoral}
            onChange={(e) => handleInputChange('padronElectoral', e.target.value)}
            className="form-input"
            placeholder="Número de electores registrados"
          />
        </div>
      </div>

      <h3 className="form-section-title">Psicográficos</h3>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="miedos">¿Cuáles son sus miedos?</label>
          <textarea
            id="miedos"
            value={formData.miedos}
            onChange={(e) => handleInputChange('miedos', e.target.value)}
            className="form-input form-textarea"
            placeholder="Describa los miedos del cliente"
            rows={3}
          />
        </div>

        <div className="form-group">
          <label htmlFor="intereses">¿Cuáles son sus intereses?</label>
          <textarea
            id="intereses"
            value={formData.intereses}
            onChange={(e) => handleInputChange('intereses', e.target.value)}
            className="form-input form-textarea"
            placeholder="Describa los intereses del cliente"
            rows={3}
          />
        </div>

        <div className="form-group">
          <label htmlFor="enojos">¿Qué le enoja?</label>
          <textarea
            id="enojos"
            value={formData.enojos}
            onChange={(e) => handleInputChange('enojos', e.target.value)}
            className="form-input form-textarea"
            placeholder="Describa lo que enoja al cliente"
            rows={3}
          />
        </div>

        <div className="form-group">
          <label htmlFor="valores">¿Cuáles son los valores que rigen al cliente?</label>
          <textarea
            id="valores"
            value={formData.valores}
            onChange={(e) => handleInputChange('valores', e.target.value)}
            className="form-input form-textarea"
            placeholder="Describa los valores del cliente"
            rows={3}
          />
        </div>

        <div className="form-group">
          <label htmlFor="envidia">¿Quién genera envidia?</label>
          <textarea
            id="envidia"
            value={formData.envidia}
            onChange={(e) => handleInputChange('envidia', e.target.value)}
            className="form-input form-textarea"
            placeholder="Describa quién genera envidia al cliente"
            rows={3}
          />
        </div>

        <div className="form-group">
          <label htmlFor="aspiraciones">¿Cuáles son sus aspiraciones?</label>
          <textarea
            id="aspiraciones"
            value={formData.aspiraciones}
            onChange={(e) => handleInputChange('aspiraciones', e.target.value)}
            className="form-input form-textarea"
            placeholder="Describa las aspiraciones del cliente"
            rows={3}
          />
        </div>
      </div>
    </div>
  );

  const renderOportunidad = () => (
    <div className="form-step-content">
      <div className="form-grid">
        <div className="form-group form-group-full">
          <label htmlFor="frontPresentacion">Front para la presentación</label>
          <textarea
            id="frontPresentacion"
            value={formData.frontPresentacion}
            onChange={(e) => handleInputChange('frontPresentacion', e.target.value)}
            className="form-input form-textarea"
            placeholder="Descripción del front para la presentación"
            rows={4}
          />
        </div>

        <div className="form-group form-group-full">
          <label htmlFor="motivoEleccion">Motivo de elección</label>
          <textarea
            id="motivoEleccion"
            value={formData.motivoEleccion}
            onChange={(e) => handleInputChange('motivoEleccion', e.target.value)}
            className="form-input form-textarea"
            placeholder="Motivo por el cual se eligió esta estrategia"
            rows={4}
          />
        </div>

        <div className="form-group">
          <label htmlFor="tipoPresentacion">Tipo de presentación</label>
          <select
            id="tipoPresentacion"
            value={formData.tipoPresentacion}
            onChange={(e) => handleInputChange('tipoPresentacion', e.target.value)}
            className="form-input"
            style={{ backgroundPosition: 'right 0.75rem center', backgroundSize: '16px', backgroundRepeat: 'no-repeat' }}
          >
            <option value="">Seleccionar tipo</option>
            <option value="presencial">Presencial</option>
            <option value="virtual">Virtual</option>
            <option value="hibrida">Híbrida</option>
            <option value="documento">Documento</option>
          </select>
        </div>

        <div className="form-group form-group-full">
          <label htmlFor="objetivoEstrategiaDigital">Objetivo de la estrategia digital</label>
          <textarea
            id="objetivoEstrategiaDigital"
            value={formData.objetivoEstrategiaDigital}
            onChange={(e) => handleInputChange('objetivoEstrategiaDigital', e.target.value)}
            className="form-input form-textarea"
            placeholder="Descripción del objetivo de la estrategia digital"
            rows={4}
          />
        </div>

        <div className="form-group form-group-full">
          <label htmlFor="comentariosExtraPresentacion">Comentarios extra para la presentación</label>
          <textarea
            id="comentariosExtraPresentacion"
            value={formData.comentariosExtraPresentacion}
            onChange={(e) => handleInputChange('comentariosExtraPresentacion', e.target.value)}
            className="form-input form-textarea"
            placeholder="Comentarios adicionales para la presentación"
            rows={4}
          />
        </div>
      </div>
    </div>
  );

  const renderPostVenta = () => (
    <div className="form-step-content">
      <h3 className="form-section-title">Criterios para la presentación y propuesta de colaboración</h3>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="empresa">Empresa</label>
          <input
            type="text"
            id="empresa"
            value={formData.empresa}
            onChange={(e) => handleInputChange('empresa', e.target.value)}
            className="form-input"
            placeholder="Nombre de la empresa"
          />
        </div>

        <div className="form-group">
          <label htmlFor="front">Front</label>
          <input
            type="text"
            id="front"
            value={formData.front}
            onChange={(e) => handleInputChange('front', e.target.value)}
            className="form-input"
            placeholder="Front para la presentación"
          />
        </div>

        <div className="form-group">
          <label htmlFor="servicioContratado">Servicio contratado</label>
          <input
            type="text"
            id="servicioContratado"
            value={formData.servicioContratado}
            onChange={(e) => handleInputChange('servicioContratado', e.target.value)}
            className="form-input"
            placeholder="Servicio principal contratado"
          />
        </div>

        <div className="form-group form-group-full">
          <label htmlFor="servicioProducto">Desglose de servicios o productos</label>
          <select
            id="servicioProducto"
            value={formData.servicioProducto}
            onChange={(e) => {
              handleInputChange('servicioProducto', e.target.value);
              // Encontrar el precio correspondiente al servicio seleccionado
              const servicio = serviciosProductos.find(sp => sp.id === e.target.value);
              if (servicio) {
                handleInputChange('precio', servicio.precio);
              }
            }}
            className="form-input"
            style={{ backgroundPosition: 'right 0.75rem center', backgroundSize: '16px', backgroundRepeat: 'no-repeat' }}
          >
            <option value="">Seleccionar servicio/producto</option>
            {serviciosProductos.map(sp => (
              <option key={sp.id} value={sp.id}>
                {sp.nombre} - ${parseInt(sp.precio).toLocaleString('es-MX')}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="precio">Precio</label>
          <div style={{ position: 'relative' }}>
            <span style={{ 
              position: 'absolute', 
              left: '1rem', 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : '#718096'
            }}>$</span>
            <input
              type="text"
              id="precio"
              value={formData.precio}
              onChange={(e) => handleInputChange('precio', e.target.value)}
              className="form-input"
              placeholder="Precio del servicio"
              style={{ paddingLeft: '2rem' }}
              readOnly
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="nivelRelacionCliente">Nivel de relación con el cliente</label>
          <select
            id="nivelRelacionCliente"
            value={formData.nivelRelacionCliente}
            onChange={(e) => handleInputChange('nivelRelacionCliente', e.target.value)}
            className="form-input"
            style={{ backgroundPosition: 'right 0.75rem center', backgroundSize: '16px', backgroundRepeat: 'no-repeat' }}
          >
            <option value="">Seleccionar nivel</option>
            <option value="bajo">Bajo</option>
            <option value="medio">Medio</option>
            <option value="alto">Alto</option>
            <option value="muy_alto">Muy Alto</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="extensionProyecto">Extensión del proyecto (Tiempo)</label>
          <input
            type="text"
            id="extensionProyecto"
            value={formData.extensionProyecto}
            onChange={(e) => handleInputChange('extensionProyecto', e.target.value)}
            className="form-input"
            placeholder="Duración del proyecto"
          />
        </div>

        <div className="form-group">
          <label htmlFor="presupuestoVenta">Presupuesto de venta (proyección)</label>
          <div style={{ position: 'relative' }}>
            <span style={{ 
              position: 'absolute', 
              left: '1rem', 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : '#718096'
            }}>$</span>
            <input
              type="text"
              id="presupuestoVenta"
              value={formData.presupuestoVenta}
              onChange={(e) => handleInputChange('presupuestoVenta', e.target.value)}
              className="form-input"
              placeholder="Presupuesto proyectado"
              style={{ paddingLeft: '2rem' }}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="disposicionInvertir">¿Hay disposición a invertir?</label>
          <select
            id="disposicionInvertir"
            value={formData.disposicionInvertir}
            onChange={(e) => handleInputChange('disposicionInvertir', e.target.value)}
            className="form-input"
            style={{ backgroundPosition: 'right 0.75rem center', backgroundSize: '16px', backgroundRepeat: 'no-repeat' }}
          >
            <option value="">Seleccionar</option>
            <option value="si">Sí</option>
            <option value="no">No</option>
            <option value="tal_vez">Tal vez</option>
          </select>
        </div>
      </div>

      <h3 className="form-section-title">Información contextual</h3>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="anticipacionCuenta">¿Con cuánta anticipación se entró a la cuenta?</label>
          <input
            type="text"
            id="anticipacionCuenta"
            value={formData.anticipacionCuenta}
            onChange={(e) => handleInputChange('anticipacionCuenta', e.target.value)}
            className="form-input"
            placeholder="Tiempo de anticipación"
          />
        </div>

        <div className="form-group">
          <label htmlFor="nombreContacto">Nombre del contacto o persona que enlazó</label>
          <input
            type="text"
            id="nombreContacto"
            value={formData.nombreContacto}
            onChange={(e) => handleInputChange('nombreContacto', e.target.value)}
            className="form-input"
            placeholder="Nombre del contacto"
          />
        </div>

        <div className="form-group">
          <label htmlFor="equipoDigitalPrevio">¿El cliente tenía equipo digital cuando nos contrató?</label>
          <select
            id="equipoDigitalPrevio"
            value={formData.equipoDigitalPrevio}
            onChange={(e) => handleInputChange('equipoDigitalPrevio', e.target.value)}
            className="form-input"
            style={{ backgroundPosition: 'right 0.75rem center', backgroundSize: '16px', backgroundRepeat: 'no-repeat' }}
          >
            <option value="">Seleccionar</option>
            <option value="si">Sí</option>
            <option value="no">No</option>
            <option value="parcial">Parcialmente</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="conocimientoEstrategias">¿El cliente sabía los premios o estrategias de marketing?</label>
          <select
            id="conocimientoEstrategias"
            value={formData.conocimientoEstrategias}
            onChange={(e) => handleInputChange('conocimientoEstrategias', e.target.value)}
            className="form-input"
            style={{ backgroundPosition: 'right 0.75rem center', backgroundSize: '16px', backgroundRepeat: 'no-repeat' }}
          >
            <option value="">Seleccionar</option>
            <option value="si">Sí</option>
            <option value="no">No</option>
            <option value="parcial">Parcialmente</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="envioImplante">¿Se envió implante?</label>
          <select
            id="envioImplante"
            value={formData.envioImplante}
            onChange={(e) => handleInputChange('envioImplante', e.target.value)}
            className="form-input"
            style={{ backgroundPosition: 'right 0.75rem center', backgroundSize: '16px', backgroundRepeat: 'no-repeat' }}
          >
            <option value="">Seleccionar</option>
            <option value="si">Sí</option>
            <option value="no">No</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="sergioJoseEnCampana">¿Sergio José estuvo en la campaña?</label>
          <select
            id="sergioJoseEnCampana"
            value={formData.sergioJoseEnCampana}
            onChange={(e) => handleInputChange('sergioJoseEnCampana', e.target.value)}
            className="form-input"
            style={{ backgroundPosition: 'right 0.75rem center', backgroundSize: '16px', backgroundRepeat: 'no-repeat' }}
          >
            <option value="">Seleccionar</option>
            <option value="si">Sí</option>
            <option value="no">No</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="empresaCompetencia">¿Había alguna empresa competencia con el cliente?</label>
          <input
            type="text"
            id="empresaCompetencia"
            value={formData.empresaCompetencia}
            onChange={(e) => handleInputChange('empresaCompetencia', e.target.value)}
            className="form-input"
            placeholder="Nombre de la empresa competencia"
          />
        </div>

        <div className="form-group">
          <label htmlFor="relacionPrevia">¿Alguno de nuestros esporas tenía una relación previa?</label>
          <input
            type="text"
            id="relacionPrevia"
            value={formData.relacionPrevia}
            onChange={(e) => handleInputChange('relacionPrevia', e.target.value)}
            className="form-input"
            placeholder="Detalles de la relación previa"
          />
        </div>
      </div>
    </div>
  );

  const renderPostCierre = () => (
    <div className="form-step-content">
      <h3 className="form-section-title">Información política</h3>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="cargoContratacion">¿Qué cargo tenía cuando nos contrató?</label>
          <input
            type="text"
            id="cargoContratacion"
            value={formData.cargoContratacion}
            onChange={(e) => handleInputChange('cargoContratacion', e.target.value)}
            className="form-input"
            placeholder="Cargo al momento de contratación"
          />
        </div>

        <div className="form-group">
          <label htmlFor="cargoAspiracion">¿A qué cargo aspiraba?</label>
          <input
            type="text"
            id="cargoAspiracion"
            value={formData.cargoAspiracion}
            onChange={(e) => handleInputChange('cargoAspiracion', e.target.value)}
            className="form-input"
            placeholder="Cargo al que aspiraba"
          />
        </div>

        <div className="form-group">
          <label htmlFor="posicionPolitica">¿Qué posición política tenía?</label>
          <select
            id="posicionPolitica"
            value={formData.posicionPolitica}
            onChange={(e) => handleInputChange('posicionPolitica', e.target.value)}
            className="form-input"
            style={{ backgroundPosition: 'right 0.75rem center', backgroundSize: '16px', backgroundRepeat: 'no-repeat' }}
          >
            <option value="">Seleccionar</option>
            <option value="izquierda">Izquierda</option>
            <option value="centro_izquierda">Centro-Izquierda</option>
            <option value="centro">Centro</option>
            <option value="centro_derecha">Centro-Derecha</option>
            <option value="derecha">Derecha</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="tipoCandidatura">¿Qué tipo de candidatura es?</label>
          <select
            id="tipoCandidatura"
            value={formData.tipoCandidatura}
            onChange={(e) => handleInputChange('tipoCandidatura', e.target.value)}
            className="form-input"
            style={{ backgroundPosition: 'right 0.75rem center', backgroundSize: '16px', backgroundRepeat: 'no-repeat' }}
          >
            <option value="">Seleccionar</option>
            <option value="federal">Federal</option>
            <option value="estatal">Estatal</option>
            <option value="municipal">Municipal</option>
            <option value="local">Local</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="nombrePartido">¿Cuál es el nombre del partido en el que compitió?</label>
          <input
            type="text"
            id="nombrePartido"
            value={formData.nombrePartido}
            onChange={(e) => handleInputChange('nombrePartido', e.target.value)}
            className="form-input"
            placeholder="Nombre del partido político"
          />
        </div>

        <div className="form-group">
          <label htmlFor="cambioPolitico">¿Cambió de partido?</label>
          <select
            id="cambioPolitico"
            value={formData.cambioPolitico}
            onChange={(e) => handleInputChange('cambioPolitico', e.target.value)}
            className="form-input"
            style={{ backgroundPosition: 'right 0.75rem center', backgroundSize: '16px', backgroundRepeat: 'no-repeat' }}
          >
            <option value="">Seleccionar</option>
            <option value="si">Sí</option>
            <option value="no">No</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="empresaCompetenciaPostCierre">¿Había alguna empresa competencia con el cliente?</label>
          <input
            type="text"
            id="empresaCompetenciaPostCierre"
            value={formData.empresaCompetenciaPostCierre}
            onChange={(e) => handleInputChange('empresaCompetenciaPostCierre', e.target.value)}
            className="form-input"
            placeholder="Nombre de la empresa competencia"
          />
        </div>
      </div>

      <h3 className="form-section-title">Información sobre personalidad del cliente</h3>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="aperturaNegocios">¿Qué tan abierto a hacer negocios es?</label>
          <select
            id="aperturaNegocios"
            value={formData.aperturaNegocios}
            onChange={(e) => handleInputChange('aperturaNegocios', e.target.value)}
            className="form-input"
            style={{ backgroundPosition: 'right 0.75rem center', backgroundSize: '16px', backgroundRepeat: 'no-repeat' }}
          >
            <option value="">Seleccionar</option>
            <option value="muy_abierto">Muy abierto</option>
            <option value="abierto">Abierto</option>
            <option value="neutral">Neutral</option>
            <option value="cerrado">Cerrado</option>
            <option value="muy_cerrado">Muy cerrado</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="personalidadPredominante">¿Qué personalidad predomina?</label>
          <select
            id="personalidadPredominante"
            value={formData.personalidadPredominante}
            onChange={(e) => handleInputChange('personalidadPredominante', e.target.value)}
            className="form-input"
            style={{ backgroundPosition: 'right 0.75rem center', backgroundSize: '16px', backgroundRepeat: 'no-repeat' }}
          >
            <option value="">Seleccionar</option>
            <option value="analitico">Analítico</option>
            <option value="expresivo">Expresivo</option>
            <option value="afable">Afable</option>
            <option value="conductor">Conductor</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="motivacionPrincipal">¿Qué le mueve más?</label>
          <select
            id="motivacionPrincipal"
            value={formData.motivacionPrincipal}
            onChange={(e) => handleInputChange('motivacionPrincipal', e.target.value)}
            className="form-input"
            style={{ backgroundPosition: 'right 0.75rem center', backgroundSize: '16px', backgroundRepeat: 'no-repeat' }}
          >
            <option value="">Seleccionar</option>
            <option value="logro">Logro</option>
            <option value="poder">Poder</option>
            <option value="afiliacion">Afiliación</option>
            <option value="reconocimiento">Reconocimiento</option>
            <option value="seguridad">Seguridad</option>
          </select>
        </div>
      </div>

      <h3 className="form-section-title">Retrospectiva de negocios</h3>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="compraPrevia">¿Nos ha comprado previamente?</label>
          <select
            id="compraPrevia"
            value={formData.compraPrevia}
            onChange={(e) => handleInputChange('compraPrevia', e.target.value)}
            className="form-input"
            style={{ backgroundPosition: 'right 0.75rem center', backgroundSize: '16px', backgroundRepeat: 'no-repeat' }}
          >
            <option value="">Seleccionar</option>
            <option value="si">Sí</option>
            <option value="no">No</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="montoPagado">Totalidad del monto comprado y pagado</label>
          <div style={{ position: 'relative' }}>
            <span style={{ 
              position: 'absolute', 
              left: '1rem', 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : '#718096'
            }}>$</span>
            <input
              type="text"
              id="montoPagado"
              value={formData.montoPagado}
              onChange={(e) => handleInputChange('montoPagado', e.target.value)}
              className="form-input"
              placeholder="Monto total pagado"
              style={{ paddingLeft: '2rem' }}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="tipoContrato">¿Qué tipo de contrato firmó?</label>
          <select
            id="tipoContrato"
            value={formData.tipoContrato}
            onChange={(e) => handleInputChange('tipoContrato', e.target.value)}
            className="form-input"
            style={{ backgroundPosition: 'right 0.75rem center', backgroundSize: '16px', backgroundRepeat: 'no-repeat' }}
          >
            <option value="">Seleccionar</option>
            <option value="servicios">Servicios</option>
            <option value="obra">Obra</option>
            <option value="consultoria">Consultoría</option>
            <option value="prestacion_servicios">Prestación de servicios</option>
            <option value="otro">Otro</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="tipoCompra">Tipo de compra que realizó</label>
          <select
            id="tipoCompra"
            value={formData.tipoCompra}
            onChange={(e) => handleInputChange('tipoCompra', e.target.value)}
            className="form-input"
            style={{ backgroundPosition: 'right 0.75rem center', backgroundSize: '16px', backgroundRepeat: 'no-repeat' }}
          >
            <option value="">Seleccionar</option>
            <option value="directa">Directa</option>
            <option value="licitacion">Licitación</option>
            <option value="invitacion">Invitación</option>
            <option value="adjudicacion">Adjudicación directa</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="inversionProyecto">¿Se invirtió en ese proyecto?</label>
          <select
            id="inversionProyecto"
            value={formData.inversionProyecto}
            onChange={(e) => handleInputChange('inversionProyecto', e.target.value)}
            className="form-input"
            style={{ backgroundPosition: 'right 0.75rem center', backgroundSize: '16px', backgroundRepeat: 'no-repeat' }}
          >
            <option value="">Seleccionar</option>
            <option value="si">Sí</option>
            <option value="no">No</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="inversionistaAmigo">¿El inversionista es amigo de la empresa?</label>
          <select
            id="inversionistaAmigo"
            value={formData.inversionistaAmigo}
            onChange={(e) => handleInputChange('inversionistaAmigo', e.target.value)}
            className="form-input"
            style={{ backgroundPosition: 'right 0.75rem center', backgroundSize: '16px', backgroundRepeat: 'no-repeat' }}
          >
            <option value="">Seleccionar</option>
            <option value="si">Sí</option>
            <option value="no">No</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="tiempoVenta">¿Cuánto tiempo tomó la venta?</label>
          <input
            type="text"
            id="tiempoVenta"
            value={formData.tiempoVenta}
            onChange={(e) => handleInputChange('tiempoVenta', e.target.value)}
            className="form-input"
            placeholder="Tiempo en días/semanas/meses"
          />
        </div>

        <div className="form-group">
          <label htmlFor="montoContrato">Monto total establecido en el contrato</label>
          <div style={{ position: 'relative' }}>
            <span style={{ 
              position: 'absolute', 
              left: '1rem', 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : '#718096'
            }}>$</span>
            <input
              type="text"
              id="montoContrato"
              value={formData.montoContrato}
              onChange={(e) => handleInputChange('montoContrato', e.target.value)}
              className="form-input"
              placeholder="Monto total del contrato"
              style={{ paddingLeft: '2rem' }}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="montoInvertidoCierre">Monto total invertido para el cierre de venta</label>
          <div style={{ position: 'relative' }}>
            <span style={{ 
              position: 'absolute', 
              left: '1rem', 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : '#718096'
            }}>$</span>
            <input
              type="text"
              id="montoInvertidoCierre"
              value={formData.montoInvertidoCierre}
              onChange={(e) => handleInputChange('montoInvertidoCierre', e.target.value)}
              className="form-input"
              placeholder="Monto invertido para cierre"
              style={{ paddingLeft: '2rem' }}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="decisionCompra">¿Quién decidió la compra?</label>
          <input
            type="text"
            id="decisionCompra"
            value={formData.decisionCompra}
            onChange={(e) => handleInputChange('decisionCompra', e.target.value)}
            className="form-input"
            placeholder="Persona o cargo que decidió"
          />
        </div>
      </div>

      <h3 className="form-section-title">Customer Success Management</h3>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="recomendacion">¿Nos recomendó al concluir el servicio con otro cliente?</label>
          <select
            id="recomendacion"
            value={formData.recomendacion}
            onChange={(e) => handleInputChange('recomendacion', e.target.value)}
            className="form-input"
            style={{ backgroundPosition: 'right 0.75rem center', backgroundSize: '16px', backgroundRepeat: 'no-repeat' }}
          >
            <option value="">Seleccionar</option>
            <option value="si">Sí</option>
            <option value="no">No</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="recontratacion">¿Nos volvió a contratar al terminar la primera venta?</label>
          <select
            id="recontratacion"
            value={formData.recontratacion}
            onChange={(e) => handleInputChange('recontratacion', e.target.value)}
            className="form-input"
            style={{ backgroundPosition: 'right 0.75rem center', backgroundSize: '16px', backgroundRepeat: 'no-repeat' }}
          >
            <option value="">Seleccionar</option>
            <option value="si">Sí</option>
            <option value="no">No</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="recontratacionEmpresa">¿Volvió a contratar el servicio de la empresa?</label>
          <select
            id="recontratacionEmpresa"
            value={formData.recontratacionEmpresa}
            onChange={(e) => handleInputChange('recontratacionEmpresa', e.target.value)}
            className="form-input"
            style={{ backgroundPosition: 'right 0.75rem center', backgroundSize: '16px', backgroundRepeat: 'no-repeat' }}
          >
            <option value="">Seleccionar</option>
            <option value="si">Sí</option>
            <option value="no">No</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderDatosRegistro();
      case 1:
        return renderPreVentaGenerales();
      case 2:
        return renderOportunidad();
      case 3:
        return renderPostVenta();
      case 4:
        return renderPostCierre();
      default:
        return renderDatosRegistro();
    }
  };

  return (
    <div className={`expediente-page ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      <MenuBackground />
      <div className="expediente-header">
        <div className="expediente-breadcrumb-container">
          <span className="expediente-breadcrumb-separator">/</span>
          <button 
            onClick={() => navigate('/dashboard')}
            className="expediente-breadcrumb-link"
          >
            Menú
          </button>
          <span className="expediente-breadcrumb-separator">/</span>
          <button 
            onClick={() => navigate('/overview-main')}
            className="expediente-breadcrumb-link"
          >
            Overview de cuentas
          </button>
          <span className="expediente-breadcrumb-separator">/</span>
          <button 
            onClick={() => navigate('/overview')}
            className="expediente-breadcrumb-link"
          >
            Configuración de cuentas
          </button>
          <span className="expediente-breadcrumb-separator">/</span>
          <button 
            onClick={() => navigate('/select-account')}
            className="expediente-breadcrumb-link"
          >
            Seleccionar cuenta
          </button>
          <span className="expediente-breadcrumb-separator">/</span>
          <button 
            onClick={() => navigate('/client-dashboard', { state: { clientName } })}
            className="expediente-breadcrumb-link"
          >
            {clientName ? clientName.split(' - ')[0] : 'Cliente'}
          </button>
        </div>
        
        <h1 className="expediente-title">
          Expediente electrónico: {clientName ? clientName.split(' - ')[0] : 'Cliente'}
        </h1>
        
        <div className="header-right">
          <Logo />
        </div>
      </div>

      <div className={`expediente-content ${isVisible ? 'visible' : ''}`}>
        {/* Barra de progreso */}
        <div className="progress-summary-bar">
          <div className="progress-summary-content">
            <div className="funnel-status">
              <div className="status-label">Llenado</div>
              <div className="status-indicator"></div>
            </div>
            
            <div className="progress-metric">
              <div className="metric-label">funnel st.</div>
              <div className="metric-value">-</div>
            </div>
            
            <div className="progress-metric">
              <div className="metric-label">meta</div>
              <div className="metric-value">{metaPercentage}.00%</div>
            </div>
            
            <div className="progress-metric">
              <div className="metric-label">avance</div>
              <div className="metric-value progress-highlight">{progressPercentage}.00%</div>
            </div>
            
            <div className="progress-metric">
              <div className="metric-label">nvl de confiabilidad</div>
              <div className="metric-value">{confiabilidad}</div>
            </div>
          </div>
        </div>

        {/* Stepper Navigation */}
        <div className="stepper-container">
          <div className="stepper">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`step ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
                onClick={() => setCurrentStep(index)}
              >
                <div className="step-icon">
                  {index < currentStep ? <Check size={20} /> : step.icon}
                </div>
                <div className="step-content">
                  <div className="step-title">{step.title}</div>
                  <div className="step-number">Paso {index + 1}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="form-container">
          <div className="form-header">
            <h2>{steps[currentStep].title}</h2>
            <div className="step-indicator">
              {currentStep + 1} de {steps.length}
            </div>
          </div>

          {renderCurrentStep()}

          {/* Navigation Buttons */}
          <div className="form-navigation">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="nav-button prev-button"
            >
              <ChevronLeft size={20} />
              Anterior
            </button>

            {currentStep === steps.length - 1 ? (
              <button
                type="button"
                onClick={handleSubmit}
                className="nav-button submit-button"
              >
                <Check size={20} />
                Finalizar
              </button>
            ) : (
              <button
                type="button"
                onClick={nextStep}
                className="nav-button next-button"
              >
                Siguiente
                <ChevronRight size={20} />
              </button>
            )}
          </div>
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
      
      <AccessDeniedModal
        isOpen={showAccessDeniedModal}
        onClose={() => {
          setShowAccessDeniedModal(false);
          navigate('/client-dashboard', { state: { clientName } });
        }}
        featureName="Expediente Electrónico"
      />
    </div>
  );
};

export default ExpedienteElectronicoPage;