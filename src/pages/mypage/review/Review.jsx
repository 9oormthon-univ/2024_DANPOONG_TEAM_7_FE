import React, { useState } from 'react';
import styles from '../../../styles/mypage/review/Review.module.css';
import TopBar from '../../../components/layout/TopBar';
import Back from '../../../components/layout/Back';
import ReviewContent from '../../../components/mypage/ReviewContent';
import EnterpriseReviewModal from '../../../components/mypage/EnterpriseReviewModal';
import LoadingSpinner from '../../../components/layout/LoadingSpinner';

// Contexts
import { useEnterprise } from '../../../contexts/EnterpriseContext';

// hooks
import { useMyReviews } from '../../../hooks/useMyReviews';

// images
import pencil from '../../../assets/images/mypage/pencil.svg';

function Review() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);

    // EnterpriseContext 사용
    const { 
        filteredEnterprises: enterprises, 
        isLoading: enterprisesLoading,
        error: enterprisesError,
        fetchEnterprises
    } = useEnterprise();

    // Reviews 데이터
    const { 
        reviews, 
        loading: reviewLoading, 
        error: reviewError 
    } = useMyReviews();

    // 리뷰 작성 버튼 클릭 핸들러
    const handleWriteClick = async () => {
        setModalLoading(true);
        try {
            await fetchEnterprises({
                region: '경기',
                cities: ['전체'],
                isReviewMode: true
            });
            setIsModalOpen(true);
        } catch (error) {
            console.error('기업 데이터 로딩 실패:', error);
        } finally {
            setModalLoading(false);
        }
    };

    // 로딩 상태 처리
    if (reviewLoading) {
        return (
            <div className={styles.container}>
                <TopBar/>
                <div className={styles.topBar}>
                    <Back/>
                    <p>나의 리뷰내역</p>
                </div>
                <div className={styles.loading}><LoadingSpinner/></div>
            </div>
        );
    }

    // 에러 상태 처리
    if (reviewError) {
        return (
            <div className={styles.container}>
                <TopBar/>
                <div className={styles.topBar}>
                    <Back/>
                    <p>나의 리뷰내역</p>
                </div>
                <div className={styles.error}>리뷰를 불러오는데 실패했습니다.</div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <TopBar/>
            <div className={styles.topBar}>
                <Back/>
                <p>나의 리뷰내역</p>
            </div>
            <div className={styles.content}>
                <ReviewContent reviews={reviews} /> 
            </div>
            <button 
                className={styles.writeBtn}
                onClick={handleWriteClick}
            >
                <img src={pencil} alt='pencil' className={styles.pencil}/>
            </button>
            {modalLoading && (
                <div className={styles.loading}>
                    <LoadingSpinner />
                </div>
            )}
            <EnterpriseReviewModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                enterprises={enterprises}
            />
        </div>
    );
}

export default Review;