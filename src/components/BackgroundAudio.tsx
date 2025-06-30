import React, { useEffect, useRef, useState } from 'react';

interface BackgroundAudioProps {
  isMuted: boolean;
}

const BackgroundAudio: React.FC<BackgroundAudioProps> = ({ isMuted }) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5; // Set initial volume to 50%
      audioRef.current.muted = isMuted;
      audioRef.current.play().catch(error => {
        console.log('Audio autoplay failed:', error);
      });
    }
  }, [isMuted]);

  return (
    <audio
      ref={audioRef}
      loop
      preload="auto"
      className="hidden"
    >
      <source
        src="https://raw.githubusercontent.com/Nefta11/minecApp/main/Moby%20-%20Porcelain%20(mp3cut.net).mp3"
        type="audio/mpeg"
      />
      Tu navegador no soporta el elemento de audio.
    </audio>
  );
};

export default BackgroundAudio;