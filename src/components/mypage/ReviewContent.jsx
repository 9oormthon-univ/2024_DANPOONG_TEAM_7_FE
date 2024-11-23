import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useEdit } from '../../contexts/EditContext';
import styles from '../../styles/mypage/review/ReviewContent.module.css';

//utils
import { formatCompanyName } from '../../utils/companyNameUtils';
import { formatAddress } from '../../utils/formatAddress';
import { formatDateWithShortDots } from '../../utils/formatDate';

//img
import manageIcon from '../../assets/images/mypage/myenterprise-detail.svg';
import editIcon from '../../assets/images/mypage/edit-pencil.svg';
import deleteOn from '../../assets/images/mypage/deleteon.svg';
import deleteOff from '../../assets/images/mypage/deleteoff.svg';

const isCompanyNameOverflow = (companyName) => {
    if (!companyName) return false;
    return companyName.length > 10; // 10자 이상이면 overflow로 간주
};

const ReviewContent = ({ reviews }) => {
    console.log('ReviewContent에서 받은 reviews:', reviews);
    const navigate = useNavigate();
    const { setCurrentReview, clearEditData } = useEdit();
    const [selectedModalId, setSelectedModalId] = useState(null);
    const [clickedDeleteId, setClickedDeleteId] = useState(null);

    // 리뷰를 월별로 그룹화하는 함수
    const groupReviewsByMonth = (reviews) => {
        if (!Array.isArray(reviews)) return {};
        
        return reviews.reduce((groups, review) => {
            if (!review.createAt) return groups;  // date 대신 createAt 사용
    
            try {
                const date = new Date(review.createAt);
                if (isNaN(date.getTime())) return groups;
                
                const monthYear = `${date.getMonth() + 1}월`;
    
                if (!groups[monthYear]) {
                    groups[monthYear] = [];
                }
    
                groups[monthYear].push(review);
                return groups;
            } catch (error) {
                console.error('날짜 처리 중 오류 발생:', error);
                return groups;
            }
        }, {});
    };

    const handleManageClick = (month, index, e) => {
        e.stopPropagation();
        const modalId = `${month}-${index}`;
        setSelectedModalId(selectedModalId === modalId ? null : modalId);
        setClickedDeleteId(null);
    };

    const handleDeleteMouseDown = (month, index) => {
        setClickedDeleteId(`${month}-${index}`);
    };

    const handleDeleteClick = (month, index, e) => {
        e.stopPropagation();
        setClickedDeleteId(`${month}-${index}`);
    };
    
    const handleEditClick = (e, review) => {
        e.stopPropagation();
        setSelectedModalId(null);
        
        // 먼저 이전 편집 상태를 초기화
        clearEditData();
        
        // 약간의 딜레이 후 새로운 리뷰 데이터 설정
        setTimeout(() => {
            setCurrentReview(review);
            navigate('/mypage/review/editkeyword');
        }, 0);
    };
    
    const groupedReviews = groupReviewsByMonth(reviews);
    const sortedMonths = Object.keys(groupedReviews).sort((a, b) => {
        const dateA = new Date(a.replace('년 ', '-').replace('월', ''));
        const dateB = new Date(b.replace('년 ', '-').replace('월', ''));
        return dateB - dateA;
    });
    console.log('그룹화된 리뷰:', groupedReviews);
    console.log('정렬된 월:', sortedMonths);
    return (
        <div className={styles.container}>
        <div className={styles.reviewSection}>
            <div className={styles.reviewHistory}>
                <div className={styles.reviewBar}>
                    <div className={styles.reviewCount}>
                        <span>전체</span>
                        <span>{reviews.length || 0}</span>
                    </div>
                    <button className={styles.reviewArray}>최신순</button>
                </div>
                <div className={styles.reviewTimeline}>
                    {sortedMonths.map((month) => (
                        <div key={month} className={styles.reviewHistoryContent}>
                            <div className={styles.monthlyVisit}>
                                <p className={styles.monthlyVisitText}>{month} 방문</p>
                            </div>
                            <div className={styles.reviewsContainer}>
                                {groupedReviews[month].map((review, index) => {
                                    const { front, back } = formatCompanyName(review.enterpriseName);
                                    const isOverflow = isCompanyNameOverflow(review.enterpriseName);
                                    const modalId = `${month}-${index}`;
                                    const remainingKeywords = review.keywords ? review.keywords.length - 1 : 0;
                                    
                                    return (
                                        <div 
                                            key={modalId}
                                            className={styles.itemCard}
                                        >
                                            <div className={styles.reviewInfo}>
                                                <div className={styles.reviewTitle}>
                                                    <p>{front}</p>
                                                    {isOverflow && <p>{back}</p>}
                                                </div>
                                                <div className={styles.reviewDate}>{formatDateWithShortDots(review.createAt)}</div>
                                                <button 
                                                className={styles.manageBtn}
                                                onClick={(e) => handleManageClick(month, index, e)}
                                                >
                                                <img src={manageIcon} alt='manage icon' className={styles.manageIcon}/>
                                                </button>
                                                {selectedModalId === modalId && (
                                                    <div className={styles.manageModal}>
                                                        <button 
                                                            className={styles.editBtn} 
                                                            onClick={(e) => handleEditClick(e, review)}
                                                        >
                                                            <div className={styles.editLabel}>수정</div>
                                                            <img src={editIcon} alt='edit pencil' className={styles.editIcon}/>
                                                        </button>
                                                        <button 
                                                        className={`${styles.deleteBtn} ${clickedDeleteId === modalId ? styles.deleteActive : ''}`}
                                                        onClick={(e) => handleDeleteClick(month, index, e)}
                                                        onMouseDown={() => handleDeleteMouseDown(month, index)}
                                                        >
                                                            <div 
                                                                className={`${styles.deleteLabel} ${clickedDeleteId === modalId ? styles.deleteLabelActive : ''}`}
                                                            >
                                                            삭제
                                                            </div>
                                                            <img 
                                                                src={clickedDeleteId === modalId ? deleteOn : deleteOff} 
                                                                alt='delete icon' 
                                                                className={styles.deleteIcon}
                                                            />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <p className={styles.reviewAddress}>{formatAddress(review.enterpriseAddress)}</p>
                                            <p className={styles.reviewContent}>{review.content}</p>
                                            <div className={styles.Keyword}>
                                                {review.keywords && review.keywords.length > 0 && (
                                                    <>
                                                    <div className={styles.primaryKeyword}>
                                                        {review.keywords[0].keyword}
                                                    </div>
                                                    {remainingKeywords > 0 && (
                                                        <div className={styles.plusKeyword}>
                                                        +{remainingKeywords}
                                                        </div>
                                                    )}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
    );
};
export default ReviewContent;