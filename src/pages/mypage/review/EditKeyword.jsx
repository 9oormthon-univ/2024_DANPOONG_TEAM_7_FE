import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '../../../styles/mypage/review/EditKeyword.module.css';
import EditKeywordSlider from '../../../components/mypage/EditKeywordSlider';
import { useEdit } from '../../../contexts/EditContext';
import Back from '../../../components/layout/Back';

//img
import pencil from '../../../assets/images/mypage/red-pencil.svg';
import employIcon from '../../../assets/images/enterprise-icons/employment-icon.svg';
import communityIcon from '../../../assets/images/enterprise-icons/local-community-icon.svg';
import mixedIcon from '../../../assets/images/enterprise-icons/mixed-type-icon.svg';
import otherIcon from '../../../assets/images/enterprise-icons/other-creative-icon.svg';
import serviceIcon from '../../../assets/images/enterprise-icons/service-icon.svg';

function EditKeyword() {
    const navigate = useNavigate();
    const location = useLocation();
    const { 
        setSelectedKeywords, 
        currentReview,
        setCurrentReview 
    } = useEdit();
    
    const [selectedKeywordSet, setSelectedKeywordSet] = useState(new Set());
    const [keywordInfo, setKeywordInfo] = useState([]);

    // 기업 유형에 따른 아이콘 매핑
    const enterpriseIcons = {
        '사회서비스제공형': serviceIcon,
        '일자리제공형': employIcon,
        '지역사회공헌형': communityIcon,
        '혼합형': mixedIcon,
        '기타(창의ㆍ혁신)형': otherIcon
    };

    useEffect(() => {
        if (!currentReview) {
            const reviewData = location.state?.reviewData;
            if (reviewData) {
                setCurrentReview(reviewData);
            } else {
                navigate('/mypage/review');
            }
        }
    }, []);

    const handleKeywordsChange = (newKeywords, newKeywordInfo) => {
        console.log('Keywords changed:', newKeywords, newKeywordInfo);
        setSelectedKeywordSet(newKeywords);
        setKeywordInfo(newKeywordInfo);
        setSelectedKeywords(newKeywordInfo);
    };

    const handleNextClick = () => {
        if (selectedKeywordSet.size > 0) {
            navigate('/mypage/review/editwrite');
        }
    };

    if (!currentReview) {
        return <div className={styles.container}>Loading...</div>;
    }

    // 현재 기업 유형에 맞는 아이콘 가져오기
    const currentIcon = enterpriseIcons[currentReview.socialPurpose] || otherIcon;

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
                    <img 
                        src={currentIcon} 
                        alt={currentReview.socialPurpose} 
                        className={styles.enterpriseIcon}
                    />
                    <p className={styles.enterpriseName}>{currentReview.enterpriseName}</p>
                    <p className={styles.enterpriseType}>
                        {currentReview.socialPurpose || "기업유형"}
                    </p>
                    <p className={styles.commentBig}>어떤 점이 좋았나요?</p>
                    <p className={styles.commentSmall}>기업에 어울리는 키워드를 골라주세요!</p>
                </div>
            </div>
            <div className={styles.engagementsSection}>
                <EditKeywordSlider 
                    onKeywordsChange={handleKeywordsChange}
                    initialKeywords={currentReview.tagNumbers}
                />
            </div>
            <button
                className={styles.nextBtn}
                onClick={handleNextClick}
                disabled={!selectedKeywordSet.size}
            >
                다음으로
            </button>           
        </div>
    );
}

export default EditKeyword;