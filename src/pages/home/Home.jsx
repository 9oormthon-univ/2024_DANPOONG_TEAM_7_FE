//Home.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/home/Home.module.css';
import FlipCard from '../../components/home/FlipCard';
import TopBar from '../../components/layout/TopBar';

import Logo from '../../assets/images/home/soenter-logo.svg';
import KakaoMap from '../../components/enterprise/KakaoMap';
import { useUserInfo } from '../../hooks/useUserInfo';

function Home() {
    const navigate = useNavigate();
    const { userInfo, loading, error } = useUserInfo();
    
    const handleMapClick = () => {
        navigate('/enterprise');
    };


    // 로딩 중일 때 보여줄 화면
    if (loading) {
        return <div className={styles.loading}>로딩 중...</div>;
    }

    if (error) {
        return <div className={styles.error}>사용자 정보를 불러오는데 실패했습니다.</div>;
    }

    return (
        <div className={styles.container}>
            <TopBar/>
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <img src={Logo} alt='soenter logo' className={styles.Logo}/>
                    <p className={styles.comment}>{userInfo?.username}님!</p>
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
                        userInfo={userInfo}
                    />
                </div>            
            </div>
        </div>
    );
}
export default Home;