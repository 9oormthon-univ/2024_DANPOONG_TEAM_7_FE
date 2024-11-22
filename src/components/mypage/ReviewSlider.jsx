import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/mypage/ReviewSlider.module.css';

//utils
import { formatCompanyName, isCompanyNameOverflow } from '../../utils/companyNameUtils';
import { formatAddress } from '../../utils/formatAddress';
import { formatDateWithShortDots } from '../../utils/formatDate';

//img
import detailReviewIcon from '../../assets/images/mypage/detailreviewicon.svg';

const ReviewSlider = ({ items, onItemClick = () => {} }) => {
   const navigate = useNavigate();
   const [sortedItems, setSortedItems] = useState([]);
   const [currentSlide, setCurrentSlide] = useState(0); 
   const [isDragging, setIsDragging] = useState(false);
   const [startPos, setStartPos] = useState(0);
   const [currentTranslate, setCurrentTranslate] = useState(0);
   const [startTime, setStartTime] = useState(0);
   const dragThreshold = 50;
   const clickDurationThreshold = 200;

   useEffect(() => {
       if (items && items.length > 0) {
           const sorted = [...items].sort((a, b) => new Date(b.date) - new Date(a.date));
           setSortedItems(sorted);
           setCurrentSlide(sorted.length);
       }
   }, [items]);

   if (!items || items.length === 0) {
       return <div className={styles.noReviews}>작성한 리뷰가 없습니다.</div>;
   }

   const extendedItems = [...sortedItems, ...sortedItems, ...sortedItems];

   const handleTransitionEnd = () => {
       if (currentSlide <= sortedItems.length - 1) {
           setCurrentSlide(currentSlide + sortedItems.length);
       } else if (currentSlide >= sortedItems.length * 2) {
           setCurrentSlide(currentSlide - sortedItems.length);
       }
   };

   const handleTouchStart = (e) => {
       setIsDragging(true);
       setStartPos(e.touches[0].clientX);
       setStartTime(Date.now());
   };

   const handleMouseDown = (e) => {
       setIsDragging(true);
       setStartPos(e.clientX);
       setStartTime(Date.now());
       e.preventDefault();
   };

   const handleTouchMove = (e) => {
       if (!isDragging) return;
       const currentPos = e.touches[0].clientX;
       const diff = currentPos - startPos;
       setCurrentTranslate(diff);
   };

   const handleMouseMove = (e) => {
       if (!isDragging) return;
       const currentPos = e.clientX;
       const diff = currentPos - startPos;
       setCurrentTranslate(diff);
   };

   const handleDragEnd = () => {
       if (!isDragging) return;

       const endTime = Date.now();
       const clickDuration = endTime - startTime;

       if (Math.abs(currentTranslate) > dragThreshold) {
           if (currentTranslate > 0) {
               setCurrentSlide(currentSlide - 1);
           } else {
               setCurrentSlide(currentSlide + 1);
           }

           setTimeout(() => {
               if (currentSlide <= sortedItems.length - 1) {
                   setCurrentSlide(currentSlide + sortedItems.length);
               } else if (currentSlide >= sortedItems.length * 2) {
                   setCurrentSlide(currentSlide - sortedItems.length);
               }
           }, 300);
       } else if (clickDuration < clickDurationThreshold) {
           const activeItem = extendedItems[currentSlide];
           navigate('/mypage/review', { state: { reviewData: activeItem } });
       }

       setIsDragging(false);
       setCurrentTranslate(0);
   };

   const handleDetailClick = (e, review) => {
       e.stopPropagation();
       navigate('/mypage/review', { state: { reviewData: review } });
   };

   return (
       <div 
           className={styles.sliderContainer}
           onTouchStart={handleTouchStart}
           onTouchMove={handleTouchMove}
           onTouchEnd={handleDragEnd}
           onMouseDown={handleMouseDown}
           onMouseMove={handleMouseMove}
           onMouseUp={handleDragEnd}
           onMouseLeave={handleDragEnd}
       >
           <div 
               className={styles.sliderWrapper}
               onTransitionEnd={handleTransitionEnd}
           >
               {extendedItems.map((item, index) => {
                   const offset = index - currentSlide;
                   const translateX = isDragging ? 
                       `calc(${offset * 105}% + ${currentTranslate}px)` : 
                       `${offset * 105}%`;

                   const realIndex = index % sortedItems.length;
                   const isActive = index === currentSlide;
                   const { front: nameFirst, back: nameSecond } = formatCompanyName(item.enterpriseName);

                   return (
                       <div
                           key={`${item.id}-${index}`}
                           className={`${styles.slide} ${isActive ? styles.active : ''}`}
                           style={{
                               transform: `translateX(${translateX})`,
                               transition: isDragging ? 'none' : 'transform 0.3s ease-out',
                               zIndex: index === currentSlide ? 1 : 0,
                               cursor: 'pointer'
                           }}
                       >
                           <div className={styles.reviewContent}>
                               <div className={styles.reviewHeader}>
                                   <span className={styles.reviewDate}>
                                       {formatDateWithShortDots(item.createAt)}
                                   </span>
                                   <span className={styles.companyCity}>
                                        {formatAddress(item.enterpriseAddress)}
                                   </span>
                               </div>
                               <div className={styles.companyName}>
                                   {nameFirst}
                                   {nameSecond && (
                                       <span className={styles.companyNameSecond}>
                                           {nameSecond}
                                       </span>
                                   )}
                               </div>
                               <button 
                                   className={styles.detailReviewBtn}
                                   onClick={(e) => handleDetailClick(e, item)}
                               >
                                   <img 
                                       src={detailReviewIcon} 
                                       alt='상세 리뷰 보기' 
                                       className={styles.detailReviewIcon}
                                   />
                               </button>
                           </div>
                       </div>
                   );
               })}
           </div>
       </div>
   );
};

export default ReviewSlider;