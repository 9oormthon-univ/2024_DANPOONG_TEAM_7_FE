//ReviewWrite.jsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/mypage/ReviewWrite.module.css';
import { 
    setReviewText, 
    prepareReviewData,
    selectReviewText,
    selectSubmissionStatus
} from '../../redux/slices/ReviewWriteSlice';
import { selectKeywords, selectCurrentEnterprise } from '../../redux/slices/KeywordSlice';

function ReviewWrite() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Redux state 가져오기
    const reviewText = useSelector(selectReviewText);
    const selectedKeywords = useSelector(selectKeywords);
    const submissionStatus = useSelector(selectSubmissionStatus);
    const enterpriseInfo = useSelector(selectCurrentEnterprise);
    
    const maxLength = 400;

    // 리뷰 텍스트가 10자 이상인지 확인
    const isReviewValid = reviewText.trim().length >= 10;

    const handleReviewChange = (e) => {
        const text = e.target.value;
        if (text.length <= maxLength) {
            dispatch(setReviewText(text));
        }
    };

    const handleSubmit = () => {
        if (isReviewValid) {
            // 리뷰 데이터 준비
            dispatch(prepareReviewData({
                enterpriseInfo,
                keywords: selectedKeywords
            }));

            // 여기에 백엔드 제출 로직 추가 예정
            console.log('리뷰 제출:', {
                enterpriseInfo,
                keywords: selectedKeywords,
                reviewText,
                createdAt: new Date().toISOString()
            });

            // 성공 시 다음 페이지로 이동 (예시)
            // navigate('/success-page');
        }
    };

    // 키워드가 없으면 이전 페이지로 리다이렉트
    useEffect(() => {
        if (!selectedKeywords || selectedKeywords.length === 0) {
            navigate('/mypage/review/keyword');
        }
    }, [selectedKeywords, navigate]);

    return (
        <div className={styles.container}>
            <div className={styles.reviewInfo}>
                <div className={styles.enterpriseIcon}></div>
                <div className={styles.reviewMetadata}>
                    <div className={styles.enterpriseName}>
                        {enterpriseInfo?.name || '기업 이름'}
                    </div>
                    <div className={styles.reviewDate}>
                        작성일: {new Date().toLocaleDateString()}
                    </div>
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
                    <div key={category} className={styles.keywordList}>
                        <p className={styles.category}>{category}</p>
                        {keywords.map((keyword, index) => (
                            <span key={index} className={styles.keyword}>{keyword}</span>
                        ))}
                    </div>
                ))}
            </div>
            <div className={styles.reviewBox}>
                <textarea
                    value={reviewText}
                    onChange={handleReviewChange}
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
                disabled={!isReviewValid || submissionStatus === 'loading'}
                aria-label={isReviewValid ? "리뷰 등록하기" : "리뷰를 작성해주세요"}
            >
                {submissionStatus === 'loading' ? '등록 중...' : '등록하기'}
            </button>
        </div>
    );
}

export default ReviewWrite;