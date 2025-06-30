import React from 'react';
import { User } from 'lucide-react';

interface AccountBadgeProps {
  accountName: string;
  className?: string;
}

const AccountBadge: React.FC<AccountBadgeProps> = ({ accountName, className = '' }) => {
  // Detectar el tema actual desde el body
  const isDarkMode = document.body.classList.contains('dark-theme');

  if (!accountName) return null;

  // Separar nombre y posición si están en formato "Nombre - Posición"
  const parts = accountName.split(' - ');
  const name = parts[0];
  const position = parts.length > 1 ? parts[1] : '';

  return (
    <div 
      className={`account-badge ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.5rem 0.75rem',
        borderRadius: '8px',
        transition: 'all 0.3s ease',
        maxWidth: '100%',
        overflow: 'hidden',
        ...(isDarkMode ? {
          background: 'rgba(147, 112, 219, 0.1)',
          border: '1px solid rgba(147, 112, 219, 0.2)'
        } : {
          background: 'rgba(1, 113, 226, 0.05)',
          border: '1px solid rgba(1, 113, 226, 0.15)'
        })
      }}
    >
      <div 
        className="account-badge-icon"
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          ...(isDarkMode ? {
            background: 'rgba(147, 112, 219, 0.2)',
            border: '1px solid rgba(147, 112, 219, 0.3)'
          } : {
            background: 'rgba(1, 113, 226, 0.1)',
            border: '1px solid rgba(1, 113, 226, 0.2)'
          })
        }}
      >
        <User 
          size={18} 
          style={{
            color: isDarkMode ? 'rgba(147, 112, 219, 0.9)' : '#0171E2'
          }}
        />
      </div>
      
      <div 
        className="account-badge-info"
        style={{
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        <div 
          className="account-badge-name"
          style={{
            fontWeight: 600,
            fontSize: '0.9rem',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            color: isDarkMode ? 'white' : '#1a202c'
          }}
        >
          {name}
        </div>
        
        {position && (
          <div 
            className="account-badge-position"
            style={{
              fontSize: '0.75rem',
              opacity: 0.8,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : '#4a5568'
            }}
          >
            {position}
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountBadge;