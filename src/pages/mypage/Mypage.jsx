// Mypage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useUserInfo } from '../../hooks/useUserInfo';
import styles from '../../styles/mypage/Mypage.module.css';
import TopBar from '../../components/layout/TopBar';
import ReviewSlider from '../../components/mypage/ReviewSlider';
import MyEnterpriseList from '../../components/mypage/MyEnterpriseList';

function Mypage() {
    const navigate = useNavigate();
    const { userInfo: userData, loading: isLoading, error } = useUserInfo();

    const handleReviewClick = () => {
        navigate('/mypage/review/keyword');
    };

    const handleProfileManageClick = () => {
        navigate('/mypage/profile');
    };

    const handleAccountSettingClick = () => {
        navigate('/mypage/account');
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>사용자 정보를 불러오는데 실패했습니다.</div>;
    }

    if (!userData) {
        return <div>사용자 정보가 없습니다.</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.TopBar}></div>
            <div className={styles.header}>
                <div className={styles.profile}>
                    <div className={styles.userProfile}></div>
                    <div className={styles.userInfo}>
                        <div className={styles.userInfoRow1}>
                            <span className={styles.userName}>{userData.username}</span>
                            <span className={styles.userAge}>{userData.age}세</span>
                        </div>
                        <div className={styles.userInfoRow2}>
                            <span className={styles.reviewLabel}>나의 리뷰</span>
                            <span className={styles.reviewCount}>{userData.reviews.length}</span>
                        </div>
                    </div>
                </div>
                <div className={styles.manageBtnContainer}>
                    <button 
                        className={styles.profileManageBtn}
                        onClick={handleProfileManageClick}
                    >
                        프로필관리
                    </button>
                    <button 
                        className={styles.accountSettingBtn}
                        onClick={handleAccountSettingClick}
                    >
                        계정설정
                    </button>
                </div>
            </div>
            <div className={styles.reviewContainer}>
                <div className={styles.reviewHeader}>
                    <div className={styles.myReview}>
                        <span>나의 리뷰</span>
                        <span>{userData.reviews.length}</span>
                    </div>
                    <button 
                        className={styles.reviewBtn}
                        onClick={handleReviewClick}
                    >
                        리뷰쓰기
                    </button>
                </div>
                <ReviewSlider
                    items={userData}
                />
            </div>
            <div className={styles.bookmarkContainer}>
                <div className={styles.bookmarkHeader}>
                    <div className={styles.myReview}>
                        <span>내가 찜한 기업들</span>
                        <span>{userData.favorites.length}</span>
                    </div>
                </div>
                <div className={styles.bookmarkList}>
                    <MyEnterpriseList
                        items={userData.favorites}
                    />
                </div>
            </div>
        </div>
    );
}

export default Mypage;