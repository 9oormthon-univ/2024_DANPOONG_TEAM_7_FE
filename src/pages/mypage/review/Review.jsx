// Mypage.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styles from '../../../styles/mypage/review/Review.module.css';
import TopBar from '../../../components/layout/TopBar';
import Back from '../../../components/layout/Back';
import ReviewContent from '../../../components/mypage/ReviewContent';
import EnterpriseReviewModal from '../../../components/mypage/EnterpriseReviewModal';

//hooks
import { useMyReviews } from '../../../hooks/useMyReviews';

//기업정보
import { fetchEnterprises } from '../../../redux/slices/EnterpriseSlice';


//img
import pencil from '../../../assets/images/mypage/pencil.svg';

function Review() {
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    //기업정보
    const { 
        socialEnterprises: enterprises, 
        isLoading: enterprisesLoading,
        error: enterprisesError 
    } = useSelector(state => state.enterprise);

    const { 
        reviews, 
        loading: reviewLoading, 
        error: reviewError 
    } = useMyReviews();
    console.log('useMyReviews 데이터:', { reviews, reviewLoading, reviewError });

    const handleWriteClick = () => {
        fetchEnterprises(); 
        setIsModalOpen(true);
    };

    return (
        <div className={styles.container}>
            <TopBar/>
            <div className={styles.topBar}>
                <Back/>
                <p>나의 리뷰내역</p>
            </div>
            <div className={styles.content}>
                <ReviewContent 
                    reviews={reviews}
                /> 
            </div>
            <button 
                className={styles.writeBtn}
                onClick={handleWriteClick}
            >
                <img src={pencil} alt='pencil' className={styles.pencil}/>
            </button>
            <EnterpriseReviewModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                enterprises={enterprises}
            />
        </div>
    );
}

export default Review;