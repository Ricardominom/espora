import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Users } from 'lucide-react';
import '../styles/modal.css';

interface SelectAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SelectAccountModal: React.FC<SelectAccountModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const select = document.getElementById('accountSelect') as HTMLSelectElement;
    const selectedOption = select.options[select.selectedIndex];
    onClose();
    navigate('/account', { state: { clientName: selectedOption.text } });
  };

  const accounts = [
    { id: 1, name: 'Juan Pérez - Alcalde' },
    { id: 2, name: 'María García - Gobernadora' },
    { id: 3, name: 'Carlos López - Diputado' },
    { id: 4, name: 'Ana Martínez - Senadora' }
  ];

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container">
        <div className="modal-header">
          <h2>
            <Users size={24} className="modal-title-icon" />
            <span>Seleccionar cuenta</span>
          </h2>
          <button onClick={onClose} className="close-button">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label htmlFor="accountSelect">Selecciona una cuenta</label>
            <select
              id="accountSelect"
              className="form-input"
              required
              defaultValue=""
              style={{ 
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.75rem center',
                backgroundSize: '16px'
              }}
            >
              <option value="" disabled>Elige una cuenta...</option>
              {accounts.map(account => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancelar
            </button>
            <button type="submit" className="submit-button">
              Seleccionar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SelectAccountModal