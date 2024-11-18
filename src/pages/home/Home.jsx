//Home.jsx
import React, { useState, useEffect } from 'react';
import styles from '../../styles/home/Home.module.css';
import FlipCard from '../../components/home/FlipCard';
import TopBar from '../../components/layout/TopBar';

import Logo from '../../assets/images/home/soenter-logo.svg';

function Home() {
    const [userInfo, setUserInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // 현재는 더미데이터를 불러오지만, 나중에 백엔드 API로 대체될 부분
        const fetchUserInfo = async () => {
            try {
                const response = await fetch('/dummyData/userDummyData.json');
                const data = await response.json();
                setUserInfo(data[0]); // 현재는 더미데이터의 첫 번째 유저
                
                // 나중에는 이렇게 될 것입니다:
                // const response = await fetch('/api/user/info', {
                //     headers: {
                //         'Authorization': `Bearer ${accessToken}`,
                //     }
                // });
                // const data = await response.json();
                // setUserInfo(data);
                
            } catch (error) {
                console.error('사용자 정보 로드 실패:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserInfo();
    }, []);

    // 로딩 중일 때 보여줄 화면
    if (isLoading) {
        return <div className={styles.loading}>로딩 중...</div>;
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
                >
                    <div className={styles.map}>
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