import React, { useState, useEffect, useRef } from 'react';
import { X, Check, Edit3 } from 'lucide-react';

interface InputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (value: string) => void;
  initialValue: string;
  fieldName: string;
  fieldType?: 'text' | 'number' | 'select';
  selectOptions?: { value: string; label: string }[];
}

const InputModal: React.FC<InputModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialValue,
  fieldName,
  fieldType = 'text',
  selectOptions = []
}) => {
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(null);
  
  // Detectar el tema actual desde el body
  const isDarkMode = document.body.classList.contains('dark-theme');

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue, isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Focus y seleccionar todo el texto después de un pequeño delay
      setTimeout(() => {
        inputRef.current?.focus();
        if (inputRef.current && 'select' in inputRef.current) {
          inputRef.current.select();
        }
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSave = () => {
    onSave(value);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const renderInput = () => {
    if (fieldType === 'select') {
      return (
        <select
          ref={inputRef as React.RefObject<HTMLSelectElement>}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="modal-input"
          style={{ minHeight: '60px', fontSize: '1.1rem' }}
        >
          <option value="">Seleccionar...</option>
          {selectOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    // Usar textarea para todos los campos de texto para permitir saltos de línea
    return (
      <textarea
        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="modal-input modal-textarea"
        rows={fieldType === 'number' ? 3 : 5}
        placeholder={`Ingrese ${fieldName.toLowerCase()}...`}
      />
    );
  };

  return (
    <div className={`input-modal-overlay ${isDarkMode ? 'dark-theme' : 'light-theme'}`} onClick={handleOverlayClick}>
      <div className="input-modal-container">
        <div className="input-modal-header">
          <div className="modal-title-section">
            <Edit3 size={20} className="modal-title-icon" />
            <h3>Editar {fieldName}</h3>
          </div>
          <button onClick={onClose} className="modal-close-button">
            <X size={18} />
          </button>
        </div>

        <div className="input-modal-content">
          <label className="input-label">
            {fieldName}
          </label>
          {renderInput()}
        </div>

        <div className="input-modal-footer">
          <button onClick={onClose} className="modal-cancel-button">
            Cancelar
          </button>
          <button onClick={handleSave} className="modal-save-button">
            <Check size={16} />
            Listo
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputModal;