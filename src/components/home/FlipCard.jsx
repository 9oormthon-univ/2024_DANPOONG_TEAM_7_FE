import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/home/FlipCard.module.css';
import TriangleRadarChart from './TriangleRadarChart';

//utils
import { calculateAge } from '../../utils/calculateAge';

//fox img
import basicFox20s from '../../assets/images/home/card/basic-20sfox.svg';
import excitedFox20s from '../../assets/images/home/card/excited-20sfox.svg';
import basicFox30s from '../../assets/images/home/card/basic-30sfox.svg';
import excitedFox30s from '../../assets/images/home/card/excited-30sfox.svg';
import cardBottom from '../../assets/images/home/card/cardbottom.svg';

//background & icon img
import stamp from '../../assets/images/home/card/stamp.svg';
import cardBlue from '../../assets/images/home/card/cardbackground-blue.svg';
import cardYellow from '../../assets/images/home/card/cardbackground-yellow.svg';
import cardGray from '../../assets/images/home/card/cardbackground-gray.svg';

//back img
import mygraphIcon from '../../assets/images/home/card/mygraph-icon.svg';
import regionIcon from '../../assets/images/home/card/regiongraph-icon.svg';
import triangle from '../../assets/images/home/card/home-graph-frame.svg';
import rewardsIcon from '../../assets/images/home/card/rewards-circle-icon.svg';
import goRewards from '../../assets/images/layout/white-next-icon.svg';


const FlipCard = ({ profile, reviews = []}) => {
    const navigate = useNavigate();
    const [isFlipped, setIsFlipped] = useState(false);
    const age = calculateAge(profile?.birth);
    const program = 9;

    const getFoxCharacter = () => {
        if (age < 30) {
            return reviews.length >= 20 ? excitedFox20s : basicFox20s;
        }
        return reviews.length >= 20 ? excitedFox30s : basicFox30s;
    };

    const getCardBackground = () => {
        if (reviews.length === 0 && program === 0) {
            return cardGray;
        }
        if (program < reviews.length) {
            return cardBlue;
        }
        return cardYellow;
    };

    const getFrontText = () => {
        if (!profile?.name) return { line1: '', line2: '' };
        
        const hasReviews = reviews.length > 0;
        const hasHighReviews = reviews.length >= 20;
        
        if (!hasReviews) {
            return {
                line1: `${profile.name}님은 어떤 사람인가요?`,
                line2: '참여를 통해 알아보아요!'
            };
        }

        if (program < reviews.length) {
            if (hasHighReviews) {
                return {
                    line1: '어디서 뭐할까? 주변 사회적 기업 투어!',
                    line2: `${profile.name}님은 지역 기업 탐방 중!`
                };
            }
            return {
                line1: '심심한데...주변에 할 거 없나 ?',
                line2: `${profile.name}님은 외향적인 사람!`
            };
        }

        return hasHighReviews ? {
            line1: '이왕이면 착하게 소비할래~!',
            line2: `${profile.name}님은 프로 착한 소비러!`
        } : {
            line1: '이왕 살 거 착하게 사볼까 ?',
            line2: `${profile.name}님은 착한 소비 뉴비 !`
        };
    };

    const handleRewardsClick = (e) => {
        e.stopPropagation();
        navigate('/mypage/rewards');
    };
    
    if (!profile) return null;

    const frontText = getFrontText();

    return (
        <div className={styles.container}>
            <div className={styles.flipContainer}>
                <div 
                    className={`${styles.cardWrapper} ${isFlipped ? styles.flipped : ''}`}
                    onClick={() => setIsFlipped(!isFlipped)}
                >
                    <div className={styles.card}>
                        <div className={styles.cardFrontContent}>
                            <div className={styles.foxStamp}>
                                <img src={stamp} alt='stamp' className={styles.stamp}/>
                            </div>
                            <div className={styles.cardFrontText}>
                                <p>{frontText.line1}</p>
                                <p>{frontText.line2}</p>
                            </div>
                            <div className={styles.character}>
                                <img 
                                    src={getCardBackground()} 
                                    alt="card background" 
                                    className={styles.cardBackground} 
                                />
                                <img 
                                    src={getFoxCharacter()} 
                                    alt="fox character" 
                                    className={styles.foxCharacter}
                                />
                            </div>
                            <p className={styles.text}>카드를 뒤집어 보세요!</p>
                        </div>
                    </div>
    
                    <div className={`${styles.card} ${styles.cardBack}`}>
                        <div className={styles.cardBackContainer}>
                            <div className={styles.foxStamp}>
                                <img src={stamp} alt='stamp' className={styles.stamp}/>
                            </div>
                            <div className={styles.cardBackHeader}>
                                <div className={styles.mygraph}>
                                    <img src={mygraphIcon} alt='mygraph icon' className={styles.mygraphIcon}/>
                                    <p>내 그래프</p>
                                </div>
                                <div className={styles.regionAverage}>
                                    <img src={regionIcon} alt='region icon' className={styles.regionIcon}/>
                                    <p>이 지역 평균</p>
                                </div>
                            </div>
                            <div className={styles.cardBackContent}>
                                <div className={styles.communityContribution}>
                                    <p className={styles.contentLabel}>지역사회 기여도</p>
                                    <p className={styles.contentText}>{program+reviews.length}건</p>
                                </div>
                                <div className={styles.ethicalConsumption}>
                                    <p className={styles.contentLabel}>착한 소비</p>
                                    <p className={styles.contentText}>{reviews.length}건</p>
                                </div>
                                <div className={styles.programParticipation}>
                                    <p className={styles.contentLabel}>프로그램 참여</p>
                                    <p className={styles.contentText}>{program}건</p>
                                </div>
                                <div className={styles.triangleSection}>
                                    <img src={triangle} alt='triangle frame' className={styles.triangleFrame}/>
                                    <TriangleRadarChart
                                        reviews={reviews.length}
                                        program={program}
                                        total={reviews.length + program}
                                    />
                                </div>
                            </div>
                            <div className={styles.cardBackBottom}>
                                <img src={cardBottom} alt='card bottom' className={styles.cardBottom}/>
                                <button 
                                    className={styles.rewardsNavigation}
                                    onClick={handleRewardsClick}
                                >
                                    <p>내가 모은 리워드 뱃지 보기</p>
                                    <img src={rewardsIcon} alt='rewards icon' className={styles.rewardsIcon}/>
                                    <img src={goRewards} alt='go rewards' className={styles.goRewards}/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      );
    };
    
    export default FlipCard;