// Mypage.jsx
import React, { useState, useEffect } from 'react';//즐겨찾기
import { useNavigate } from 'react-router-dom'; 
import { useSelector, useDispatch } from 'react-redux'; //즐겨찾기
import styles from '../../styles/mypage/Mypage.module.css';
import TopBar from '../../components/layout/TopBar';
import ReviewSlider from '../../components/mypage/ReviewSlider';
import MyEnterpriseList from '../../components/mypage/MyEnterpriseList';
import EnterpriseReviewModal from '../../components/mypage/EnterpriseReviewModal';

//hooks
import { useProfile } from '../../hooks/useProfile';
import { useMyReviews } from '../../hooks/useMyReviews';
import { useBookmarks } from '../../hooks/useBookmarks';

//즐겨찾기
import { fetchVisitedLocations, fetchBookmarkLocations } from '../../redux/slices/VisitedBookmarkSlice';

//기업정보
import { fetchEnterprises } from '../../redux/slices/EnterpriseSlice';

//utils
import { calculateAge } from '../../utils/calculateAge';

//img
import logout from '../../assets/images/mypage/logout.svg';
import profile20 from '../../assets/images/mypage/profile-20.svg';
import profile30 from '../../assets/images/mypage/profile-30.svg';
import AdminComponent from '../../components/mypage/admin/AdminComponent';

function Mypage() {
    const dispatch = useDispatch(); //즐겨찾기
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    //즐겨찾기
    const { bookmarkLocations, isLoading: bookmarkLoading, error: bookmarkError } = useSelector(state => state.visitedBookmark);
    
    //기업정보
    const { 
        socialEnterprises: enterprises, 
        isLoading: enterprisesLoading,
        error: enterprisesError 
    } = useSelector(state => state.enterprise);


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

    const handleReviewClick = () => {
        dispatch(fetchEnterprises());
        setIsModalOpen(true);
    };

    useEffect(() => {
        dispatch(fetchBookmarkLocations());
    }, [dispatch]); //즐겨찾기

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
                    <div className={styles.userProfile}>
                    <img 
                        src={calculateAge(profile.birth) >= 30 ? profile30 : profile20}
                        alt="profile" 
                        className={styles.profileImage}
                    />
                    </div>
                    <div className={styles.userInfo}>
                        <div className={styles.userInfoRow1}>
                            <span className={styles.userName}>{profile.name}</span>
                            <span className={styles.userAge}>{calculateAge(profile.birth) >= 30 ? '삼공이' : '이공이'}</span>
                            <button className={styles.logoutBtn}>
                                <img
                                    src={logout}
                                    alt='logout'
                                    className={styles.logoutIcon}
                                />
                            </button>
                        </div>
                        <div className={styles.userInfoRow2}>
                            <span className={styles.reviewLabel}>나의 리뷰</span>
                            <span className={styles.reviewCount}>{reviews.length}</span>
                        </div>
                    </div>
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
                        <span>{bookmarkLocations.length}</span> {/*즐겨찾기*/}
                    </div>
                </div>
                <div className={styles.bookmarkList}>
                    <MyEnterpriseList
                        items={bookmarkLocations} //즐겨찾기
                    />
                </div>
            </div>
            {/* todo: user 권한 받기 */}
            <AdminComponent isAdmin={true} />            
            <EnterpriseReviewModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                enterprises={enterprises}
            />
        </div>
    );
}

export default Mypage;