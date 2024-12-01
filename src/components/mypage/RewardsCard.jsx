import React, { useState } from 'react';
import styles from '../../styles/mypage/RewardsCard.module.css';

//utils
import { calculateAge } from '../../utils/calculateAge';

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
  
  if (!profile) return null;

  const getBadgeImage = (reviewType) => {
    switch (reviewType) {
      case 'employ':
        return employBadge;
      case 'community':
        return communityBadge;
      case 'mixed':
        return mixedBadge;
      case 'service':
        return serviceBadge;
      default:
        return otherBadge;
    }
  };

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  const handleContentInteraction = (e) => {
    e.stopPropagation();
    if (e.type === 'wheel') {
      e.preventDefault();
      const content = e.currentTarget;
      content.scrollTop += e.deltaY;
    }
  };


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
                    <p>획득한 뱃지 10개</p>
                    <img src={goBadge} alt='go badge' className={styles.goBadge}/>
                </div>
                <div className={styles.cardFrontContent}>
                    <img
                        src={rewardsBoard}
                        alt='rewards-board'
                        className={styles.rewardsBoard}
                    />
                    <div className={styles.rewardStep1}>
                        <img
                            src={step1}
                            alt='rewards-step1'
                            className={styles.step1}
                        />
                    </div>

                    <div className={styles.rewardStep2}>
                        <img
                            src={step2}
                            alt='rewards-step2'
                            className={styles.step2}
                        />
                    </div>
                    <div className={styles.rewardStep3}>
                        <img
                            src={step3}
                            alt='rewards-step3'
                            className={styles.step3}
                        />
                    </div>
                    <div className={styles.rewardStep4}>
                        <img
                            src={step4}
                            alt='rewards-step4'
                            className={styles.step4}
                        />
                    </div>
                    
                    <div className={styles.rewardStep5}>
                        <img
                            src={step5}
                            alt='rewards-step5'
                            className={styles.step5}
                        />
                    </div>
                    <div className={styles.rewardStep6}>
                        <img
                            src={step6}
                            alt='rewards-step6'
                            className={styles.step6}
                        />
                    </div>

                    
                    <div className={styles.rewardStep7}>
                        <img
                            src={step7}
                            alt='rewards-step7'
                            className={styles.step7}
                        />
                    </div>

                    
                    <div className={styles.rewardStep8}> 
                        <img
                            src={step8}
                            alt='rewards-step8'
                            className={styles.step8}
                        />
                    </div>

                    <div className={styles.rewardStep9}>
                        <img
                            src={step9}
                            alt='rewards-step9'
                            className={styles.step9}
                        />
                    </div>
                    <div className={styles.rewardStep10}>
                        <img
                            src={step10}
                            alt='rewards-step10'
                            className={styles.step10}
                        />
                    </div>
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
                        <p>지금까지 모은 배지 9개</p>
                    </div>
                    <div 
                        className={styles.cardFBackContent}
                        onClick={handleContentInteraction}
                        onWheel={handleContentInteraction}
                    >
                        <div className={styles.badgeGrid}>
                            {[...reviews]
                                .reverse()
                                .map((review, index) => (
                                <div key={index} className={styles.badgeItem}>
                                    <img 
                                    src={getBadgeImage(review.type)} 
                                    alt={`배지 ${index + 1}`} 
                                    className={styles.badge}
                                    />
                                    <p className={styles.badgeDate}>
                                    {new Date(review.createdAt).toLocaleDateString()}
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