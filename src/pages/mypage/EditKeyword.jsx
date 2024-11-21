// EditKeyword.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import styles from '../../styles/mypage/EditKeyword.module.css';
import { setSelectedKeywords } from '../../redux/slices/EditSlice';
import EditKeywordSlider from '../../components/mypage/EditKeywordSlider';
import Back from '../../components/layout/Back';
import pencil from '../../assets/images/mypage/red-pencil.svg';

function EditKeyword() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [selectedKeywordSet, setSelectedKeywordSet] = useState(new Set());
    const [keywordInfo, setKeywordInfo] = useState([]);

    const handleKeywordsChange = (newKeywords, newKeywordInfo) => {
        setSelectedKeywordSet(newKeywords);
        setKeywordInfo(newKeywordInfo);
    };

    const handleNextClick = () => {
        if (selectedKeywordSet.size > 0) {
            // Redux store에 키워드 정보 저장
            dispatch(setSelectedKeywords(keywordInfo));
            
            // store 업데이트 후 페이지 이동
            setTimeout(() => {
                navigate('/mypage/review/editwrite');
            }, 100);
        }
    };

    console.log('Selected keywords:', keywordInfo);
    console.log('Selected keyword set size:', selectedKeywordSet.size);

    // 키워드가 1개 이상 선택되었는지 확인
    const isNextEnabled = selectedKeywordSet.size > 0;

    return (
        <div className={styles.container}>
            <Back/>
            <div className={styles.headerBar}></div>
            <div className={styles.headerBackground}>
                <div className={styles.headerSection}>
                    <div className={styles.editLabel}>
                        <p>리뷰 수정하기</p>
                        <img src={pencil} alt='pencil' className={styles.pencil}/>
                    </div>
                    <div className={styles.enterpriseIcon}></div>
                    <p className={styles.enterpriseName}>주식회사꿈꾸는세상</p>
                    <p className={styles.enterpriseType}>사회서비스제공형</p>
                    <p className={styles.commentBig}>어떤 점이 좋았나요?</p>
                    <p className={styles.commentSmall}>기업에 어울리는 키워드를 골라주세요!</p>
                </div>
            </div>
            <div className={styles.engagementsSection}>
                <EditKeywordSlider onKeywordsChange={handleKeywordsChange}/>
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

export default EditKeyword;