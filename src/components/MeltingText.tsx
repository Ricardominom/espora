import React, { useState, useEffect, useRef } from 'react';
import '../styles/melting-text.css';

interface MeltingTextProps {
  text: string;
}

const MeltingText: React.FC<MeltingTextProps> = ({ text }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [meltingChars, setMeltingChars] = useState<Set<number>>(new Set());
  const [isMouseInside, setIsMouseInside] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };

    const handleMouseEnter = () => {
      setIsMouseInside(true);
    };

    const handleMouseLeave = () => {
      setIsMouseInside(false);
      // Limpiar todos los caracteres derretidos cuando el mouse sale
      setMeltingChars(new Set());
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);
      
      return () => {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, []);

  useEffect(() => {
    if (!isMouseInside) {
      // Si el mouse no está dentro, no aplicar efecto de derretimiento
      setMeltingChars(new Set());
      return;
    }

    const checkCharacterProximity = () => {
      const newMeltingChars = new Set<number>();
      const cursorRadius = 100; // Radio del círculo de efecto invisible

      charRefs.current.forEach((charRef, index) => {
        if (charRef) {
          const rect = charRef.getBoundingClientRect();
          const containerRect = containerRef.current?.getBoundingClientRect();
          
          if (containerRect) {
            const charCenterX = rect.left + rect.width / 2 - containerRect.left;
            const charCenterY = rect.top + rect.height / 2 - containerRect.top;
            
            const distance = Math.sqrt(
              Math.pow(mousePosition.x - charCenterX, 2) + 
              Math.pow(mousePosition.y - charCenterY, 2)
            );
            
            if (distance <= cursorRadius) {
              newMeltingChars.add(index);
            }
          }
        }
      });

      setMeltingChars(newMeltingChars);
    };

    checkCharacterProximity();
  }, [mousePosition, isMouseInside]);

  return (
    <div 
      ref={containerRef}
      className="melting-text"
      style={{
        '--mouse-x': `${mousePosition.x}px`,
        '--mouse-y': `${mousePosition.y}px`
      } as React.CSSProperties}
    >
      {text.split('').map((char, index) => (
        <span
          key={index}
          ref={(el) => charRefs.current[index] = el}
          className={`char ${meltingChars.has(index) ? 'melting' : ''}`}
        >
          {char}
        </span>
      ))}
    </div>
  );
};

export default MeltingText;