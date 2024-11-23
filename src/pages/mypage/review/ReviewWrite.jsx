import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '../../../styles/mypage/review/ReviewWrite.module.css';
import TopBar from '../../../components/layout/TopBar';

//hooks
import { useProfile } from '../../../hooks/useProfile';
import { useReview } from '../../../contexts/ReviewContext';

//utils
import { formatCompanyName } from '../../../utils/companyNameUtils';

//img
import employIcon from '../../../assets/images/enterprise-icons/employment-icon.svg';
import communityIcon from '../../../assets/images/enterprise-icons/local-community-icon.svg';
import mixedIcon from '../../../assets/images/enterprise-icons/mixed-type-icon.svg';
import otherIcon from '../../../assets/images/enterprise-icons/other-creative-icon.svg';
import serviceIcon from '../../../assets/images/enterprise-icons/service-icon.svg';

function ReviewWrite() {
    const navigate = useNavigate();
    const location = useLocation();
    const { profile, loading } = useProfile();
    const { 
        reviewText, 
        setReviewText, 
        selectedKeywords,
        prepareSubmissionData,
        validateReviewData 
    } = useReview();

    const { enterpriseId, enterpriseName, socialPurpose } = location.state || {};

    const maxLength = 150;
    const { isValid } = validateReviewData();
    const userName = loading ? '...' : (profile.name || '사용자');

    // 아이콘 매핑
    const iconMap = useMemo(() => ({
        '사회서비스제공형': serviceIcon,
        '일자리제공형': employIcon,
        '지역사회공헌형': communityIcon,
        '혼합형': mixedIcon,
        '기타(창의ㆍ혁신)형': otherIcon
    }), []);

    // 현재 기업 유형에 맞는 아이콘 선택
    const currentIcon = iconMap[socialPurpose] || employIcon;

    useEffect(() => {
        if (!selectedKeywords || selectedKeywords.length === 0) {
            navigate('/mypage/review/keyword');
        }
    }, [selectedKeywords, navigate]);

    const handleSubmit = () => {
        if (isValid) {
            const submissionData = prepareSubmissionData();
            if (!submissionData) {
                console.error('Failed to prepare submission data');
                return;
            }

            console.log('ReviewWrite: Submitting review:', submissionData);
            console.log('ReviewWrite: Selected keywords:', selectedKeywords);
            navigate('/mypage');
        }
    };

    return (
        <div className={styles.container}>
            <TopBar/>
            <TopBar/>
            <div className={styles.reviewInfo}>
                <img 
                    src={currentIcon}
                    alt={`${socialPurpose} 아이콘`}
                    className={styles.enterpriseIcon}
                />
                <div className={styles.reviewMetadata}>
                    <p className={styles.companyNameFront}>
                        {formatCompanyName(enterpriseName).front}
                    </p>
                        {formatCompanyName(enterpriseName).back && (
                            <>
                                <p className={styles.companyNameBack}>
                                    {formatCompanyName(enterpriseName).back}
                                </p>
                            </>
                        )}
                    <p className={styles.socialPurpose}>{socialPurpose}</p>
                    <p>작성일: {new Date().toLocaleDateString()}</p>
                </div>
            </div>
            <div className={styles.keywordSection}>
                {Object.entries(
                    selectedKeywords.reduce((acc, {keyword, category}) => {
                        if (!acc[category]) acc[category] = [];
                        acc[category].push(keyword);
                        return acc;
                    }, {})
                ).map(([category, keywords]) => (
                    <div key={category} className={styles.categoryLabel}>
                        <p className={styles.category}>{category}</p>
                        <div className={styles.keywordList}>
                            {keywords.map((keyword, index) => (
                                <div key={index} className={styles.keyword}>{keyword}</div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.keywordGraphBox}>
                <p>{userName}님이 선택한 키워드는</p>
                <p>전체 키워드 15개 중 {selectedKeywords.length}개 입니다!</p>
                <div className={styles.graphSection}>
                    <div 
                        className={styles.userGraphDegree}
                        style={{ 
                            height: `${Math.min(selectedKeywords.length / 15 * 100, 100)}%`,
                        }}
                    />
                    <div 
                        className={styles.allGraphDegree}
                        style={{ 
                            height: `${Math.min(15 / 15 * 100, 100)}%`,
                        }}
                    />    
                </div>
                <div className={styles.graphComment}>
                    <span>{selectedKeywords.length}개</span>
                    <span>/</span>
                    <span>15개</span>
                </div>
                <p>선택한 키워드의 개수는 점수로 환산되어</p>
                <p>기업에 대한 평균 추천 수에 포함될 예정입니다</p>
            </div>
            <div className={styles.reviewBox}>
                <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="리뷰를 작성해주세요" 
                    className={styles.reviewInput}
                    maxLength={maxLength}
                    style={{ fontFamily: 'Pretendard' }}
                />
                <div className={styles.characterCount}>
                    {reviewText.length}/{maxLength}
                </div>
            </div>
            <button
                className={styles.submitBtn}
                onClick={handleSubmit}
                disabled={!isValid}
            >
                등록하기
            </button>
        </div>
    );
}

export default ReviewWrite;