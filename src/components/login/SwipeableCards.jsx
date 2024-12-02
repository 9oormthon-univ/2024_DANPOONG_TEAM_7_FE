import { useState, useRef } from 'react';
import styles from '../../styles/login/SwipeableCards.module.css';
import fox20 from '../../assets/images/fox/age-20fox.svg';
import fox30 from '../../assets/images/fox/age-30fox.svg';

const SwipeableCards = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startX, setStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const containerRef = useRef(null);

  const cards = [
    {
      image: fox20,
      name: "이공이", 
      age: "20대",
      comment1: "트렌드를 누구보다 빠르게",
      comment2: "따라잡는 것은 멋진 여우의 필수 덕목!",
      comment3: "살짝 치켜올라간 안경은 이공이의",
      comment4: "빼놓을 수 없는 패션 아이템!"
    },
    {
      image: fox30,
      name: "삼공이", 
      age: "30대",
      comment1: "신중하고, 현실적이고, 똑똑하게 ",
      comment2: "소확행은 나의 신념이지",
      comment3: "자유를 향한 삼공이의 열망은 여전히 ",
      comment4: "물결 무늬 넥타이는 삼공이의 애정품! "
    }
  ];

  const getFoxCardStyle = (index) => {
    return {
      background: index === 0 ? '#92FBFF' : '#FFF576'
    };
  };

  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleMouseDown = (e) => {
    setStartX(e.clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    const resistance = 0.8;
    setDragOffset(diff * resistance);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const currentX = e.clientX;
    const diff = currentX - startX;
    const resistance = 0.8;
    setDragOffset(diff * resistance);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    
    const threshold = window.innerWidth * 0.25;
    
    if (Math.abs(dragOffset) > threshold) {
      if (dragOffset > 0 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      } else if (dragOffset < 0 && currentIndex < cards.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    }
    
    setIsDragging(false);
    setDragOffset(0);
  };

  const getCardStyle = (index) => {
    const position = index - currentIndex;
    let translateX = position * 100 + (isDragging ? dragOffset / containerRef.current?.offsetWidth * 100 : 0);
    
    const scale = isDragging ? 
      (index === currentIndex ? 1 : 0.95) :
      (index === currentIndex ? 1 : 0.95);
    
    return {
      transform: `translateX(${translateX}%) scale(${scale})`,
      transition: isDragging 
        ? 'none' 
        : 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
      zIndex: index === currentIndex ? 2 : 1,
    };
  };

  return (
    <div className={styles.container}>
      <div
        ref={containerRef}
        className={styles.cardContainer}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleDragEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
      >
        {cards.map((card, index) => (
          <div
            key={index}
            className={styles.cardWrapper}
            style={getCardStyle(index)}
          >
            <div className={styles.card}>
              <div 
                className={styles.foxCard}
                style={getFoxCardStyle(index)}
                >
                <img 
                  src={card.image} 
                  alt={card.name}
                  className={styles.foxImage}
                />
              </div>
              <p className={styles.cardName}>{card.name}</p>
              <p className={styles.cardAge}>{card.age}</p>
              <div className={styles.cardComment}>
              <div className={styles.cardComment1}>
              <p>{card.comment1}</p>
              <p>{card.comment2}</p>
              </div>
              <div className={styles.cardComment2}>
              <p>{card.comment3}</p>
              <p>{card.comment4}</p>
              </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className={styles.navigation}>
        {cards.map((_, index) => (
          <div
            key={index}
            className={`${styles.dot} ${currentIndex === index ? styles.activeDot : ''}`}
          />
        ))}
      </div>
    </div>
  );
};

export default SwipeableCards;