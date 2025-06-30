import React, { useEffect, useRef } from 'react';

const MenuBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  // Detectar el tema actual desde el body
  const isDarkMode = document.body.classList.contains('dark-theme');
  const isTracklinePage = window.location.pathname === '/trackline';
  
  // Colores para tema oscuro
  const darkBaseColor = isTracklinePage ? '#1a0505' : '#0a0514';
  const darkGradientColor = isTracklinePage ? '#2e0b0b' : '#1a0b2e';
  
  // Colores para tema claro mejorados
  const lightBaseColor = '#F8F9FA'; // Gris claro en la parte superior
  const lightGradientColor = '#E8F4FD'; // Azul muy suave en la parte inferior
  
  // Seleccionar colores según el tema
  const baseColor = isDarkMode ? darkBaseColor : lightBaseColor;
  const gradientColor = isDarkMode ? darkGradientColor : lightGradientColor;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;
    
    class Wave {
      amplitude: number;
      period: number;
      phase: number;
      color: string;

      constructor(amplitude: number, period: number, phase: number, color: string) {
        this.amplitude = amplitude;
        this.period = period;
        this.phase = phase;
        this.color = color;
      }

      draw(ctx: CanvasRenderingContext2D, time: number, mouseInfluence: number) {
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);

        for (let x = 0; x <= canvas.width; x += 2) {
          const distanceFromMouse = Math.abs(x - mouseRef.current.x);
          const mouseEffect = Math.max(0, 1 - distanceFromMouse / 200) * mouseInfluence;
          
          const y = canvas.height / 2 +
            Math.sin(x * this.period + time + this.phase) * this.amplitude * (1 + mouseEffect) +
            Math.cos(x * this.period * 0.6 + time + this.phase) * this.amplitude * 0.5;

          ctx.lineTo(x, y);
        }

        ctx.lineTo(canvas.width, canvas.height);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    const waves = [
      new Wave(30, 0.003, 0, getWaveColor(0)),
      new Wave(25, 0.004, 1, getWaveColor(1)),
      new Wave(20, 0.005, 2, getWaveColor(2)),
      new Wave(15, 0.006, 3, getWaveColor(3))
    ];
    
    function getWaveColor(index: number): string {
      if (isDarkMode) {
        // Colores para tema oscuro
        if (isTracklinePage) {
          const colors = [
            'rgba(139, 51, 51, 0.1)',
            'rgba(117, 52, 52, 0.1)',
            'rgba(95, 53, 53, 0.1)',
            'rgba(73, 54, 54, 0.1)'
          ];
          return colors[index];
        } else {
          const colors = [
            'rgba(88, 51, 139, 0.1)',
            'rgba(72, 52, 117, 0.1)',
            'rgba(58, 53, 95, 0.1)',
            'rgba(44, 54, 73, 0.1)'
          ];
          return colors[index];
        }
      } else {
        // Colores mejorados para tema claro con combinaciones más vistosas
        const colors = [
          'rgba(1, 113, 226, 0.15)',    // Azul principal más visible
          'rgba(74, 144, 226, 0.12)',   // Azul medio
          'rgba(212, 235, 246, 0.18)',  // Azul claro más intenso
          'rgba(245, 244, 246, 0.14)'   // Gris-azul suave
        ];
        return colors[index];
      }
    }

    const animate = () => {
      // Crear gradiente mejorado para modo claro
      if (!isDarkMode) {
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#F8F9FA');      // Gris claro arriba
        gradient.addColorStop(0.3, '#F1F5F9');    // Gris-azul muy suave
        gradient.addColorStop(0.6, '#E8F4FD');    // Azul muy claro
        gradient.addColorStop(0.8, '#DBEAFE');    // Azul claro
        gradient.addColorStop(1, '#E0F2FE');      // Azul suave abajo
        
        ctx.fillStyle = gradient;
      } else {
        ctx.fillStyle = baseColor;
      }
      
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      time += 0.02;
      waves.forEach(wave => wave.draw(ctx, time, 2));
      
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY
      };
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDarkMode]); // Agregar isDarkMode como dependencia para re-renderizar cuando cambie el tema

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
      style={{ 
        background: isDarkMode 
          ? `linear-gradient(135deg, ${baseColor} 0%, ${gradientColor} 100%)`
          : 'transparent', // El gradiente se maneja en el canvas para modo claro
        filter: isDarkMode ? 'blur(1px)' : 'blur(0.3px)', // Menos blur en tema claro
        opacity: isDarkMode ? 1 : 0.9 // Más sutil en tema claro
      }}
    />
  );
};

export default MenuBackground;