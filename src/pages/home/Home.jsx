import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/home/Home.module.css';
import KakaoMap from '../../components/enterprise/KakaoMap';
import FlipCard from '../../components/home/FlipCard';
import TopBar from '../../components/layout/TopBar';

//hooks
import { useProfile } from '../../hooks/useProfile';
import { useMyReviews } from '../../hooks/useMyReviews';

//img
import Logo from '../../assets/images/home/soenter-logo.svg';

function Home() {
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

    const handleMapClick = () => {
        navigate('/enterprise');
    };

    const handleReviewClick = (review) => {
        console.log('선택된 리뷰:', review);
    };

    if (profileLoading || reviewLoading) {
        return <div className={styles.loading}>로딩 중...</div>;
    }

    if (profileError || reviewError) {
        return <div className={styles.error}>데이터를 불러오는데 실패했습니다.</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.topBar}></div>
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <img src={Logo} alt='soenter logo' className={styles.Logo}/>
                    <p className={styles.comment}>{profile?.name}님!</p>
                    <p className={styles.comment}>오늘은 어떤 기업을 방문하시겠어요?</p>
                </div>
            </div>
            <div className={styles.mapSection}>
                <button 
                    className={styles.mapView}
                    onClick={handleMapClick}
                >
                    <div className={styles.map}>
                        <KakaoMap/>
                    </div>
                </button>
            </div>
            <div className={styles.content}>
                <div className={styles.card}>
                    <FlipCard
                        profile={profile}
                        reviews={reviews}
                        onItemClick={handleReviewClick}
                    />
                </div>
            </div>
        </div>
    );
}

export default Home;