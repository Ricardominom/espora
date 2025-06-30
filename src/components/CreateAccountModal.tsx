import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Calendar, Twitter, Facebook, Instagram, UserPlus } from 'lucide-react';
import '../styles/modal.css';

interface CreateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateAccount?: (clientName: string) => void;
}

const CreateAccountModal: React.FC<CreateAccountModalProps> = ({ isOpen, onClose, onCreateAccount }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    clientName: '',
    position: '',
    electionDate: '',
    campaignStart: '',
    twitter: '',
    facebook: '',
    instagram: '',
    tiktok: ''
  });

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateAccount?.(formData.clientName);
    onClose();
    navigate('/account', { state: { clientName: formData.clientName } });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container">
        <div className="modal-header">
          <h2>
            <UserPlus size={24} className="modal-title-icon" />
            <span>Crear nueva cuenta</span>
          </h2>
          <button onClick={onClose} className="close-button">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="clientName">Nombre del cliente</label>
            <input
              type="text"
              id="clientName"
              className="form-input"
              placeholder="Ingrese el nombre completo"
              value={formData.clientName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="position">Cargo al que aspira</label>
            <input
              type="text"
              id="position"
              className="form-input"
              placeholder="Ej: Alcalde, Gobernador, etc."
              value={formData.position}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label htmlFor="electionDate">
                <Calendar size={16} className="icon" />
                Fecha de la elección
              </label>
              <input
                type="date"
                id="electionDate"
                className="form-input"
                value={formData.electionDate}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group flex-1">
              <label htmlFor="campaignStart">
                <Calendar size={16} className="icon" />
                Fecha de inicio de campaña
              </label>
              <input
                type="date"
                id="campaignStart"
                className="form-input"
                value={formData.campaignStart}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="social-media-section">
            <h3>Redes Sociales</h3>
            
            <div className="form-group">
              <label htmlFor="twitter">
                <Twitter size={16} className="icon" />
                URL de X (Twitter)
              </label>
              <input
                type="url"
                id="twitter"
                className="form-input"
                value={formData.twitter}
                onChange={handleInputChange}
                placeholder="https://x.com/usuario"
              />
            </div>

            <div className="form-group">
              <label htmlFor="facebook">
                <Facebook size={16} className="icon" />
                URL de Facebook
              </label>
              <input
                type="url"
                id="facebook"
                className="form-input"
                value={formData.facebook}
                onChange={handleInputChange}
                placeholder="https://facebook.com/usuario"
              />
            </div>

            <div className="form-group">
              <label htmlFor="instagram">
                <Instagram size={16} className="icon" />
                URL de Instagram
              </label>
              <input
                type="url"
                id="instagram"
                className="form-input"
                value={formData.instagram}
                onChange={handleInputChange}
                placeholder="https://instagram.com/usuario"
              />
            </div>

            <div className="form-group">
              <label htmlFor="tiktok">
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  className="icon"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                </svg>
                URL de TikTok
              </label>
              <input
                type="url"
                id="tiktok"
                className="form-input"
                value={formData.tiktok}
                onChange={handleInputChange}
                placeholder="https://tiktok.com/@usuario"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancelar
            </button>
            <button type="submit" className="submit-button">
              Crear cuenta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAccountModal;