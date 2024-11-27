import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/login/SelectAge.module.css';
import SwipeableCards from '../../components/login/SwipeableCards';
import TopBar from '../../components/layout/TopBar';
import axiosInstance from '../../api/axiosInstance';

function SelectAge() {
    const navigate = useNavigate();
    const [birthDate, setBirthDate] = useState({
        year: '',
        month: '',
        day: ''
    });
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        const { year, month, day } = birthDate;
        if (year && month && day) {
            const yearNum = parseInt(year);
            const monthNum = parseInt(month);
            const dayNum = parseInt(day);
            
            const isYearValid = yearNum >= 1900 && yearNum <= new Date().getFullYear();
            const isMonthValid = monthNum >= 1 && monthNum <= 12;
            
            const lastDay = new Date(yearNum, monthNum, 0).getDate();
            const isDayValid = dayNum >= 1 && dayNum <= lastDay;

            setIsValid(isYearValid && isMonthValid && isDayValid);
        } else {
            setIsValid(false);
        }
    }, [birthDate]);

    const handleInputChange = (e, field) => {
        const { value } = e.target;
        let newValue = value.replace(/[^0-9]/g, ''); // 숫자만 허용

        // 최대 길이 제한
        if (field === 'year' && newValue.length > 4) {
            newValue = newValue.slice(0, 4);
        } else if ((field === 'month' || field === 'day') && newValue.length > 2) {
            newValue = newValue.slice(0, 2);
        }

        setBirthDate(prev => ({
            ...prev,
            [field]: newValue
        }));
    };

    const handleNextClick = async () => {
        if (!isValid) {
            alert('올바른 생년월일을 입력해주세요.');
            return;
        }

        // 날짜 형식 변환 (YYYY-MM-DD)
        const formattedDate = `${birthDate.year}-${birthDate.month.padStart(2, '0')}-${birthDate.day.padStart(2, '0')}`;

        try {
            const response = await axiosInstance.patch('/api/users/birth', {
                birth: formattedDate
            });

            if (response.isSuccess) {
                // 성공적으로 처리된 경우
                navigate('/region');
            } else {
                // 서버에서 실패 응답을 받은 경우
                throw new Error(response.message || '생년월일 등록에 실패했습니다.');
            }
        } catch (error) {
            console.error('생년월일 전송 실패:', error);
            alert(error.response?.data?.message || error.message || '생년월일 등록에 실패했습니다. 다시 시도해주세요.');
        }
    };

    return (
        <div className={styles.container}>
            <TopBar/>
            <div className={styles.comment}>
                <p>나이를 입력해 주세요</p>
                <p>앞으로 선택한 나이에 해당하는</p>
                <p>캐릭터가 함께할 거에요!</p>
            </div>
            <div className={styles.content}>
                <SwipeableCards/>
            </div>
            <div className={styles.ageSection}>
                <div className={styles.dateInputs}>
                    <div className={styles.inputYear}>
                        <input
                            type="text"
                            placeholder="YYYY"
                            value={birthDate.year}
                            onChange={(e) => handleInputChange(e, 'year')}
                            maxLength="4"
                        />
                        <span>년</span>
                    </div>
                    <div className={styles.inputMonth}>
                        <input
                            type="text"
                            placeholder="MM"
                            value={birthDate.month}
                            onChange={(e) => handleInputChange(e, 'month')}
                            maxLength="2"
                        />
                        <span>월</span>
                    </div>
                    <div className={styles.inputDate}>
                        <input
                            type="text"
                            placeholder="DD"
                            value={birthDate.day}
                            onChange={(e) => handleInputChange(e, 'day')}
                            maxLength="2"
                        />
                        <span>일</span>
                    </div>
                </div>
            </div>
            <button 
                className={`${styles.nextBtn} ${isValid ? styles.active : ''}`}
                onClick={handleNextClick}
                disabled={!isValid}
            >
                <p>다음으로</p>
            </button>
        </div>
    );
}

export default SelectAge;