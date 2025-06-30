import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login-button.css';

const LoginButton: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/login');
  };

  return (
    <button className="login-button" onClick={handleClick}>
      <span className="button-text">Iniciar sesión</span>
      <span className="button-glow"></span>
    </button>
  );
};

export default LoginButton;