import React, { useState, useEffect } from 'react';
import styles from '../../styles/login/WaveOverlay.module.css';

const WaveOverlay = () => {
  const [amplitude, setAmplitude] = useState(0);

  useEffect(() => {
    let frame = 0;
    const animate = () => {
      frame = (frame + 1) % 360;
      setAmplitude(Math.sin(frame * Math.PI / 180) * 9);
    };

    const interval = setInterval(animate, 5);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.container}>
        <div className={styles.content}>
            <svg
                viewBox="0 0 100 40"
                className={styles.wave}
            >
                <defs>
                <linearGradient id="waveGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#F76E66" stopOpacity="0.9" />
                    <stop offset="40%" stopColor="#F76E6690" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#F76E6690" stopOpacity="0.01" />
                </linearGradient>
                </defs>
                <path
                    d={`M0 10 
                        Q 25 ${10 - amplitude}, 50 10 
                        T 100 10 
                        V 40 H 0 Z`}
                    fill="url(#waveGradient)"
                />
            </svg>
        </div>
      
    </div>
  );
};

export default WaveOverlay;