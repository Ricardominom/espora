// Datos de usuarios para el sistema
export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'super_admin' | 'admin' | 'user';
  permissions: string[];
  avatar?: string;
}

// Lista de usuarios del sistema
export const users: User[] = [
  {
    id: '1',
    email: 'admin@espora.com',
    password: 'password',
    name: 'Super Administrador',
    role: 'super_admin',
    permissions: [
      'create_accounts',
      'edit_accounts',
      'delete_accounts',
      'view_all_accounts',
      'manage_users',
      'assign_tasks',
      'view_reports',
      'edit_expediente',
      'edit_checklist',
      'edit_presentacion'
    ],
    avatar: 'https://raw.githubusercontent.com/Esporadix-team/imagenes_logos/main/admin-avatar.png'
  },
  {
    id: '2',
    email: 'operador@espora.com',
    password: 'espora2024',
    name: 'Operador EHO',
    role: 'admin',
    permissions: [
      'view_accounts',
      'edit_checklist',
      'view_reports',
      'assign_tasks'
    ],
    avatar: 'https://raw.githubusercontent.com/Esporadix-team/imagenes_logos/main/operator-avatar.png'
  },
  {
    id: '3',
    email: 'capturista@espora.com',
    password: 'espora2024',
    name: 'Capturista',
    role: 'user',
    permissions: [
      'view_accounts',
      'edit_checklist'
    ],
    avatar: 'https://raw.githubusercontent.com/Esporadix-team/imagenes_logos/main/user-avatar.png'
  }
];

// Función para autenticar usuario
export const authenticateUser = (email: string, password: string): User | null => {
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    // No devolver la contraseña al frontend
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }
  
  return null;
};

// Función para verificar si un usuario tiene un permiso específico
export const hasPermission = (user: User, permission: string): boolean => {
  return user.permissions.includes(permission);
};

// Función para obtener todos los usuarios (sin contraseñas)
export const getAllUsers = (): Omit<User, 'password'>[] => {
  return users.map(({ password, ...user }) => user);
};

// Función para obtener un usuario por ID (sin contraseña)
export const getUserById = (id: string): Omit<User, 'password'> | null => {
  const user = users.find(u => u.id === id);
  if (!user) return null;
  
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};