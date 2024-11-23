// src/hooks/usePageTransition.jsx
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const usePageTransition = () => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState('fade-enter');

  useEffect(() => {
    if (location !== displayLocation) {
      console.log('페이지 전환 시작');
      setTransitionStage('fade-exit');
    }
  }, [location, displayLocation]);

  useEffect(() => {
    if (transitionStage === 'fade-exit') {
      console.log('페이지 페이드아웃');
      const timeout = setTimeout(() => {
        setDisplayLocation(location);
        setTransitionStage('fade-enter');
        console.log('페이지 페이드인');
      }, 300); // 페이드 아웃 시간과 동일하게 설정

      return () => clearTimeout(timeout);
    }
  }, [transitionStage, location]);

  return { displayLocation, transitionStage };
};