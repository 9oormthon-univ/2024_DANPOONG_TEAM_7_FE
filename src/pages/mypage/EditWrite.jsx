import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setReviewContent } from '../../redux/slices/EditSlice';
import styles from '../../styles/mypage/EditWrite.module.css';
import TopBar from '../../components/layout/TopBar';

function EditWrite() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { selectedKeywords, reviewContent } = useSelector(state => state.edit);
    
    const [reviewText, setReviewText] = useState('');
    const [submissionStatus, setSubmissionStatus] = useState('idle');
    const maxLength = 400;

    useEffect(() => {
        // selectedKeywords가 없으면 이전 페이지로 리다이렉트
        if (!selectedKeywords) {
            navigate('/mypage/review/editkeyword');
            return;
        }
    }, [selectedKeywords, navigate]);

    const handleReviewChange = (e) => {
        const text = e.target.value;
        setReviewText(text);
        dispatch(setReviewContent(text));
    };

    const isReviewValid = reviewText.trim().length > 0;

    const handleSubmit = () => {
        if (isReviewValid) {
            setSubmissionStatus('loading');
            navigate('/mypage');
        }
    };

    // selectedKeywords가 없으면 렌더링하지 않음
    if (!selectedKeywords) {
        return null;
    }

    // 키워드를 카테고리별로 그룹화
    const groupedKeywords = selectedKeywords.reduce((acc, {keyword, category}) => {
        if (!acc[category]) acc[category] = [];
        acc[category].push(keyword);
        return acc;
    }, {});

    return (
        <div className={styles.container}>
            <TopBar/>
            <TopBar/>
            <div className={styles.reviewInfo}>
                <div className={styles.enterpriseIcon}></div>
                <div className={styles.reviewMetadata}>
                    <p>기업이름</p>
                    <p>사회서비스제공형</p>
                    <p>작성일: {new Date().toLocaleDateString()}</p>
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
                <p>000님이 선택한 키워드는</p>
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

export default EditWrite;