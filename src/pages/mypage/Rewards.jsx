import React, { useEffect }from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/mypage/Rewards.module.css';
import RewardsCard from '../../components/mypage/RewardsCard';
import LoadingSpinner from '../../components/layout/LoadingSpinner';
import Back from '../../components/layout/Back';

//hooks
import { useProfile } from '../../hooks/useProfile';
import { useMyReviews } from '../../hooks/useMyReviews';

function Rewards() {
    const navigate = useNavigate();
    const { 
        profile, 
        loading: profileLoading, 
        error: profileError 
    } = useProfile();

    const { 
        reviews, 
        loading: reviewLoading, 
        error: reviewError 
    } = useMyReviews();

    const handleReviewClick = (review) => {
        console.log('선택된 리뷰:', review);
    };

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        console.log('홈 화면 토큰 상태:', token);
        
        if (!token) {
          console.log('토큰이 없어 로그인 페이지로 이동');
          navigate('/', { replace: true });
        }
      }, [navigate]);

    if (profileLoading || reviewLoading) {
        return <div className={styles.loading}><LoadingSpinner/></div>;
    }

    if (profileError || reviewError) {
        return <div className={styles.error}>데이터를 불러오는데 실패했습니다.</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.topBar}></div>
            <div className={styles.header}>
                <Back/>
                <p>리워드</p>
            </div>
            <div className={styles.content}>
                <div className={styles.card}>
                    <RewardsCard
                        profile={profile}
                        reviews={reviews}
                        onItemClick={handleReviewClick}
                    />
                </div>
            </div>
        </div>
    );
}

export default Rewards;