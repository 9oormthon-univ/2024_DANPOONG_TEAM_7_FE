import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useReview } from '../../../contexts/ReviewContext';
import styles from '../../../styles/mypage/review/ReviewKeyword.module.css';
import KeywordSlider from '../../../components/mypage/KeywordSlider';
import Back from '../../../components/layout/Back';

//img
import employIcon from '../../../assets/images/enterprise-icons/employment-icon.svg';
import communityIcon from '../../../assets/images/enterprise-icons/local-community-icon.svg';
import mixedIcon from '../../../assets/images/enterprise-icons/mixed-type-icon.svg';
import otherIcon from '../../../assets/images/enterprise-icons/other-creative-icon.svg';
import serviceIcon from '../../../assets/images/enterprise-icons/service-icon.svg';

function ReviewKeyword() {
    const location = useLocation();
    const navigate = useNavigate();
    const { 
        currentEnterprise, 
        setSelectedKeywords,
        selectedKeywords 
    } = useReview();
    
    const [selectedKeywordSet, setSelectedKeywordSet] = useState(new Set());
    const [keywordInfo, setKeywordInfo] = useState([]);

    const enterpriseData = useMemo(() => {
        const data = location.state || {
            enterpriseId: currentEnterprise?.enterpriseId,
            enterpriseName: currentEnterprise?.name,
            socialPurpose: currentEnterprise?.socialPurpose
        };
        console.log('Enterprise Data:', data);
        return data;
    }, [location.state, currentEnterprise]);

    const iconMap = useMemo(() => ({
        '사회서비스제공형': serviceIcon,
        '일자리제공형': employIcon,
        '지역사회공헌형': communityIcon,
        '혼합형': mixedIcon,
        '기타(창의ㆍ혁신)형': otherIcon
    }), []);

    const backgroundStyle = useMemo(() => {
        const colorMap = {
            '사회서비스제공형': 'rgba(121, 185, 255, 0.10)',
            '일자리제공형': 'rgba(104, 222, 255, 0.10)',
            '지역사회공헌형': 'rgba(237, 255, 120, 0.10)',
            '혼합형': 'rgba(255, 157, 121, 0.10)',
            '기타(창의ㆍ혁신)형': 'rgba(177, 126, 255, 0.10)'
        };
        
        const color = colorMap[enterpriseData.socialPurpose];
        return {
            backgroundColor: color || 'rgba(104, 222, 255, 0.10)'
        };
    }, [enterpriseData.socialPurpose]);

    useEffect(() => {
        if (!enterpriseData.enterpriseId || !enterpriseData.enterpriseName) {
            console.log('No enterprise data found, redirecting to mypage');
            navigate('/mypage');
        }
    }, [enterpriseData, navigate]);

    const handleKeywordsChange = (newKeywords, newKeywordInfo) => {
        console.log('Keywords changed:', newKeywords, newKeywordInfo);
        setSelectedKeywordSet(newKeywords);
        setKeywordInfo(newKeywordInfo);
        setSelectedKeywords(newKeywordInfo); // Context에 키워드 정보 저장
    };

    const handleNextClick = () => {
        if (selectedKeywordSet.size > 0) {
            navigate('/mypage/review/write', {
                state: {
                    enterpriseId: enterpriseData.enterpriseId,
                    enterpriseName: enterpriseData.enterpriseName,
                    socialPurpose: enterpriseData.socialPurpose,
                }
            });
        }
    };

    if (!enterpriseData.enterpriseId || !enterpriseData.enterpriseName) {
        return <div className={styles.container}>Loading...</div>;
    }

    const isNextEnabled = selectedKeywordSet.size > 0;
    const currentIcon = iconMap[enterpriseData.socialPurpose] || employIcon;

    return (
        <div className={styles.container}>
            <Back/>
            <div className={styles.headerBar}></div>
            <div 
                className={styles.headerBackground}
                style={backgroundStyle}
            >
                <div className={styles.headerSection}>
                    <img 
                        src={currentIcon}
                        alt={`${enterpriseData.socialPurpose} 아이콘`}
                        className={styles.enterpriseIcon}
                    />
                    <p className={styles.enterpriseName}>{enterpriseData.enterpriseName}</p>
                    <p className={styles.enterpriseType}>{enterpriseData.socialPurpose}</p>
                    <p className={styles.commentBig}>어떤 점이 좋았나요?</p>
                    <p className={styles.commentSmall}>기업에 어울리는 키워드를 골라주세요!</p>
                </div>
            </div>
            <div className={styles.engagementsSection}>
                <KeywordSlider onKeywordsChange={handleKeywordsChange}/>
            </div>
            <button
                className={styles.nextBtn}
                onClick={handleNextClick}
                disabled={!isNextEnabled}
            >
                다음으로
            </button>           
        </div>
    );
}

export default ReviewKeyword;