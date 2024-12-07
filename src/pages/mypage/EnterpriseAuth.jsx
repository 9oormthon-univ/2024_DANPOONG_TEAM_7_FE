import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/mypage/EnterpriseAuth.module.css';
import Back from '../../components/layout/Back';
import BusinessRegistrationOCR from '../../components/mypage/BusinessRegistrationOCR';
import axiosInstance from '../../api/axiosInstance';

//hooks
import { useProfile } from '../../hooks/useProfile';
import { useMyReviews } from '../../hooks/useMyReviews';

import enterpriseCertificationMark from '../../assets/images/mypage/enterpriseCertificationMark.svg';
import errorIcon from '../../assets/images/mypage/error-icon.svg';

function EnterpriseAuth() {
    const navigate = useNavigate();
    const [businessInfo, setBusinessInfo] = useState(null);
    const [showCompletionModal, setShowCompletionModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { fetchProfile } = useProfile(); 
    
    const handleResultChange = (result) => {
        setBusinessInfo(result);
    };

    const handleSubmit = async () => {
        if (!businessInfo) return;
    
        try {
            const response = await axiosInstance.post('/api/enterprises/verify', {
                businessRegistrationNumber: businessInfo.businessNumber,
                representativeName: businessInfo.representative,
                name: businessInfo.companyName
            });
    
            if (response.isSuccess) {
                setShowCompletionModal(true);
                
                // 모달을 보여주고 프로필을 업데이트한 후 페이지 이동
                setTimeout(async () => {
                    try {
                        await fetchProfile(); // 프로필 정보 업데이트 대기
                        setShowCompletionModal(false);
                        navigate('/mypage');
                    } catch (error) {
                        console.error('프로필 업데이트 실패:', error);
                        // 프로필 업데이트가 실패하더라도 페이지는 이동
                        setShowCompletionModal(false);
                        navigate('/mypage');
                    }
                }, 1500);
            } else {
                setShowErrorModal(true);
                setTimeout(() => {
                    setShowErrorModal(false);
                }, 1500);
            }
            
        } catch (error) {
            setShowErrorModal(true);
            setTimeout(() => {
                setShowErrorModal(false);
            }, 1500);
        }
    };
    
    // businessInfo가 있고 모든 필수 필드가 채워져 있는지 확인
    const isValid = businessInfo && 
        businessInfo.businessNumber && 
        businessInfo.companyName && 
        businessInfo.representative;
    
    return (
        <div className={styles.container}>
            <div className={styles.topBar}></div>
            <div className={styles.header}>
                <Back/>
                <p>기업인증</p>
            </div>
            <div className={styles.comment}>
                <p>더 나은 세상을 위한 발돋음</p>
                <span style={{color:'#02DDC3', fontSize: '24px', fontWeight: '700'}}>
                    Soenter
                </span>
                <span> 와 함께해요!</span>
                <p>사업자 등록증을 인식시켜 주세요</p>
            </div>
            <div className={styles.content}>
                <BusinessRegistrationOCR onResultChange={handleResultChange} />
            </div>
            <button 
                className={`${styles.confirmBtn} ${!isValid ? styles.disabled : ''}`}
                onClick={handleSubmit}
                disabled={!isValid}
            >
                <p>인증하기</p>
            </button>
            {showCompletionModal &&
                <div className={styles.completeModalContainer}>
                    <div className={styles.completeModalContent}>
                        <img 
                        src={enterpriseCertificationMark}
                        alt='enterenterprise-certification-mark'
                        className={styles.enterpriseCertificationMark}
                        />
                        <p className={styles.enterpriseName}>{businessInfo?.companyName}</p>
                        <p className={styles.resultMessage}>성공적으로 인증되었어요!</p>
                    </div>
                </div>
            }
            {showErrorModal &&
                <div className={styles.errorModalContainer}>
                    <div className={styles.errorModalContent}>
                        <img 
                        src={errorIcon}
                        alt='error-icon'
                        className={styles.errorIcon}
                        />
                        <p className={styles.errorTitle}>인증되지 않았습니다</p>
                        <p className={styles.errorMessage}>다시 시도해 주세요!</p>
                    </div>
                </div>
            }
        </div>
    );
}

export default EnterpriseAuth;