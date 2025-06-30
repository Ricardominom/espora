import React from 'react';
import { useAuthStore } from '../stores/authStore';

interface UserAvatarProps {
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
  className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  size = 'md',
  showName = false,
  className = ''
}) => {
  const { user } = useAuthStore();
  
  // Tamaños para el avatar
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };
  
  // Tamaños para el texto
  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };
  
  // Si no hay usuario, mostrar un placeholder
  if (!user) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className={`${sizeClasses[size]} rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center`}>
          <span className="text-gray-500 dark:text-gray-400 font-medium">?</span>
        </div>
        {showName && (
          <span className={`${textSizeClasses[size]} text-gray-500 dark:text-gray-400`}>
            Invitado
          </span>
        )}
      </div>
    );
  }
  
  // Determinar si usamos avatar o iniciales
  const hasAvatar = !!user.avatar;
  
  // Obtener iniciales del nombre
  const getInitials = () => {
    if (!user.name) return '?';
    
    const nameParts = user.name.split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };
  
  // Determinar color de fondo basado en el rol
  const getBgColor = () => {
    switch (user.role) {
      case 'super_admin':
        return 'bg-purple-600 dark:bg-purple-700';
      case 'admin':
        return 'bg-blue-600 dark:bg-blue-700';
      case 'user':
        return 'bg-green-600 dark:bg-green-700';
      default:
        return 'bg-gray-600 dark:bg-gray-700';
    }
  };
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {hasAvatar ? (
        <img 
          src={user.avatar} 
          alt={user.name} 
          className={`${sizeClasses[size]} rounded-full object-cover border-2 border-white dark:border-gray-800`}
        />
      ) : (
        <div className={`${sizeClasses[size]} rounded-full ${getBgColor()} flex items-center justify-center text-white`}>
          <span className="font-medium">{getInitials()}</span>
        </div>
      )}
      
      {showName && (
        <div className="flex flex-col">
          <span className={`${textSizeClasses[size]} font-medium text-gray-900 dark:text-white`}>
            {user.name}
          </span>
          <span className={`text-xs text-gray-500 dark:text-gray-400`}>
            {user.role === 'super_admin' ? 'Super Admin' : 
             user.role === 'admin' ? 'Administrador' : 'Usuario'}
          </span>
        </div>
      )}
    </div>
  );
};

export default UserAvatar;