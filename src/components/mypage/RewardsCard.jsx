import React, { useState, useRef, useEffect } from 'react';
import styles from '../../styles/mypage/RewardsCard.module.css';

//utils
import { formatDateToMMDD } from '../../utils/formatDate';

//rewards img
import goBadge from '../../assets/images/layout/next-icon.svg';
import rewardsBoard from '../../assets/images/mypage/rewards/rewards-board.svg';
import step1 from '../../assets/images/mypage/rewards/step-1.svg';
import step2 from '../../assets/images/mypage/rewards/step-2.svg';
import step3 from '../../assets/images/mypage/rewards/step-3.svg';
import step4 from '../../assets/images/mypage/rewards/step-4.svg';
import step5 from '../../assets/images/mypage/rewards/step-5.svg';
import step6 from '../../assets/images/mypage/rewards/step-6.svg';
import step7 from '../../assets/images/mypage/rewards/step-7.svg';
import step8 from '../../assets/images/mypage/rewards/step-8.svg';
import step9 from '../../assets/images/mypage/rewards/step-9.svg';
import step10 from '../../assets/images/mypage/rewards/step-10.svg';

//badge img
import badgeFlag from '../../assets/images/mypage/badge/badge-flag.svg';
import employBadge from '../../assets/images/mypage/badge/employment-badge.svg';
import communityBadge from '../../assets/images/mypage/badge/local-community-badge.svg';
import mixedBadge from '../../assets/images/mypage/badge/mixed-type-badge.svg';
import otherBadge from '../../assets/images/mypage/badge/other-creative-badge.svg';
import serviceBadge from '../../assets/images/mypage/badge/service-badge.svg';

const RewardsCard = ({ profile, reviews = []}) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const contentRef = useRef(null);

    const getBadgeImage = (socialPurpose) => {
        switch (socialPurpose) {
            case '일자리제공형':
                return employBadge;
            case '지역사회공헌형':
                return communityBadge;
            case '혼합형':
                return mixedBadge;
            case '사회서비스제공형':
                return serviceBadge;
            case '기타(창의ㆍ혁신)형':
                return otherBadge;
            default:
                return otherBadge;
        }
    };

    useEffect(() => {
        const content = contentRef.current;
        if (!content) return;

        const handleWheel = (e) => {
            e.stopPropagation();
            content.scrollTop += e.deltaY;
          };
      
          content.addEventListener('wheel', handleWheel, { passive: false });
      
          return () => {
            content.removeEventListener('wheel', handleWheel);
          };
    }, []);

    const handleCardClick = () => {
        setIsFlipped(!isFlipped);
    };
    
    const handleContentClick = (e) => {
        e.stopPropagation();
    };
      
    const getVisibleSteps = () => {
        const reviewCount = reviews.length;
        let stepCount;
        
        if (reviewCount === 0) {
          return Array(10).fill(false);
        }
        
        if (reviewCount % 10 === 0) {
          // 10, 20, 30 등의 경우 모든 단계 표시
          stepCount = 10;
        } else {
          // 그 외의 경우 나머지 값으로 계산
          stepCount = reviewCount % 10;
        }
        
        const steps = Array(10).fill(false);
        for (let i = 0; i < stepCount; i++) {
          steps[i] = true;
        }
        return steps;
    };
      
    const visibleSteps = getVisibleSteps();
    
    if (!profile) return null;

    return (
        <div className={styles.container}>
            <div className={styles.flipContainer}>
                <div 
                className={`${styles.cardWrapper} ${isFlipped ? styles.flipped : ''}`}
                onClick={handleCardClick}
                >
                    <div className={styles.card}>
                        <div className={styles.cardFrontContainer}>
                            <div className={styles.cardFrontHeader}>
                                <p>리뷰를 작성하실 때마다</p>
                                <span style={{fontWeight:'800', color:'#000000'}}>뱃지</span>
                                <span>가 제공됩니다!</span>
                            </div>
                            <div className={styles.badgeBtn}>
                                <p>획득한 뱃지 {reviews.length}개</p>
                                <img src={goBadge} alt='go badge' className={styles.goBadge}/>
                            </div>
                            <div className={styles.cardFrontContent}>
                                <img
                                    src={rewardsBoard}
                                    alt='rewards-board'
                                    className={styles.rewardsBoard}
                                />
                                {visibleSteps[0] && (
                                <div className={styles.rewardStep1} style={{ backgroundColor: 'transparent' }}>
                                    <img src={step1} alt='rewards-step1' className={styles.step1} />
                                </div>
                                )}
                                {visibleSteps[1] && (
                                <div className={styles.rewardStep2} style={{ backgroundColor: 'transparent' }}>
                                    <img src={step2} alt='rewards-step2' className={styles.step2} />
                                </div>
                                )}
                                {visibleSteps[2] && (
                                <div className={styles.rewardStep3} style={{ backgroundColor: 'transparent' }}>
                                    <img src={step3} alt='rewards-step3' className={styles.step3} />
                                </div>
                                )}
                                {visibleSteps[3] && (
                                <div className={styles.rewardStep4} style={{ backgroundColor: 'transparent' }}>
                                    <img src={step4} alt='rewards-step4' className={styles.step4} />
                                </div>
                                )}
                                {visibleSteps[4] && (
                                <div className={styles.rewardStep5} style={{ backgroundColor: 'transparent' }}>
                                    <img src={step5} alt='rewards-step5' className={styles.step5} />
                                </div>
                                )}
                                {visibleSteps[5] && (
                                <div className={styles.rewardStep6} style={{ backgroundColor: 'transparent' }}>
                                    <img src={step6} alt='rewards-step6' className={styles.step6} />
                                </div>
                                )}
                                {visibleSteps[6] && (
                                <div className={styles.rewardStep7} style={{ backgroundColor: 'transparent' }}>
                                    <img src={step7} alt='rewards-step7' className={styles.step7} />
                                </div>
                                )}
                                {visibleSteps[7] && (
                                <div className={styles.rewardStep8} style={{ backgroundColor: 'transparent' }}>
                                    <img src={step8} alt='rewards-step8' className={styles.step8} />
                                </div>
                                )}
                                {visibleSteps[8] && (
                                <div className={styles.rewardStep9} style={{ backgroundColor: 'transparent' }}>
                                    <img src={step9} alt='rewards-step9' className={styles.step9} />
                                </div>
                                )}
                                {visibleSteps[9] && (
                                <div className={styles.rewardStep10} style={{ backgroundColor: 'transparent' }}>
                                    <img src={step10} alt='rewards-step10' className={styles.step10} />
                                </div>
                                )}
                            </div>
                            <div className={styles.bottomText}>
                                <p>10개를 모으면 리워드 포인트</p>
                                <p>10,000p를 받을 수 있어요!</p>
                            </div>
                        </div>
                    </div>
        
                    <div className={`${styles.card} ${styles.cardBack}`}>
                        <div className={styles.cardBackContainer}>
                            <div className={styles.backLayout}>
                                <img src={badgeFlag} alt='badge flag' className={styles.badgeFlag}/>
                            </div>
                            <div className={styles.cardBackHeader}>
                                <p>지금까지 모은 배지 {reviews.length}개</p>
                            </div>
                            <div 
                                className={styles.cardFBackContent}
                                onClick={handleContentClick}
                            >
                                <div className={styles.badgeGrid}>
                                    {[...reviews]
                                        .reverse()
                                        .map((review, index) => (
                                        <div key={index} className={styles.badgeItem}>
                                            <img 
                                            src={getBadgeImage(review.socialPurpose)} 
                                            alt={`배지 ${index + 1}`} 
                                            className={styles.badge}
                                            />
                                            <p className={styles.badgeDate}>
                                            {formatDateToMMDD(review.createAt)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      );
    };
    
    export default RewardsCard;