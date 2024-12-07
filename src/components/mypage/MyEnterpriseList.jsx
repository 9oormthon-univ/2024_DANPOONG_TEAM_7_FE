import React, { useState, useEffect } from 'react';
import { useVisitBookmark } from '../../contexts/VisitBookmarkContext';
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
    const [enterprises, setEnterprises] = useState([]);

    const { 
        bookmarkLocations,
        removeBookmark,
        fetchBookmarkLocations,
        isLoading 
    } = useVisitBookmark();

    useEffect(() => {
        setEnterprises(items.map((enterprise, index) => ({
            ...enterprise,
            originalIndex: index
        })));
    }, [items]);

    const handleShowAllClick = () => {
        setShowAll(!showAll);
        const container = document.querySelector(`.${styles.bookmarkContainer}`);
        if (container) {
            container.style.minHeight = !showAll ? '800px' : '400px';
        }
    };

    const handleManageClick = (index) => {
        setSelectedManageIndex(selectedManageIndex === index ? null : index);
        setClickedDeleteIndex(null);
    };

    const handleDeleteMouseDown = (index) => {
        setClickedDeleteIndex(index);
    };

    const handleDeleteClick = async (enterpriseId) => {
        try {
            await removeBookmark(enterpriseId);
            await fetchBookmarkLocations();
        } catch (error) {
            console.error('북마크 삭제 실패:', error);
        }
        setSelectedManageIndex(null);
    };

    const handlePinClick = (clickedIndex) => {
        setPinnedIndex(pinnedIndex === clickedIndex ? null : clickedIndex);
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

    // 즐겨찾기가 없을 경우 보여줄 메시지
    if (enterprises.length === 0) {
        return (
            <div className={styles.myEnterpriseListContainer}>
                <div className={styles.emptyStateContainer}>
                    <p className={styles.emptyStateMessage}>아직 찜한 기업이 없어요!</p>
                    <p className={styles.emptyStateSubMessage}>
                        기업찾기에서 마음에 드는 기업을 발견하면
                    </p>
                    <p className={styles.emptyStateSubMessage}>
                        북마크를 눌러보세요
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.myEnterpriseListContainer}>
            <div className={styles.myEnterpriseList}>
                {sortedEnterprises.slice(0, showAll ? sortedEnterprises.length : 4).map((enterprise, index) => {
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
                                        onClick={() => handleDeleteClick(enterprise.enterpriseId)} 
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