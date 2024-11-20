// Mypage.jsx
import React, { useState, useEffect } from 'react';
import styles from '../../styles/mypage/Mypage.module.css';
import TopBar from '../../components/layout/TopBar';

function Mypage() {
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // 현재는 더미데이터를 불러오지만, 나중에 백엔드 API로 대체될 부분
        const fetchUserInfo = async () => {
            try {
                const response = await fetch('/dummyData/userDummyData.json');
                const data = await response.json();
                setUserData(data[0]); // 현재는 더미데이터의 첫 번째 유저
                
                // 나중에는 이렇게 될 것입니다:
                // const response = await fetch('/api/user/info', {
                //     headers: {
                //         'Authorization': `Bearer ${accessToken}`,
                //     }
                // });
                // const data = await response.json();
                // setUserData(data);
                
            } catch (error) {
                console.error('사용자 정보 로드 실패:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserInfo();
    }, []);

    if (isLoading || !userData) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.container}>
            <TopBar/>
            <div className={styles.header}>
                <div className={styles.profile}>
                    <div className={styles.userProfile}></div>
                    <div className={styles.userInfo}>
                        <div className={styles.userInfoRow1}>
                            <span className={styles.userName}>{userData.username}</span>
                            <span className={styles.userAge}>{userData.age}세</span>
                        </div>
                        <div className={styles.userInfoRow2}>
                            <span className={styles.reviewLabel}>리뷰</span>
                            <span className={styles.reviewCount}>{userData.reviews.length}</span>
                        </div>
                    </div>
                </div>
                <div className={styles.manageBtnContainer}>
                    <button className={styles.profileManageBtn}>프로필관리</button>
                    <button className={styles.accountSettingBtn}>계정설정</button>
                </div>
            </div>
        </div>
    );
}

export default Mypage;