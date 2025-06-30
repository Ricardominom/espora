import React, { useState, useEffect } from 'react';
import { X, Users, CheckCircle } from 'lucide-react';
import '../styles/modal.css';

interface Account {
  id: number;
  name: string;
  position: string;
  isActive: boolean;
}

interface SelectAccountModalForWorkHubProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAccount: (accountId: number, accountName: string) => void;
  currentAccountId?: number;
}

const SelectAccountModalForWorkHub: React.FC<SelectAccountModalForWorkHubProps> = ({ 
  isOpen, 
  onClose, 
  onSelectAccount,
  currentAccountId
}) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string>(currentAccountId?.toString() || "");

  useEffect(() => {
    // Fetch active accounts
    const fetchAccounts = () => {
      // In a real app, this would be an API call
      // For now, we'll use mock data
      const mockAccounts: Account[] = [
        { id: 1, name: 'Juan Pérez', position: 'Alcalde', isActive: true },
        { id: 2, name: 'María García', position: 'Gobernadora', isActive: true },
        { id: 4, name: 'Ana Martínez', position: 'Senadora', isActive: true },
        { id: 6, name: 'Laura Hernández', position: 'Diputada Local', isActive: true }
      ];
      
      // Filter only active accounts
      const activeAccounts = mockAccounts.filter(account => account.isActive);
      setAccounts(activeAccounts);
    };
    
    if (isOpen) {
      fetchAccounts();
      setSelectedAccountId(currentAccountId?.toString() || "");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAccountId) {
      const accountId = parseInt(selectedAccountId);
      const account = accounts.find(acc => acc.id === accountId);
      if (account) {
        onSelectAccount(accountId, `${account.name} - ${account.position}`);
      }
      onClose();
    }
  };

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

        <form onSubmit={handleSubmit} className="modal-form" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label htmlFor="accountSelect">Selecciona una cuenta</label>
            <select
              id="accountSelect"
              className="form-input"
              required
              value={selectedAccountId}
              onChange={(e) => setSelectedAccountId(e.target.value)}
              style={{ 
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.75rem center',
                backgroundSize: '16px'
              }}
            >
              <option value="" disabled>Elige una cuenta...</option>
              {accounts.map(account => (
                <option key={account.id} value={account.id}>
                  {account.name} - {account.position} {account.id === currentAccountId ? '(Actual)' : ''}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label>Cuentas disponibles</label>
            <div className="accounts-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
              {accounts.map(account => (
                <option key={account.id} value={account.id} onClick={() => setSelectedAccountId(account.id.toString())} style={{ 
                  padding: '0.75rem', borderRadius: '8px', cursor: 'pointer', border: '1px solid rgba(0,0,0,0.1)', background: account.id === parseInt(selectedAccountId) ? 'rgba(59, 130, 246, 0.1)' : 'transparent' 
                }}>
                  {account.name} - {account.position} {account.id === currentAccountId && <CheckCircle size={16} style={{ display: 'inline', marginLeft: '0.5rem', color: 'green' }}/>}
                </option>
              ))}
            </select>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancelar
            </button>
            <button 
              type="submit" 
              className="submit-button"
              disabled={!selectedAccountId}
            >
              Seleccionar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SelectAccountModalForWorkHub;