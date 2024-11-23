import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/login/SelectAge.module.css';
import SwipeableCards from '../../components/login/SwipeableCards';
import TopBar from '../../components/layout/TopBar';

function SelectAge() {
    const navigate = useNavigate();

    const handleNextClick = () => {
        navigate('/age/confirm');
    };

    const handleDateSelect = (dateString) => {
        console.log('선택된 날짜:', dateString);
        // API 호출 등 추가 작업
      };
    return (
        <div className={styles.container}>
            <TopBar/>
            <div className={styles.comment}>
                <p>나이를 입력해 주세요</p>
                <p>앞으로 선택한 나이에 해당하는</p>
                <p>캐릭터가 함께할 거에요!</p>
            </div>
            <div className={styles.content}> {/*컴포넌트로*/}
                <SwipeableCards/>
            </div>
            <div className={styles.ageSection}> {/*나이입력도 컴포넌트로*/}
            </div>
            <button 
                className={styles.nextBtn}
                onClick={handleNextClick}
            >
                <p>다음으로</p>
            </button>
        </div>
    );
}
export default SelectAge;