import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/login/ConfirmAge.module.css';

function ConfirmAge() {
    const navigate = useNavigate();

    const handleStartClick = () => {
        navigate('/home');
    };

    return (
        <div className={styles.container}>
            <div>
                <p>soenter을 시작할 준비가</p>
                <p>모두 완료되었어요!</p>
                <p>캐릭터가 함께할 거에요!</p>
            </div>
            <div className={styles.content}> {/*조건문 넣어서*/}

            </div>
            <div className={styles.comment}> 
                <p>이공이가 앞으로 김서현님의 가치 있는</p>
                {/*이공이: 페이지 정보전달, 김서현: name */}
                <p>소비와 지역참여 생활에 함께할 거에요!</p>
            </div>
            <button 
                className={styles.startBtn}
                onClick={handleStartClick}
            >
                <p>시작하기</p>
            </button>
        </div>
    );
}
export default ConfirmAge;