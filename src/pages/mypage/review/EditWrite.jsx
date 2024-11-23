import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../../styles/mypage/review/EditWrite.module.css';
import TopBar from '../../../components/layout/TopBar';
import { useEdit } from '../../../contexts/EditContext';
import  axiosInstance from '../../../api/axiosInstance';
import { convertKeywordsToTagNumbers } from '../../../utils/tagUtils';

//hooks
import { useProfile } from '../../../hooks/useProfile';

//utils
import { formatCompanyName } from '../../../utils/companyNameUtils';
import { formatDateWithDots } from '../../../utils/formatDate';

//img
import employIcon from '../../../assets/images/enterprise-icons/employment-icon.svg';
import communityIcon from '../../../assets/images/enterprise-icons/local-community-icon.svg';
import mixedIcon from '../../../assets/images/enterprise-icons/mixed-type-icon.svg';
import otherIcon from '../../../assets/images/enterprise-icons/other-creative-icon.svg';
import serviceIcon from '../../../assets/images/enterprise-icons/service-icon.svg';

function EditWrite() {
    const navigate = useNavigate();
    const { profile, loading } = useProfile();
    const { 
        reviewText, 
        setReviewText,
        selectedKeywords,
        currentReview,
        submissionStatus,
        setSubmissionStatus,
        validateEditData,
        prepareSubmissionData,
        clearEditData
    } = useEdit();

    // 기업 유형에 따른 아이콘 매핑
    const enterpriseIcons = {
        '사회서비스 제공형': serviceIcon,
        '일자리제공형': employIcon,
        '지역사회공헌형': communityIcon,
        '혼합형': mixedIcon,
        '기타(창의ㆍ혁신)형': otherIcon
    };

    const maxLength = 400;
    const userName = loading ? '...' : (profile.name || '사용자');

    useEffect(() => {
        if (!currentReview || !selectedKeywords.length) {
            navigate('/mypage/review/editkeyword');
        }
    }, [currentReview, selectedKeywords, navigate]);

    const handleSubmit = async () => {
        const { isValid } = validateEditData();
    
        if (!isValid) {
            console.error('Validation failed');
            return;
        }
    
        setSubmissionStatus('loading');
            
        const tagNumbers = selectedKeywords.map(keyword =>
            convertKeywordsToTagNumbers([{ category: keyword.category, keyword: keyword.keyword }])[0]
        ).filter(tag => tag !== undefined);
    
        const submissionData = {
            content: reviewText,
            tagNumbers: tagNumbers,
        };
    
        console.log('Payload being sent to the backend:', submissionData);
    
        try {
            const response = await axiosInstance.put(
                `/api/reviews/${currentReview.reviewId}`,
                submissionData
            );
    
            console.log('Response data:', response.data);
                        
            clearEditData();
            navigate('/mypage');
        } catch (error) {
            console.error('Failed to submit review:', error);
            setSubmissionStatus('error');
        }
    };

    // 키워드를 카테고리별로 그룹화
    const groupedKeywords = selectedKeywords.reduce((acc, {keyword, category}) => {
        if (!acc[category]) acc[category] = [];
        acc[category].push(keyword);
        return acc;
    }, {});

    if (!currentReview || !selectedKeywords.length) {
        return <div className={styles.container}>Loading...</div>;
    }

    // 현재 기업 유형에 맞는 아이콘 가져오기
    const currentIcon = enterpriseIcons[currentReview.socialPurpose] || otherIcon;

    return (
        <div className={styles.container}>
            <TopBar/>
            <TopBar/>
            <div className={styles.reviewInfo}>
                <img 
                    src={currentIcon} 
                    alt={currentReview.socialPurpose} 
                    className={styles.enterpriseIcon}
                />
                <div className={styles.reviewMetadata}>
                    <p className={styles.companyNameFront}>
                        {formatCompanyName(currentReview.enterpriseName).front}
                    </p>
                        {formatCompanyName(currentReview.enterpriseName).back && (
                            <>
                                <p className={styles.companyNameBack}>
                                    {formatCompanyName(currentReview.enterpriseName).back}
                                </p>
                            </>
                        )}
                    <p className={styles.socialPurpose}>{currentReview.socialPurpose}</p>
                    <p>작성일:  {formatDateWithDots(currentReview.createAt)}</p>
                </div>
            </div>
            <div className={styles.keywordSection}>
                {Object.entries(groupedKeywords).map(([category, keywords]) => (
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
                disabled={!validateEditData().isValid || submissionStatus === 'loading'}
            >
                {submissionStatus === 'loading' ? '수정 중...' : '수정하기'}
            </button>
        </div>
    );
}

export default EditWrite;