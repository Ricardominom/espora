import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import Logo from '../components/Logo';
import LoginVideoBackground from '../components/LoginVideoBackground';
import '../styles/login-page.css';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuthStore();
  
  // Force light mode for login page
  React.useEffect(() => {
    document.body.classList.remove('dark-theme');
    document.body.classList.add('light-theme');
  }, []);
  
  const isDarkMode = false; // Always light mode for login page

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    }
    
    setIsLoading(false);
  };

  return (
    <div className={`login-page ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      <div className="flex items-center w-full p-6">
        <Link to="/" className="back-button">
          <ArrowLeft size={20} />
          <span>Volver</span>
        </Link>
      </div>
      
      <div className="cards-container">
        <div className="login-card form-card">
          <div className="w-full max-w-md">
            <div className="flex justify-center mb-8">
              <img 
                src="https://raw.githubusercontent.com/Esporadix-team/imagenes_logos/refs/heads/main/esporaLogo.png"
                alt="Espora Logo"
                className={`w-24 h-auto transition-all duration-300 ${
                  isDarkMode ? 'brightness-0 invert' : 'brightness-1'
                }`}
              />
            </div>
            <h1 className="text-2xl font-bold mb-2 text-white text-center">Iniciar sesión</h1>
            <p className="text-gray-400 text-sm mb-8 text-center">
              ¡Bienvenido! Por favor ingresa tu usuario y contraseña para acceder a tu cuenta.
            </p>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-6 text-sm text-red-500">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ingresa tu correo"
                  required
                  className="input-field"
                />

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  required
                  className="input-field"
                />
              </div>

              <div className="text-right">
                <a href="#" className="text-sm text-gray-400 hover:text-gray-200">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              <button 
                type="submit" 
                className="login-button w-full"
                disabled={isLoading || !email || !password}
              >
                {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <div className="inline-flex items-center justify-center">
                <div className="relative group">
                  <button className="text-xs text-gray-400 hover:text-gray-300 underline">
                    Ver credenciales
                  </button>
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 bg-gray-800/80 backdrop-blur-md rounded-lg p-2 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-700/50 text-xs text-left">
                    <div className="flex flex-col gap-1.5">
                      <p className="text-white/90 font-medium border-b border-gray-700/50 pb-1 mb-1">Credenciales disponibles:</p>
                      <p><span className="text-blue-400 font-medium">Super Admin:</span> admin@espora.com / password</p>
                      <p><span className="text-green-400 font-medium">Operador:</span> operador@espora.com / espora2024</p>
                      <p><span className="text-amber-400 font-medium">Capturista:</span> capturista@espora.com / espora2024</p>
                    </div>
                    <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-3 h-3 bg-gray-800/80 rotate-45 border-r border-b border-gray-700/50"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="login-card image-card">
          <LoginVideoBackground />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;