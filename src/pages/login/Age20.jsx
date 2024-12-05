import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/login/Age20.module.css';
import TopBar from '../../components/layout/TopBar';
import Back from '../../components/layout/Back';
import Card20 from '../../components/login/Card20';

function Age20() {
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
                <Card20/>
            </div>
            <div className={styles.comment}> 
                <p className={styles.foxName}>이공이</p>
                <p className={styles.foxAge}>20대</p>
                <p className={styles.foxIntroduce}>자신감이 넘치고 자기 표현이 솔직한 스타일</p>
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
export default Age20;