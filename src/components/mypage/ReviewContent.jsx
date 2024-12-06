import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEdit } from '../../contexts/EditContext';
import axios from '../../api/axiosInstance';
import styles from '../../styles/mypage/review/ReviewContent.module.css';

//utils
import { formatCompanyName } from '../../utils/companyNameUtils';
import { formatAddress } from '../../utils/formatAddress';
import { formatDateWithShortDots } from '../../utils/formatDate';

//img
import alignIcon from '../../assets/images/mypage/align-icon.svg';
import manageIcon from '../../assets/images/mypage/myenterprise-detail.svg';
import editIcon from '../../assets/images/mypage/edit-pencil.svg';
import deleteOn from '../../assets/images/mypage/deleteon.svg';
import deleteOff from '../../assets/images/mypage/deleteoff.svg';

const isCompanyNameOverflow = (companyName) => {
    if (!companyName) return false;
    return companyName.length > 10;
};

const ReviewContent = ({ reviews }) => {
    const navigate = useNavigate();
    const { setCurrentReview, clearEditData } = useEdit();
    const [selectedModalId, setSelectedModalId] = useState(null);
    const [clickedDeleteId, setClickedDeleteId] = useState(null);
    const [sortOrder, setSortOrder] = useState('latest');

    const groupReviewsByMonth = (reviews) => {
        if (!Array.isArray(reviews)) return {};

        // 먼저 리뷰를 날짜 기준으로 정렬
        const sortedReviews = [...reviews].sort((a, b) => {
            const dateA = new Date(a.createAt);
            const dateB = new Date(b.createAt);
            // sortOrder에 따라 정렬 순서 변경
            return sortOrder === 'latest' ? dateB - dateA : dateA - dateB;
        });

        // 정렬된 리뷰를 월별로 그룹화
        return sortedReviews.reduce((groups, review) => {
            if (!review.createAt) return groups;

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

    const handleDeleteClick = async (month, index, e, review) => {
        e.stopPropagation();
        try {
            await axios.delete(`/api/reviews/${review.reviewId}`);
            window.location.reload();
        } catch (err) {
            console.error('리뷰 삭제 실패:', err);
            if (err.response?.status === 401) {
                return;
            }
        }
    };

    const handleEditClick = (e, review) => {
        e.stopPropagation();        
        setSelectedModalId(null);
        clearEditData();

        setTimeout(() => {
            setCurrentReview(review);
            navigate('/mypage/review/editkeyword', { state: { review } });
        }, 0);
    };

    const toggleSortOrder = () => {
        setSortOrder(prevOrder => prevOrder === 'latest' ? 'oldest' : 'latest');
    };

    const groupedReviews = groupReviewsByMonth(reviews);
    // 월도 정렬
    const sortedMonths = Object.keys(groupedReviews).sort((a, b) => {
        const monthA = parseInt(a);
        const monthB = parseInt(b);
        return sortOrder === 'latest' ? monthB - monthA : monthA - monthB;
    });

    return (
        <div className={styles.container}>
            <div className={styles.reviewSection}>
                <div className={styles.reviewHistory}>
                    <div className={styles.reviewBar}>
                        <div className={styles.reviewCount}>
                            <span>전체</span>
                            <span>{reviews.length || 0}</span>
                        </div>
                        <button 
                            className={styles.reviewArray}
                            onClick={toggleSortOrder}
                        >
                            <p>{sortOrder === 'latest' ? '최신순' : '오래된순'}</p>
                            <img 
                                src={alignIcon} 
                                alt='align icon' 
                                className={`${styles.alignIcon} ${sortOrder === 'oldest' ? styles.rotate180 : ''}`}
                            />
                        </button>
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
                                                        <img src={manageIcon} alt='manage icon' className={styles.manageIcon} />
                                                    </button>
                                                    {selectedModalId === modalId && (
                                                        <div className={styles.manageModal}>
                                                            <button
                                                                className={styles.editBtn}
                                                                onClick={(e) => handleEditClick(e, review)}
                                                            >
                                                                <div className={styles.editLabel}>수정</div>
                                                                <img src={editIcon} alt='edit pencil' className={styles.editIcon} />
                                                            </button>
                                                            <button
                                                                className={`${styles.deleteBtn} ${clickedDeleteId === modalId ? styles.deleteActive : ''}`}
                                                                onClick={(e) => handleDeleteClick(month, index, e, review)}
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