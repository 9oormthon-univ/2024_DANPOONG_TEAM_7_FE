import React, { useEffect }from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/home/Home.module.css';
import KakaoMap from '../../components/enterprise/KakaoMap';
import FlipCard from '../../components/home/FlipCard';
import TopBar from '../../components/layout/TopBar';
import LoadingSpinner from '../../components/layout/LoadingSpinner';

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
                <div className={styles.headerContent}>
                    <img src={Logo} alt='soenter logo' className={styles.Logo}/>
                    <p className={styles.comment}>{profile?.name}님!</p>
                    <p className={styles.comment}>오늘은 어떤 기업을 방문하시겠어요?</p>
                </div>
            </div>
            <div className={styles.mapSection}>

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