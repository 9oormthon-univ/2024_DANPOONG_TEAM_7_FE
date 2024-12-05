import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/login/SelectAge.module.css';
import TopBar from '../../components/layout/TopBar';
import Back from '../../components/layout/Back';
import axiosInstance from '../../api/axiosInstance';

//hooks
import { useProfile } from '../../hooks/useProfile';

//utils
import { calculateAge } from '../../utils/calculateAge';

//img
import questionFox from '../../assets/images/fox/question-fox.svg';

function SelectAge() {
    const navigate = useNavigate();
    const { 
        profile
    } = useProfile();

    const [birthDate, setBirthDate] = useState({
        year: '',
        month: '',
        day: ''
    });
    const [isValidFields, setIsValidFields] = useState({
        year: false,
        month: false,
        day: false
    });
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        const { year, month, day } = birthDate;
        
        // 년도 검증 (1900년 이상, 현재 연도 이하)
        const yearNum = parseInt(year);
        const isYearValid = yearNum >= 1900 && yearNum <= new Date().getFullYear() && year.length === 4;
        
        // 월 검증 (1-12)
        const monthNum = parseInt(month);
        const isMonthValid = monthNum >= 1 && monthNum <= 12 && month.length > 0;
        
        // 일 검증 (1-31, 월별 일수 고려)
        const dayNum = parseInt(day);
        const lastDay = new Date(yearNum, monthNum, 0).getDate();
        const isDayValid = dayNum >= 1 && dayNum <= lastDay && day.length > 0;
    
        setIsValidFields({
            year: isYearValid,
            month: isMonthValid,
            day: isDayValid
        });
    
        setIsValid(isYearValid && isMonthValid && isDayValid);
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
                // 나이 계산
                const age = calculateAge(formattedDate);
                
                // 나이에 따라 다른 페이지로 라우팅
                if (age >= 30) {
                    navigate('/age/30');
                } else {
                    navigate('/age/20');
                }
            } else {
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
            <div className={styles.header}>
                <Back/>
                <p>나이 입력</p>
            </div>
            <div className={styles.comment}>
                <p>앞으로 {profile.name}님의 가치 있는</p>
                <p>소비와 참여에 캐릭터가 함께할 거에요!</p>
            </div>
            <div className={styles.content}>
                <img src={questionFox} alt='question fox' className={styles.questionFox}/>
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
                            className={isValidFields.year ? styles.validInput : ''}
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
                            className={isValidFields.month ? styles.validInput : ''}
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
                            className={isValidFields.day ? styles.validInput : ''}
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