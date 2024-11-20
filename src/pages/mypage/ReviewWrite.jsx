//ReviewWrite.jsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/mypage/ReviewWrite.module.css';
import { 
    setReviewText, 
    prepareReviewData,
    clearReviewData,
    selectReviewText,
    selectSubmissionStatus
} from '../../redux/slices/ReviewWriteSlice';
import { selectKeywords, selectCurrentEnterprise } from '../../redux/slices/KeywordSlice';
import TopBar from '../../components/layout/TopBar';

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

            //데이터 초기화
            dispatch(clearReviewData());

            // 성공 시 다음 페이지로 이동
            navigate('/mypage');
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
            <TopBar/>
            <TopBar/>
            <div className={styles.reviewInfo}>
                <div className={styles.enterpriseIcon}></div>
                <div className={styles.reviewMetadata}>
                    <p>{enterpriseInfo?.name || '기업 이름'}</p>
                    <p>사회서비스제공형</p>
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
                <p>000님이 선택한 키워드는</p>
                <p>전체 키워드  15개 중 {selectedKeywords.length}개 입니다!</p>
                    <div className={styles.graphSection}>
                        <div 
                            className={styles.userGraphDegree}
                            style={{ 
                                height: `${Math.min((selectedKeywords.length)/ 15 * 100, 100)}%`,
                            }}
                            //최대 값 리뷰 40개로 설정
                        >
                        </div>
                        <div 
                            className={styles.allGraphDegree}
                            style={{ 
                                height: `${Math.min(15/ 15 * 100, 100)}%`,
                            }}
                            //최대 값 프로그램 40개로 설정
                        >
                        </div>    
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