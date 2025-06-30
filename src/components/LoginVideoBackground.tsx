import React from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/login-video.css';

const LoginVideoBackground: React.FC = () => {
  const [shouldPlay, setShouldPlay] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    // Wait for the page transition to complete
    const timer = setTimeout(() => {
      setShouldPlay(true);
      if (videoRef.current) {
        videoRef.current.play();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="login-video-container">
      <video 
        ref={videoRef}
        playsInline 
        className="login-background-video"
      >
        <source 
          src="https://raw.githubusercontent.com/Esporadix-team/imagenes_logos/main/VideoNew.mp4" 
          type="video/mp4" 
        />
        Tu navegador no soporta la reproducción de video.
      </video>
      <div className="login-video-overlay"></div>
    </div>
  );
};

export default LoginVideoBackground;