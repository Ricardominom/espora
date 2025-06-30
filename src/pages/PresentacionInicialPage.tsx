import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Upload, FileText, Download, Trash2, Eye, Edit2 } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { hasPermission } from '../data/users';
import Logo from '../components/Logo';
import LogoutDialog from '../components/LogoutDialog';
import AccessDeniedModal from '../components/AccessDeniedModal';
import MenuBackground from '../components/MenuBackground';
import '../styles/presentacion-inicial.css';

interface PdfFile {
  id: string;
  name: string;
  size: number;
  uploadDate: Date;
  url: string;
}

const PresentacionInicialPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [clientName, setClientName] = useState('');
  const [pdfFile, setPdfFile] = useState<PdfFile | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showAccessDeniedModal, setShowAccessDeniedModal] = useState(false);
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
  
  // Verificar permisos al cargar la página
  useEffect(() => {
    if (user && !hasPermission(user, 'edit_presentacion')) {
      setShowAccessDeniedModal(true);
    }
  }, [user]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      handlePdfFile(selectedFile);
    } else {
      alert('Por favor selecciona solo archivos PDF');
    }
  };

  const handlePdfFile = (file: File) => {
    const newPdf: PdfFile = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      size: file.size,
      uploadDate: new Date(),
      url: URL.createObjectURL(file)
    };

    setPdfFile(newPdf);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      handlePdfFile(droppedFile);
    } else {
      alert('Por favor arrastra solo archivos PDF');
    }
  };

  const handleDeletePdf = () => {
    if (pdfFile?.url) {
      URL.revokeObjectURL(pdfFile.url);
    }
    setPdfFile(null);
  };

  const handleDownloadPdf = () => {
    if (pdfFile?.url) {
      const link = document.createElement('a');
      link.href = pdfFile.url;
      link.download = pdfFile.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`presentacion-inicial-page ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      <MenuBackground />
      <div className="presentacion-header">
        <div className="presentacion-breadcrumb-container">
          <span className="presentacion-breadcrumb-separator">/</span>
          <button 
            onClick={() => navigate('/dashboard')}
            className="presentacion-breadcrumb-link"
          >
            Menú
          </button>
          <span className="presentacion-breadcrumb-separator">/</span>
          <button 
            onClick={() => navigate('/overview-main')}
            className="presentacion-breadcrumb-link"
          >
            Overview
          </button>
          <span className="presentacion-breadcrumb-separator">/</span>
          <button 
            onClick={() => navigate('/overview')}
            className="presentacion-breadcrumb-link"
          >
            Configuración
          </button>
          <span className="presentacion-breadcrumb-separator">/</span>
          <button 
            onClick={() => navigate('/select-account')}
            className="presentacion-breadcrumb-link"
          >
            Seleccionar
          </button>
          <span className="presentacion-breadcrumb-separator">/</span>
          <button 
            onClick={() => navigate('/client-dashboard', { state: { clientName } })}
            className="presentacion-breadcrumb-link"
          >
            {clientName ? clientName.split(' - ')[0] : 'Cliente'}
          </button>
          <span className="presentacion-breadcrumb-separator">/</span>
          <span className="presentacion-breadcrumb-link current-page">
            presentacion-inicial
          </span>
        </div>
        
        <h1 className="presentacion-title">
          Presentación inicial: {clientName ? clientName.split(' - ')[0] : 'Cliente'}
        </h1>
        
        <div className="header-right">
          <Logo />
        </div>
      </div>

      <div className={`presentacion-content ${isVisible ? 'visible' : ''}`}>
        <div className="content-layout">
          {/* PDF Viewer Area - 70% */}
          <div className="pdf-viewer-area">
            {pdfFile ? (
              <div className="pdf-viewer-container">
                <div className="pdf-viewer-header">
                  <div className="pdf-info">
                    <FileText size={20} className="pdf-icon" />
                    <div className="pdf-details">
                      <h3>{pdfFile.name}</h3>
                      <p>{formatFileSize(pdfFile.size)} • {pdfFile.uploadDate.toLocaleDateString('es-ES')}</p>
                    </div>
                  </div>
                  <div className="pdf-actions">
                    <button
                      className="pdf-action-btn download-btn"
                      onClick={handleDownloadPdf}
                      title="Descargar"
                    >
                      <Download size={16} />
                    </button>
                    <button
                      className="pdf-action-btn delete-btn"
                      onClick={handleDeletePdf}
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="pdf-viewer">
                  <iframe
                    src={pdfFile.url}
                    width="100%"
                    height="100%"
                    title="PDF Viewer"
                    className="pdf-iframe"
                  />
                </div>
              </div>
            ) : (
              <div className="empty-viewer">
                <FileText size={64} className="empty-icon" />
                <h3>No hay presentación cargada</h3>
                <p>Sube un archivo PDF para visualizarlo aquí</p>
              </div>
            )}
          </div>

          {/* Upload Area - 30% */}
          <div className="pdf-upload-section">
            <div 
              className={`upload-area ${isDragOver ? 'drag-over' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="upload-icon">
                <Upload size={32} />
              </div>
              <h3>Cargar presentación</h3>
              <p>Arrastra un PDF aquí o haz clic</p>
              <div className="upload-formats">
                <span>Solo archivos PDF</span>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="file-input"
              />
            </div>

            {pdfFile && (
              <div className="current-file-info">
                <h4>Archivo actual</h4>
                <div className="file-card">
                  <div className="file-card-icon">
                    📄
                  </div>
                  <div className="file-card-info">
                    <div className="file-card-name">{pdfFile.name}</div>
                    <div className="file-card-meta">
                      {formatFileSize(pdfFile.size)}
                    </div>
                  </div>
                </div>
              </div>
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
        featureName="Presentación Inicial"
      />
    </div>
  );
};

export default PresentacionInicialPage;