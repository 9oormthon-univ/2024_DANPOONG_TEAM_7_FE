// src/hooks/useSwipeableModal.jsx
import { useState, useEffect } from 'react';

const useSwipeableModal = (isActive, handleClose) => {
  const [startY, setStartY] = useState(null);
  const [currentY, setCurrentY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [modalPosition, setModalPosition] = useState('peek');
  const [isBackgroundActive, setIsBackgroundActive] = useState(false);

  const SWIPE_THRESHOLD = 100;
  const PEEK_HEIGHT = 145;

  useEffect(() => {
    if (isActive) {
      setModalPosition('top');
      setIsBackgroundActive(true);
    } else {
      setModalPosition('peek');
      setIsBackgroundActive(false);
    }
  }, [isActive]);

  const handleTouchStart = (e) => {
    setStartY(e.touches[0].clientY);
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!startY) return;
    const currentTouchY = e.touches[0].clientY;
    const deltaY = currentTouchY - startY;

    requestAnimationFrame(() => {
        // 터치 이동에 따른 상태 업데이트를 여기서 수행
        if (modalPosition === 'peek' && deltaY > 0) return;
        if (modalPosition === 'top' && deltaY < 0) return;
        setCurrentY(deltaY);
    });
};


  const handleTouchEnd = () => {
    setIsDragging(false);
    
    if (currentY > SWIPE_THRESHOLD && modalPosition === 'top') {
      setModalPosition('peek');
      setIsBackgroundActive(false);
      handleClose();
    } else if (currentY < -SWIPE_THRESHOLD && modalPosition === 'peek') {
      setModalPosition('top');
      setIsBackgroundActive(true);
    }
    
    setStartY(null);
    setCurrentY(0);
  };

  const handleBackgroundClick = () => {
    if (modalPosition === 'top') {
      setModalPosition('peek');
      setIsBackgroundActive(false);
      setTimeout(() => {
        handleClose();
      }, 300);

    }
  };

  const getModalStyle = () => {
    const getTransformY = () => {
      if (isDragging) {
        const baseOffset = modalPosition === 'peek' ? `calc(100% - ${PEEK_HEIGHT}px)` : '0';
        return `calc(${baseOffset} + ${currentY}px)`;
      }
      
      switch (modalPosition) {
        case 'top':
          return '0';
        case 'peek':
          return `calc(100% - ${PEEK_HEIGHT}px)`;
        default:
          return `calc(100% - ${PEEK_HEIGHT}px)`;
      }
    };

    return {
      transform: `translateY(${getTransformY()})`,
      transition: isDragging ? 'none' : 'transform 0.3s ease'
    };
  };

  return {
    touchHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd
    },
    modalStyle: getModalStyle(),
    modalPosition,
    isBackgroundActive,
    handleBackgroundClick
  };
};

export default useSwipeableModal;