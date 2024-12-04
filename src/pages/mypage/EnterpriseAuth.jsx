import React, { useState }from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/mypage/EnterpriseAuth.module.css';
import Back from '../../components/layout/Back';
import BusinessRegistrationOCR from '../../components/mypage/BusinessRegistrationOCR';

//hooks
import { useProfile } from '../../hooks/useProfile';
import { useMyReviews } from '../../hooks/useMyReviews';

function EnterpriseAuth() {

    const [businessInfo, setBusinessInfo] = useState(null);
    const navigate = useNavigate();

    const handleResultChange = (result) => {
        setBusinessInfo(result);
    };

    const handleSubmit = async () => {
        if (!businessInfo) return;

        try {
            const response = await fetch('/api/enterprise/auth', {  // 실제 API 엔드포인트로 수정 필요
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    businessNumber: businessInfo.businessNumber,
                    companyName: businessInfo.companyName,
                    representative: businessInfo.representative,
                }),
            });

            if (!response.ok) {
                throw new Error('인증에 실패했습니다.');
            }

            const data = await response.json();
            alert('기업 인증이 완료되었습니다.');
            navigate('/mypage'); // 인증 완료 후 이동할 페이지
            
        } catch (error) {
            alert('인증 처리 중 오류가 발생했습니다: ' + error.message);
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
        </div>
    );
}

export default EnterpriseAuth;