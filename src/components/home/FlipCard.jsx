import React, { useState } from 'react';
import styles from '../../styles/home/FlipCard.module.css';

//utils
import { calculateAge } from '../../utils/calculateAge';

//fox img
import questionFox from '../../assets/images/home/card/question-fox.svg';
import basicFox20s from '../../assets/images/home/card/basic-20sfox.svg';
import excitedFox20s from '../../assets/images/home/card/excited-20sfox.svg';
import basicFox30s from '../../assets/images/home/card/basic-30sfox.svg'
import excitedFox30s from '../../assets/images/home/card/excited-30sfox.svg';
import cardBottom from '../../assets/images/home/card/cardbottom.svg';

//background & icon img
import stamp from '../../assets/images/home/card/stamp.svg';
import cardBlue from '../../assets/images/home/card/cardbackground-blue.svg';
import cardYellow from '../../assets/images/home/card/cardbackground-yellow.svg';

const FlipCard = ({profile, reviews}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const programLength = 20;
  const userage = calculateAge(profile.birth);

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
                    {reviews.length > 0 ? (
                        <>
                            <div className={styles.cardFrontText}>
                                {(() => {
                                    if (programLength < reviews.length) {
                                        if (reviews.length >= 20) {
                                            return (
                                                <>
                                                    <p>오늘은 뭐할까 ? 내일은 뭐하지?</p>
                                                    <p>{profile.name}님은 서초 2동의 인싸!</p>
                                                </>
                                            );
                                        } else {
                                            return (
                                                <>
                                                    <p>심심한데...주변에 할 거 없나 ?</p>
                                                    <p>{profile.name}님은 외향적인 사람!</p>
                                                </>
                                            );
                                        }
                                        } else {
                                            if (reviews.length >= 20) {
                                                return (
                                                    <>
                                                        <p>이왕이면 착하게 소비할래~!</p>
                                                        <p>{profile.name}님은 프로 착한 소비러!</p>
                                                    </>
                                                );
                                            } else {
                                                return (
                                                    <>
                                                        <p>이왕 살 거 착하게 사볼까 ?</p>
                                                        <p>{profile.name}님은 착한 소비 뉴비 !</p>
                                                    </>
                                                );
                                            }
                                        }
                                })()}
                            </div>
                            <div className={styles.character}>
                                <img 
                                src={ programLength > reviews.length ? cardYellow : cardBlue} 
                                alt="card background" 
                                className={styles.cardBackground} 
                                />
                                <img 
                                    src={(() => {
                                        // 30세 미만인 경우
                                        if (userage < 30) {
                                            if (reviews.length >= 20) {
                                                return excitedFox20s;
                                            }
                                            return basicFox20s;
                                        }
                                        
                                        // 30세 이상인 경우
                                        if (reviews.length >= 20) {
                                            return excitedFox30s;
                                        }
                                        return basicFox30s;
                                    })()} 
                                    alt="fox character" 
                                    className={styles.foxCharacter}
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <img 
                                src={questionFox}
                                alt="question fox" 
                                className={styles.foxCharacter}
                            />
                            <div className={styles.cardText}>
                                <p>{profile.name}님은 어떤 사람인가요?</p>
                                <p>참여를 통해 알아보아요!</p>
                            </div>
                        </>
                    )}

                    <p className={styles.text}>
                        카드를 뒤집어 보세요!
                    </p>
                </div>
            </div>

            <div className={`${styles.card} ${styles.cardBack}`}>
                <div className={styles.cardBackContent}>
                    <div className={styles.foxStamp}>
                        <img src={stamp} alt='stamp' className={styles.stamp}/>
                    </div>
                    <div className={styles.cardBackText}>
                        <p>{profile.name}님의 적극적인 참여는</p>
                        <p>사회와 지역의 이웃들에게</p>
                        <p>도움이 됩니다!</p>
                    </div>
                    <div className={styles.graphSection}>
                        <div className={styles.graph}>
                            <div className={styles.graphLine}></div>
                            <div 
                                className={styles.reviewGraphDegree}
                                style={{ 
                                    height: `${Math.min((reviews.length || 0) / 40 * 100, 100)}%`,
                                    borderRadius: reviews.length === 20 ? 0 : '26.5px 26.5px 0 0'
                                }}
                                //최대 값 리뷰 40개로 설정
                            >
                            </div>
                        </div>
                        <div className={styles.graph}>
                            <div className={styles.graphLine}></div>
                            <div 
                                className={styles.programGraphDegree}
                                style={{ 
                                    height: `${Math.min((programLength || 0) / 40 * 100, 100)}%`,
                                    borderRadius: programLength === 20 ? 0 : '26.5px 26.5px 0 0'
                                }}
                                //최대 값 프로그램 40개로 설정
                            >
                            </div>
                        </div>
                    </div>

                    <div className={styles.reviewLabel}>
                        <p>착한 소비</p>
                        <p>{reviews.length}건</p>
                    </div>

                    <div className={styles.programLabel}>
                        <p>프로그램 참여</p>
                        <p>{programLength}건</p>
                    </div>

                    <img src={cardBottom} alt='card bottom' className={styles.cardBottom}/>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default FlipCard;