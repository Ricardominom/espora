import React, { useState, useEffect, useRef } from 'react';
import { X, Check, Edit3 } from 'lucide-react';

interface FileNameEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newName: string) => void;
  currentName: string;
  fileExtension: string;
}

const FileNameEditModal: React.FC<FileNameEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentName,
  fileExtension
}) => {
  const [fileName, setFileName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Detectar el tema actual desde el body
  const isDarkMode = document.body.classList.contains('dark-theme');

  useEffect(() => {
    if (isOpen) {
      // Remover la extensión para editar solo el nombre
      const nameWithoutExtension = currentName.replace(/\.[^/.]+$/, '');
      setFileName(nameWithoutExtension);
      
      // Focus después de un pequeño delay
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 100);
    }
  }, [isOpen, currentName]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSave = () => {
    if (fileName.trim()) {
      onSave(fileName.trim() + fileExtension);
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className={`file-name-modal-overlay ${isDarkMode ? 'dark-theme' : 'light-theme'}`} onClick={handleOverlayClick}>
      <div className="file-name-modal-container">
        <div className="file-name-modal-header">
          <div className="modal-title-section">
            <Edit3 size={20} className="modal-title-icon" />
            <h3>Editar nombre del archivo</h3>
          </div>
          <button onClick={onClose} className="modal-close-button">
            <X size={18} />
          </button>
        </div>

        <div className="file-name-modal-content">
          <div className="file-preview">
            <div className="file-preview-icon">📄</div>
            <div className="file-preview-info">
              <div className="current-name">Nombre actual:</div>
              <div className="current-name-display">{currentName}</div>
            </div>
          </div>

          <div className="file-name-input-section">
            <label className="input-label">
              Nuevo nombre
            </label>
            <div className="file-name-input-container">
              <input
                ref={inputRef}
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                onKeyDown={handleKeyDown}
                className="file-name-input"
                placeholder="Ingrese el nuevo nombre..."
              />
              <span className="file-extension">{fileExtension}</span>
            </div>
            <div className="input-hint">
              La extensión del archivo se mantendrá automáticamente
            </div>
          </div>
        </div>

        <div className="file-name-modal-footer">
          <button onClick={onClose} className="modal-cancel-button">
            Cancelar
          </button>
          <button onClick={handleSave} className="modal-save-button" disabled={!fileName.trim()}>
            <Check size={16} />
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileNameEditModal;