import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/login/Card30.module.css';

//img
import fox from '../../assets/images/login/card/agecard-30fox.svg';

const Card30 = () => {
    const navigate = useNavigate();
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div className={styles.container}>
            <div className={styles.flipContainer}>
                <div 
                    className={`${styles.cardWrapper} ${isFlipped ? styles.flipped : ''}`}
                    onClick={() => setIsFlipped(!isFlipped)}
                >
                    <div className={styles.card}>
                        <div className={styles.cardFrontContent}>
                            <img src={fox} alt='20fox' className={styles.fox} />
                        </div>
                    </div>
    
                    <div className={`${styles.card} ${styles.cardBack}`}>
                        <div className={styles.cardBackContainer}>
                            <div className={styles.bigComment}>
                                <p>현실적으로</p> 
                                <p>똑똑하게!</p>
                                <p>소확행은 나의 신념!</p>
                            </div>
                            <div className={styles.smallComment}>
                                <p>누구보다 신중하지만</p>
                                <p>삼공이의 열정은 아직 식지 않았다!</p>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
      );
    };
    
    export default Card30;