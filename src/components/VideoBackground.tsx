import React from 'react';
import '../styles/video-background.css';

interface VideoBackgroundProps {
  isMuted?: boolean;
}

const VideoBackground: React.FC<VideoBackgroundProps> = ({ isMuted = false }) => {
  return (
    <div className="video-container">
      <video 
        autoPlay 
        loop 
        playsInline 
        muted={isMuted}
        className="background-video"
      >
        <source
          src="https://raw.githubusercontent.com/Esporadix-team/imagenes_logos/main/videoLanding.mp4"
          type="video/mp4" 
        />
        Your browser does not support the video tag.
      </video>
      <div className="video-overlay"></div>
    </div>
  );
};

export default VideoBackground;