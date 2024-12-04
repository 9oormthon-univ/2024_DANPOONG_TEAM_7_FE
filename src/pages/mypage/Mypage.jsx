import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/mypage/Mypage.module.css';
import TopBar from '../../components/layout/TopBar';
import ReviewSlider from '../../components/mypage/ReviewSlider';
import MyEnterpriseList from '../../components/mypage/MyEnterpriseList';
import EnterpriseReviewModal from '../../components/mypage/EnterpriseReviewModal';
import LoadingSpinner from '../../components/layout/LoadingSpinner';
import axiosInstance from '../../api/axiosInstance';

// Contexts
import { useEnterprise } from '../../contexts/EnterpriseContext';
import { useVisitBookmark } from '../../contexts/VisitBookmarkContext';

// hooks
import { useProfile } from '../../hooks/useProfile';
import { useMyReviews } from '../../hooks/useMyReviews';

// utils
import { calculateAge } from '../../utils/calculateAge';

// images
import logout from '../../assets/images/mypage/logout.svg';
import profile20 from '../../assets/images/mypage/profile-20.svg';
import profile30 from '../../assets/images/mypage/profile-30.svg';
import AdminComponent from '../../components/mypage/admin/AdminComponent';
import enterpriseCertificationMark from '../../assets/images/mypage/enterpriseCertificationMark.svg';

function Mypage() {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [enterpriseProfile, setEnterpriseProfile] = useState(null);
    const [enterpriseLoading, setEnterpriseLoading] = useState(false);

    // Context 사용
    const {
        filteredEnterprises: enterprises,
        isLoading: enterprisesLoading,
        error: enterprisesError,
        fetchEnterprises
    } = useEnterprise();

    const {
        bookmarkLocations,
        isLoading: bookmarkLoading,
        error: bookmarkError,
        fetchBookmarkLocations
    } = useVisitBookmark();

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

    const handleReviewClick = async () => {
        setIsModalOpen(true);
        // 경기 전체 기업 목록 가져오기
        await fetchEnterprises({
            region: '경기',
            cities: ['전체'],
            isReviewMode: true
        });
    };

    useEffect(() => {
        const fetchEnterpriseData = async () => {
            if (profile && profile.userRole === 'ENTERPRISE') {
                setEnterpriseLoading(true);
                try {
                    const response = await axiosInstance.get('/api/users/enterprise');                    
                    console.log(response.result);
                    setEnterpriseProfile(response.result);
                } catch (error) {
                    console.error('기업 정보 로딩 실패:', error);
                } finally {
                    setEnterpriseLoading(false);
                }
            }
        };

        fetchEnterpriseData();
    }, [profile]); 

    // 로딩 상태 처리
    if (profileLoading || bookmarkLoading || reviewLoading || enterprisesLoading || 
        (profile?.userRole === 'ENTERPRISE' && enterpriseLoading)) {
        return (
            <div className={styles.container}>
                <TopBar />
                <div className={styles.profile}></div>
                <div className={styles.reviewContainer}></div>
                <div className={styles.loading}><LoadingSpinner /></div>
                <div className={styles.bookmarkContainer}></div>
            </div>
        );
    }

    // 에러 상태 처리
    if (profileError || bookmarkError || reviewError || enterprisesError) {
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
                            <span className={styles.userAge}>
                                {calculateAge(profile.birth) >= 30 ? '삼공이' : '이공이'}
                            </span>
                            {(profile.userRole != 'ENTERPRISE') &&
                                <button style={{ backgroundColor: '#F3F3F3', color: '#5C5C5C', fontSize: '14px', borderRadius: '18px', position: 'absolute', top: '0', right: '0' }}>
                                    기업 인증 받기
                                </button>
                            }
                            {(profile.userRole == 'ENTERPRISE') &&
                                <img src={enterpriseCertificationMark} alt='enterpriseCertifiactionMark' style={{ position: 'absolute', top: '0', right: '0' }} />
                            }
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
                <ReviewSlider items={reviews} />
            </div>

            <div className={styles.bookmarkContainer}>
                <div className={styles.bookmarkHeader}>
                    <div className={styles.myReview}>
                        <span>내가 찜한 기업들</span>
                        <span>{bookmarkLocations.length}</span>
                    </div>
                </div>
                <div className={styles.bookmarkList}>
                    <MyEnterpriseList items={bookmarkLocations} />
                </div>
            </div>
            
            <AdminComponent enterpriseProfile={enterpriseProfile} profile={profile} />
            <EnterpriseReviewModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                enterprises={enterprises}
            />
            <div style={{ width: '90%', border: 'solid 1px #D9D9D9', borderRadius: '20px', margin: '40px 0 30px 0', padding: '8px 0', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#5C5C5C', fontSize: '14px', fontWeight: '500' }}>
                로그아웃
            </div>
        </div>
    );
}

export default Mypage;