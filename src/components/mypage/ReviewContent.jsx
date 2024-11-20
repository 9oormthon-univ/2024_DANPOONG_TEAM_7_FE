import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import styles from '../../styles/mypage/ReviewContent.module.css';
import manageIcon from '../../assets/images/mypage/myenterprise-detail.svg';
import deleteOn from '../../assets/images/mypage/deleteon.svg';
import deleteOff from '../../assets/images/mypage/deleteoff.svg';

const ReviewContent = ({ reviews: initialReviews = [] }) => {
    const navigate = useNavigate();
    const [reviews, setReviews] = useState(initialReviews);
    const [selectedModalId, setSelectedModalId] = useState(null);
    const [clickedDeleteId, setClickedDeleteId] = useState(null);

    // 리뷰를 월별로 그룹화하는 함수
    const groupReviewsByMonth = (reviews) => {
        if (!Array.isArray(reviews)) return {};
        
        return reviews.reduce((groups, review) => {
            if (!review.date) return groups;

            try {
                const date = new Date(review.date);
                if (isNaN(date.getTime())) return groups;
                
                const monthYear = `${date.getMonth() + 1}월`;

                if (!groups[monthYear]) {
                    groups[monthYear] = [];
                }

                groups[monthYear].push(review);
                return groups;
            }   catch (error) {
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
        setTimeout(() => {
            setReviews(prevReviews => {
                const newReviews = [...prevReviews];
                const monthReviews = groupReviewsByMonth(newReviews);
                const reviewToDelete = monthReviews[month][index];
                return newReviews.filter(review => review !== reviewToDelete);
            });
            setSelectedModalId(null);
            setClickedDeleteId(null);
        }, 100);
    };

    const handleEditClick = (e) => {
        e.stopPropagation(); // 이벤트 버블링 방지
        setSelectedModalId(null); // 모달 닫기
        navigate('/mypage/review/editkeyword'); // 네비게이션 실행
    };

    const groupedReviews = groupReviewsByMonth(reviews);
    const sortedMonths = Object.keys(groupedReviews).sort((a, b) => {
        const dateA = new Date(a.replace('년 ', '-').replace('월', ''));
        const dateB = new Date(b.replace('년 ', '-').replace('월', ''));
        return dateB - dateA;
    });

    return (
        <div className={styles.container}>
        <div className={styles.reviewSection}>
            <div className={styles.reviewHistory}>
                <div className={styles.reviewBar}>
                    <div className={styles.reviewCount}>
                        <span>전체</span>
                        <span>{reviews?.length || 0}</span>
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
                                    const modalId = `${month}-${index}`;
                                    const remainingKeywords = review.keywords ? review.keywords.length - 1 : 0;
                                    
                                    return (
                                        <div 
                                            key={modalId}
                                            className={styles.itemCard}
                                        >
                                            <div className={styles.reviewInfo}>
                                            <p className={styles.reviewTitle}>{review.company_name}</p>
                                            <div className={styles.reviewDate}>{review.date}</div>
                                            </div>
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
                                                        onClick={handleEditClick}
                                                    >
                                                        <div className={styles.editLabel}>수정</div>
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
                                            <p className={styles.reviewAddress}>경기도 용인시</p>
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