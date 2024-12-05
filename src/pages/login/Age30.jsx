import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/login/Age30.module.css';
import TopBar from '../../components/layout/TopBar';
import Back from '../../components/layout/Back';
import Card30 from '../../components/login/Card30';

function Age30() {
    const navigate = useNavigate();

    const handleStartClick = () => {
        navigate('/home');
    };

    return (
        <div className={styles.container}>
            <TopBar/>
            <div className={styles.header}>
                <Back/>
                <p>나이 입력</p>
            </div>
            <div className={styles.content}>
                <Card30/>
            </div>
            <div className={styles.comment}> 
                <p className={styles.foxName}>삼공이</p>
                <p className={styles.foxAge}>30대</p>
                <p className={styles.foxIntroduce}>나만의 행복을 찾고 싶은 소확행 스타일</p>
            </div>
            <button 
                className={styles.startBtn}
                onClick={handleStartClick}
            >
                <p>다음으로</p>
            </button>
        </div>
    );
}
export default Age30;