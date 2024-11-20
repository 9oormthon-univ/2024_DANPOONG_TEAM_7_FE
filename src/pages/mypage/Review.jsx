// Mypage.jsx
import React, { useState, useEffect } from 'react';
import styles from '../../styles/mypage/Review.module.css';
import TopBar from '../../components/layout/TopBar';
import Back from '../../components/layout/Back';
import ReviewContent from '../../components/mypage/ReviewContent';
import pencil from '../../assets/images/mypage/pencil.svg';

function Review() {
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
            <div className={styles.topBar}>
                <Back/>
                <p>나의 리뷰내역</p>
            </div>
            <div className={styles.content}>
                <ReviewContent 
                    reviews={userData.reviews}
                    favorites={userData.favorites}
                    programs={userData.program}
                /> 
            </div>
            <button className={styles.writeBtn}>
                <img src={pencil} alt='pencil' className={styles.pencil}/>
            </button>
        </div>
    );
}

export default Review;