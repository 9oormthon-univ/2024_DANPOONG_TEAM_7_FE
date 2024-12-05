import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/login/Card20.module.css';

//img
import fox from '../../assets/images/login/card/agecard-20fox.svg';

const Card20 = () => {
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
                                <p>트렌드를 누구보다 빠르게</p> 
                                <p>따라잡는 것은 </p>
                                <p>멋진 여우의 필수 덕목!</p>
                            </div>
                            <div className={styles.smallComment}>
                                <p>살짝 치켜올라간 안경은 이공이의</p>
                                <p>빼놓을 수 없는 패션 아이템!</p>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
      );
    };
    
    export default Card20;