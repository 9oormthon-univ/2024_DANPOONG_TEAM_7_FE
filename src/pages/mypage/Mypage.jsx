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
import rewardsIcon from '../../assets/images/mypage/rewards/rewards-icon.svg';
import rewardsCommentIcon from '../../assets/images/mypage/rewards/rewards-comment-icon.svg';
import rightArrow from "../../assets/images/mypage/rightArrow.svg"

function Mypage() {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [enterpriseProfile, setEnterpriseProfile] = useState(null);
    const [enterpriseLoading, setEnterpriseLoading] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);

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
        setModalLoading(true);
        try {
            await fetchEnterprises({
                region: '경기',
                cities: ['전체'],
                isReviewMode: true
            });
        } finally {
            setModalLoading(false);
            setIsModalOpen(true);
        }
    };

    const handleAuthClick = (e) => {
        navigate('/mypage/auth');
    };

    const handleRewardsClick = (e) => {
        navigate('/mypage/rewards');
    };

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            fetchBookmarkLocations();
        }
    }, [fetchBookmarkLocations]);

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
    if (profileLoading || bookmarkLoading || reviewLoading ||
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
                                <button
                                    onClick={handleAuthClick} 
                                    style={{ backgroundColor: '#F3F3F3', color: '#5C5C5C', fontSize: '14px', borderRadius: '18px', position: 'absolute', top: '0', right: '0' }}
                                >
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
                    <div className={styles.containerLabel}>
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
            <div className={styles.rewardsContainer}>
                <div className={styles.rewardsHeader}>
                    <div className={styles.containerLabel}>
                        <span>나의 리워드</span>
                        <span>
                            {(() => {
                                // 10개 단위로 완성된 세트 수 계산
                                const completedSets = Math.floor(reviews.length / 10);
                                // 포인트 계산 (1세트당 10,000포인트)
                                const points = completedSets * 10000;
                                // 1000단위 컴마 추가해서 표시
                                return points.toLocaleString() + 'p';
                            })()}
                        </span>
                    </div>
                    <button 
                        className={styles.rewardsBtn}
                        onClick={handleRewardsClick}
                    >
                        <img src={rightArrow} alt="rightArrow"/>
                    </button>
                </div>
                <div className={styles.bigComment}>
                    <p>
                        {(() => {
                            const remaining = 10 - (reviews.length % 10);
                            if (reviews.length % 10 === 0 && reviews.length > 0) {
                                return '축하합니다! 리워드가 지급되었습니다!';
                            }
                            return `리뷰 ${remaining}개 더 쓰면 리워드 지급!`;
                        })()}
                    </p>
                </div>
                <div className={styles.rewardsContent}>
                    <div className={styles.rewardsGraph}>
                        <div 
                            className={styles.rewardsGraphDegree}
                            style={{ 
                                width: (() => {
                                    if (reviews.length === 0) return '0px';
                                    
                                    // 10개 단위로 순환하는 로직
                                    const position = reviews.length % 10;
                                    
                                    // 정확히 10의 배수일 때 (10, 20, 30...)
                                    if (position === 0) return '100%';
                                    
                                    // 그 외의 경우 (1-9, 11-19, 21-29...)
                                    return `${position * 10}%`;
                                })()
                            }}
                        >
                        </div>
                    </div>
                    <img src={rewardsIcon} alt='rewards icon' className={styles.rewardsIcon}/>
                </div>
                <div className={styles.smallComment}>
                    <img src={rewardsCommentIcon} alt='rewards comment icon' className={styles.rewardsCommentIcon}/>
                    <p>방문한 사회적 기업에 대한 리뷰를 남겨보세요!</p>
                </div>
            </div>

            <div className={styles.bookmarkContainer}>
                <div className={styles.bookmarkHeader}>
                    <div className={styles.containerLabel}>
                        <span>내가 찜한 기업들</span>
                        <span>{bookmarkLocations.length}</span>
                    </div>
                </div>
                <div className={styles.bookmarkList}>
                    <MyEnterpriseList items={bookmarkLocations} />
                </div>
            </div>
            
            <AdminComponent enterpriseProfile={enterpriseProfile} profile={profile} />
            {modalLoading && (
                <div className={styles.loading}>
                    <LoadingSpinner />
                </div>
            )}
            <EnterpriseReviewModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                enterprises={enterprises}
            />
            <div style={{ width: '90%', height: '43px', border: 'solid 1px #D9D9D9', borderRadius: '20px', margin: '30px 0 30px 0', padding: '0', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#5C5C5C', fontSize: '14px', fontWeight: '500' }}>
                로그아웃
            </div>
        </div>
    );
}

export default Mypage;