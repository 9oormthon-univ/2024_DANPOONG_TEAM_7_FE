// ReviewKeyword.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSelectedKeywords } from '../../redux/slices/KeywordSlice';
import styles from '../../styles/mypage/ReviewKeyword.module.css';
import KeywordSlider from '../../components/mypage/KeywordSlider';
import backgroundLime from '../../assets/images/mypage/background/lime.svg';
import backgroundBlue from '../../assets/images/mypage/background/blue.svg';
import Back from '../../components/layout/Back';

function ReviewKeyword() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [selectedKeywordSet, setSelectedKeywordSet] = useState(new Set());
    const [keywordInfo, setKeywordInfo] = useState([]);

    const handleKeywordsChange = (newKeywords, newKeywordInfo) => {
        setSelectedKeywordSet(newKeywords);
        setKeywordInfo(newKeywordInfo);
    };

    const handleNextClick = () => {
        if (selectedKeywordSet.size > 0) {
            dispatch(setSelectedKeywords(keywordInfo));
            navigate('/mypage/review/write');
        }
    };

    // 키워드가 1개 이상 선택되었는지 확인
    const isNextEnabled = selectedKeywordSet.size > 0;

    return (
        <div className={styles.container}>
            <Back/>
            <div className={styles.headerBar}></div>
            <div className={styles.headerBackground}>
                <img 
                    src={backgroundBlue} 
                    alt='review background' 
                    className={styles.reviewBackground}
                />
                <div className={styles.headerSection}>
                    <div className={styles.enterpriseIcon}></div>
                    <p className={styles.enterpriseName}>주식회사꿈꾸는세상</p>
                    <p className={styles.enterpriseType}>사회서비스제공형</p>
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
                aria-label={isNextEnabled ? "다음 페이지로 이동" : "키워드를 선택해주세요"}
            >
                다음으로
            </button>           
        </div>
    );
}

export default ReviewKeyword;