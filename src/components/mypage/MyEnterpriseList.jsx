//MyEnterpriseList.jsx
import React, { useState } from 'react';
import styles from '../../styles/mypage/MyEnterpriseList.module.css';

//utils
import { formatCompanyName, isCompanyNameOverflow } from '../../utils/companyNameUtils';

//img
import manageIcon from '../../assets/images/mypage/myenterprise-detail.svg';
import deleteOn from '../../assets/images/mypage/deleteon.svg';
import deleteOff from '../../assets/images/mypage/deleteoff.svg';
import pinOn from '../../assets/images/mypage/pinon.svg';
import pinOff from '../../assets/images/mypage/pinoff.svg';

//enterprise icon
import employIcon from '../../assets/images/enterprise-icons/employment-icon.svg';
import communityIcon from '../../assets/images/enterprise-icons/local-community-icon.svg';
import mixedIcon from '../../assets/images/enterprise-icons/mixed-type-icon.svg';
import otherIcon from '../../assets/images/enterprise-icons/other-creative-icon.svg';
import serviceIcon from '../../assets/images/enterprise-icons/service-icon.svg';

const MyEnterpriseList = ({ items }) => {
    const [showAll, setShowAll] = useState(false);
    const [selectedManageIndex, setSelectedManageIndex] = useState(null);
    const [clickedDeleteIndex, setClickedDeleteIndex] = useState(null);
    const [pinnedIndex, setPinnedIndex] = useState(null);
    const [enterprises, setEnterprises] = useState(
        items.map((enterprise, index) => ({
            ...enterprise,
            originalIndex: index
        }))
    );

    const handleShowAllClick = () => {
        setShowAll(!showAll);
        // bookmarkContainer의 높이 조절
        const container = document.querySelector(`.${styles.bookmarkContainer}`);
        if (container) {
            container.style.minHeight = !showAll ? '800px' : '400px'; // 예시 높이값
        }
    };

    const handleManageClick = (index) => {
        setSelectedManageIndex(selectedManageIndex === index ? null : index);
        setClickedDeleteIndex(null);
    };

    const handleDeleteMouseDown = (index) => {
        setClickedDeleteIndex(index);
    };

    const handleDeleteClick = (index) => {
        setTimeout(() => {
            setSelectedManageIndex(null);
            setClickedDeleteIndex(null);
            if (index === pinnedIndex) {
                setPinnedIndex(null);
            }
            setEnterprises(prevEnterprises => 
                prevEnterprises.filter((_, i) => i !== index)
            );
        }, 100);
    };

    const handlePinClick = (clickedIndex) => {
        // 이미 고정된 항목을 클릭한 경우
        if (pinnedIndex === clickedIndex) {
            setPinnedIndex(null); // 고정 해제
        } else {
            setPinnedIndex(clickedIndex); // 새로운 항목 고정
        }
        setSelectedManageIndex(null);
    };

    // 정렬된 기업 목록 생성
    const sortedEnterprises = [...enterprises].sort((a, b) => {
        const indexA = enterprises.indexOf(a);
        const indexB = enterprises.indexOf(b);
        
        if (pinnedIndex === indexA) return -1;
        if (pinnedIndex === indexB) return 1;
        return a.originalIndex - b.originalIndex;
    });

    //기업 아이콘
    const getTypeIcon = (socialPurpose) => {
        switch(socialPurpose) {
            case '사회서비스제공형':
                return serviceIcon;
            case '일자리제공형':
                return employIcon;
            case '지역사회공헌형':
                return communityIcon;
            case '혼합형':
                return mixedIcon;
            case '기타(창의ㆍ혁신)형':
                return otherIcon;
            default:
                return serviceIcon; // 기본 아이콘
        }
    };

    return (
        <div className={styles.myEnterpriseListContainer}>
            <div className={styles.myEnterpriseList}>
                {sortedEnterprises.slice(0, showAll ? sortedEnterprises.length : 3).map((enterprise, index) => {
                    const currentIndex = enterprises.indexOf(enterprise);
                    const isPinned = pinnedIndex === currentIndex;
                    const { front, back } = formatCompanyName(enterprise.enterpriseName);
                    const isOverflow = isCompanyNameOverflow(enterprise.enterpriseName);

                    return (
                        <div key={enterprise.originalIndex} className={styles.myEnterpriseItem}>

                            <img 
                                src={getTypeIcon(enterprise.socialPurpose)}
                                alt={enterprise.socialPurpose}
                                className={styles.enterpriseIcon}
                            />
                            <div className={styles.enterpriseInfo}>
                                <p className={styles.myEnterpriseName}>
                                    {front}
                                    {isOverflow && back && (
                                        <>
                                            <br />
                                            {back}
                                        </>
                                    )}
                                </p>
                                <p className={styles.myEnterpriseAddress}>{enterprise.city}</p>
                            </div>
                            <button 
                                className={styles.manageBtn}
                                onClick={() => handleManageClick(currentIndex)}
                            >
                                <img src={manageIcon} alt='manage icon' className={styles.manageIcon}/>
                            </button>
                            {selectedManageIndex === currentIndex && (
                                <div className={styles.manageModal}>
                                    <button 
                                        className={`${styles.deleteBtn} ${clickedDeleteIndex === currentIndex ? styles.deleteActive : ''}`}
                                        onClick={() => handleDeleteClick(currentIndex)}
                                        onMouseDown={() => handleDeleteMouseDown(currentIndex)}
                                    >
                                        <div 
                                            className={`${styles.deleteLabel} ${clickedDeleteIndex === currentIndex ? styles.deleteLabelActive : ''}`}
                                        >
                                            삭제
                                        </div>
                                        <img 
                                            src={clickedDeleteIndex === currentIndex ? deleteOn : deleteOff} 
                                            alt='delete icon' 
                                            className={styles.deleteIcon}
                                        />
                                    </button>
                                    <button 
                                        className={`${styles.pinBtn} ${isPinned ? styles.active : ''}`}
                                        onClick={() => handlePinClick(currentIndex)}
                                    >
                                        <div 
                                            className={`${styles.pinLabel} ${isPinned ? styles.pinLabelActive : ''}`}
                                        >
                                            고정
                                        </div>
                                        <img 
                                            src={isPinned ? pinOn : pinOff} 
                                            alt='pin icon' 
                                            className={styles.pinIcon}
                                        />
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            {sortedEnterprises.length > 4 && (
                <button className={styles.showAllButton} onClick={handleShowAllClick}>
                    {showAll ? '접기' : '더보기'}
                </button>
            )}
        </div>
    );
};

export default MyEnterpriseList;