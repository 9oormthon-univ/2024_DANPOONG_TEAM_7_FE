// Mypage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useSelector } from 'react-redux';
import styles from '../../styles/mypage/Mypage.module.css';
import TopBar from '../../components/layout/TopBar';
import ReviewSlider from '../../components/mypage/ReviewSlider';
import MyEnterpriseList from '../../components/mypage/MyEnterpriseList';
import EnterpriseReviewModal from '../../components/mypage/EnterpriseReviewModal';

//hooks
import { useProfile } from '../../hooks/useProfile';
import { useMyReviews } from '../../hooks/useMyReviews';
import { useBookmarks } from '../../hooks/useBookmarks';
import { useVisitedEnterprises } from '../../hooks/useVisitedEnterprises';
import { useEnterprises } from '../../hooks/useEnterprises';

//utils
import { calculateAge } from '../../utils/calculateAge';

function Mypage() {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { fetchEnterprises } = useEnterprises();
    const enterprises = useSelector(state => state.enterprise.socialEnterprises);    
    const { 
        profile, 
        loading: profileLoading, 
        error: profileError 
    } = useProfile();
    
    const { 
        bookmarks, 
        loading: bookmarkLoading, 
        error: bookmarkError 
    } = useBookmarks();

    const { 
        reviews, 
        loading: reviewLoading, 
        error: reviewError 
    } = useMyReviews();

    const handleReviewClick = () => {
        fetchEnterprises();
        setIsModalOpen(true);
    };

    if (profileLoading || bookmarkLoading || reviewLoading) {
        return <div>Loading...</div>;
    }
    
    if (profileError || bookmarkError || reviewError) {
        return <div>사용자 정보를 불러오는데 실패했습니다.</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.TopBar}></div>
            <div className={styles.header}>
                <div className={styles.profile}>
                    <div className={styles.userProfile}></div>
                    <div className={styles.userInfo}>
                        <div className={styles.userInfoRow1}>
                            <span className={styles.userName}>{profile.name}</span>
                            <span className={styles.userAge}>{calculateAge(profile.birth)}세</span>
                        </div>
                        <div className={styles.userInfoRow2}>
                            <span className={styles.reviewLabel}>나의 리뷰</span>
                            <span className={styles.reviewCount}>{reviews.length}</span>
                        </div>
                    </div>
                </div>
                <div className={styles.manageBtnContainer}>
                    <button className={styles.profileManageBtn}>
                        프로필관리
                    </button>
                    <button className={styles.accountSettingBtn}>
                        계정설정
                    </button>
                </div>
            </div>
            <div className={styles.reviewContainer}>
                <div className={styles.reviewHeader}>
                    <div className={styles.myReview}>
                        <span>나의 리뷰</span>
                        <span>{reviews.length}</span>
                    </div>
                    <button 
                        className={styles.reviewBtn}
                        onClick={handleReviewClick}
                    >
                        리뷰쓰기
                    </button>
                </div>
                <ReviewSlider
                    items={reviews}
                />
            </div>
            <div className={styles.bookmarkContainer}>
                <div className={styles.bookmarkHeader}>
                    <div className={styles.myReview}>
                        <span>내가 찜한 기업들</span>
                        <span>{bookmarks.length}</span>
                    </div>
                </div>
                <div className={styles.bookmarkList}>
                    <MyEnterpriseList
                        items={bookmarks}
                    />
                </div>
            </div>
            <EnterpriseReviewModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                enterprises={enterprises}
            />
        </div>
    );
}

export default Mypage;