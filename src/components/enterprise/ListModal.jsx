import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useSelector, useDispatch } from 'react-redux';
import styles from '../../styles/enterprise/ListModal.module.css';
import TypeModal from './TypeModal';
import SocialPurposeModal from './SocialPurposeModal';
import OnoffStoreModal from './OnoffStoreModal';

//redux
import { setTypeModalOpen } from '../../redux/slices/TypeSlice';
import { setOnoffModalOpen } from '../../redux/slices/OnoffStoreSlice';
import { setFilteredEnterprises } from '../../redux/slices/FilteredEnterpriseListSlice';
import { fetchBookmarkLocations, addBookmark, removeBookmark } from '../../redux/slices/VisitedBookmarkSlice';

//utils
import { formatCompanyName } from '../../utils/companyNameUtils';
import { handleExternalUrl } from '../../utils/urlUtils';

//hooks
import useSwipeableModal from '../../hooks/useSwipeableModal';

//image
import alignmentIcon from '../../assets/images/enterprise/alignment-icon.svg';
import listAddressOpenIcon from '../../assets/images/enterprise/list-addressopen.svg';
import listAddressCloseIcon from '../../assets/images/enterprise/list-addressclose.svg';
import closeBtn from '../../assets/images/enterprise/detailed-addressclose.svg';
import bookmarkOn from '../../assets/images/enterprise/bookmark-on.svg';
import bookmarkOff from '../../assets/images/enterprise/bookmark-off.svg';

function ListModal({ isActive, handleClose }) {
    // === 로컬 상태 관리 ===
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [selectedSorting, setSelectedSorting] = useState('');
    const [isSocialPurposeModalOpen, setIsSocialPurposeModalOpen] = useState(false);
    const [detailedAddressStates, setDetailedAddressStates] = useState({});
    const { bookmarkLocations, isLoading, error } = useSelector(state => state.visitedBookmark);

    const { 
        touchHandlers, 
        modalStyle, 
        isBackgroundActive,
        handleBackgroundClick 
    } = useSwipeableModal(isActive, handleClose);

    // Redux store에서 데이터 가져오기
    const { socialEnterprises } = useSelector(state => state.enterprise);
    const activeFilters = useSelector(state => state.filteredEnterprise.activeFilters);
    const filteredEnterprises = useSelector(state => state.filteredEnterprise.filteredEnterprises);
    
    useEffect(() => {
        if (socialEnterprises.length > 0) {
            dispatch(setFilteredEnterprises(socialEnterprises));
        }
    }, [socialEnterprises, dispatch]);

    useEffect(() => {
        dispatch(fetchBookmarkLocations())
            .unwrap()
            .catch(error => {
                console.error('북마크 로드 실패:', error);
            });
    }, [dispatch]);

    //모달 열고 닫기 함수
    const openSocialPurposeModal = () => {
        setIsSocialPurposeModalOpen(true);
    };

    const closeSocialPurposeModal = () => {
        setIsSocialPurposeModalOpen(false);
    };

    const openTypeModal = () => {
        dispatch(setTypeModalOpen(true));
    };

    const closeTypeModal = () => {
        dispatch(setTypeModalOpen(false));
    };

    const openOnoffStoreModal = () => {
        dispatch(setOnoffModalOpen(true));
    };

    const closeOnoffStoreModal = () => {
        dispatch(setOnoffModalOpen(false));
    };
 
    // 상세주소 확인
    const toggleDetailedAddress = (city, district, region, enterpriseId) => {
        const isCurrentlyOpen = detailedAddressStates[enterpriseId]?.isOpen || false;
        
        if (!isCurrentlyOpen) {
            const { detailAddress } = district;
            setDetailedAddressStates(prev => ({
                ...prev,
                [enterpriseId]: {
                    isOpen: true,
                    district: district
                }
            }));
        } else {
            setDetailedAddressStates(prev => ({
                ...prev,
                [enterpriseId]: {
                    isOpen: false,
                    district: ''
                }
            }));
        }
    };

     // 기업이 북마크되어 있는지 확인하는 함수
    const isBookmarked = useCallback((enterpriseId) => {
        if (!enterpriseId || !Array.isArray(bookmarkLocations)) {
            return false;
        }
        return bookmarkLocations.some(bookmark => 
            bookmark && bookmark.enterpriseId === enterpriseId
        );
    }, [bookmarkLocations]);

    // 북마크 토글 처리 함수
    const handleBookmarkToggle = async (enterpriseId) => {
        if (!enterpriseId || isLoading) {
            console.log('북마크 처리 불가:', { enterpriseId, isLoading });
            return;
        }

        try {
            const currentlyBookmarked = isBookmarked(enterpriseId);
            const actionToDispatch = currentlyBookmarked ? removeBookmark : addBookmark;
            
            console.log('북마크 처리 시작:', { 
                enterpriseId, 
                action: currentlyBookmarked ? 'remove' : 'add' 
            });

            const resultAction = await dispatch(actionToDispatch(enterpriseId)).unwrap();
            
            console.log('북마크 처리 성공:', resultAction);
        } catch (error) {
            console.error('북마크 처리 실패:', {
                enterpriseId,
                error: error?.message || error
            });
        }
    };
    

    // 버튼 선택 상태 → 관리 함수 정렬 유형 ('리뷰 순' | '높은 추천 순')
    const handleSortingSelect = (sortType) => {
        if (selectedSorting === sortType) {
            setSelectedSorting('');
        } else {
            setSelectedSorting(sortType);
        }
    };

    // 선택 상태 확인 함수
    const isSortingSelected = (sorting) => {
        return selectedSorting === sorting;
    };

    // 정보 보기 버튼 클릭 핸들러
    const handleInfoClick = (enterpriseId) => {
        navigate(`/enterprise/info/${enterpriseId}`);
    };

    const calculateGraphHeight = (reviewCount) => {
        // 최소값과 최대값 설정
        const MIN_HEIGHT = 0;
        const MAX_HEIGHT = 100;
        
        // 리뷰 개수가 없는 경우 0 반환
        if (!reviewCount || reviewCount === 0) return MIN_HEIGHT;
        
        // 리뷰 개수를 20% 기준으로 변환 (예: 6개 리뷰 = 20%)
        // 30을 기준으로 잡으면 6은 20%가 됩니다
        const maxReviews = 30;
        const normalized = (reviewCount / maxReviews) * 100;
        
        // 최대 100%를 넘지 않도록 제한
        return Math.min(normalized, MAX_HEIGHT);
    };

    return (
        <div className={`${styles.listModalContainer} ${isBackgroundActive ? styles.active : ''}`}>
            {/* onClick 핸들러에 직접 handleBackgroundClick 전달 */}
            <div 
                className={styles.listModalBackground} 
                onClick={handleBackgroundClick}
            />
            <div 
                className={styles.listModalContent}
                style={modalStyle}
                {...touchHandlers}
            >
                <div className={styles.swipeHandle}>
                    <div className={styles.handleBar}></div>
                </div>
                <div className={styles.listModalHeader}>
                    <button className={styles.alignmentBtn} onClick={openTypeModal}>
                        <p>카테고리별</p>
                        <img src={alignmentIcon} alt="alignment-icon" className={styles.alignmentIcon}/>
                    </button>
                    <button className={styles.alignmentBtn} onClick={openSocialPurposeModal}>
                        <p>유형별</p>
                        <img src={alignmentIcon} alt="alignment-icon" className={styles.alignmentIcon}/>
                    </button>
                    <button className={styles.alignmentBtn} onClick={openOnoffStoreModal}>
                        <p>온/오프라인</p>
                        <img src={alignmentIcon} alt="alignment-icon" className={styles.alignmentIcon}/>
                    </button>
                </div>
                <div className={styles.companySorting}>
                    <button
                        className={`${styles.sortingReviewBtn} ${isSortingSelected('리뷰 순') ? styles.selectedSorting : ''}`}
                        onClick={() => handleSortingSelect('리뷰 순')}
                    >
                        리뷰 순
                    </button>
                    <button
                        className={`${styles.sortingRecommendationBtn} ${isSortingSelected('높은 추천 순') ? styles.selectedSorting : ''}`}
                        onClick={() => handleSortingSelect('높은 추천 순')}
                    >
                        높은 추천 순
                    </button>
                </div>
                <div className={styles.companyList}>
                        {isLoading ? (
                            <p>로딩 중...</p>
                        ) : error ? (
                            <p>오류가 발생했습니다: {error}</p>
                        ) : filteredEnterprises.length > 0 ? (
                        filteredEnterprises.map((enterprise, index) => {
                            const { enterpriseId } = enterprise;
                            if (!enterpriseId) {
                                console.warn('Enterprise without ID:', enterprise);
                                return null;
                            }

                            const bookmarked = isBookmarked(enterpriseId);
                            return (
                                <div key={enterpriseId} className={styles.socialEnterprise}>
                                    <div className={styles.averageRecommendation}>
                                        <div className={styles.graph}>
                                            <div 
                                                className={styles.graphDegree}
                                                style={{ 
                                                    height: `${calculateGraphHeight(enterprise.reviewCount)}%`,
                                                    transition: 'height 0.3s ease'
                                                }}
                                            >
                                            </div>
                                        </div>
                                        <p className={styles.averageRecommendationP}>평균 추천</p>
                                    </div>
                                    <div className={styles.listInfo}>
                                        <div className={styles.listRow1}>
                                            <button 
                                                className={styles.companyName}
                                                onClick={() => handleInfoClick(enterprise.enterpriseId)}
                                            >
                                                <p className={styles.companyNameFront}>
                                                    {formatCompanyName(enterprise.name).front}
                                                </p>
                                                {formatCompanyName(enterprise.name).back && (
                                                <>
                                                    <p className={styles.companyNameBack}>
                                                        {formatCompanyName(enterprise.name).back}
                                                    </p>
                                                </>
                                            )}
                                            </button>
                                            <button 
                                                className={styles.bookmarkBtn}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleBookmarkToggle(enterpriseId);
                                                }}
                                                disabled={isLoading}
                                            >
                                                <img 
                                                    src={bookmarked ? bookmarkOn : bookmarkOff}
                                                    alt={bookmarked ? '북마크 제거' : '북마크 추가'}
                                                    className={styles.bookmarkIcon}
                                                />
                                            </button>
                                        </div>
                                        <div className={styles.listRow2}>
                                            <span>{enterprise.socialPurpose}</span>
                                            <span>{enterprise.type}</span>
                                        </div>
                                        <div className={styles.listRow3}>
                                            <button 
                                                className={styles.listAddressBtn}
                                                onClick={() => toggleDetailedAddress(
                                                    enterprise.city,
                                                    enterprise.district, 
                                                    enterprise.region,
                                                    enterpriseId
                                                )}
                                            >
                                                <div className={styles.listAddress}>
                                                    <p className={styles.mainAddress}>
                                                        {/* enterprise.address -> enterprise.location */}
                                                        {/* enterprise.region -> enterprise.area */}
                                                        {enterprise.city}                                                
                                                    </p>
                                                </div>
                                                <img 
                                                    src={detailedAddressStates[enterpriseId]?.isOpen 
                                                        ? listAddressOpenIcon 
                                                        : listAddressCloseIcon
                                                    } 
                                                    alt="list address icon" 
                                                    className={styles.listAddressIcon}
                                                />
                                            </button>
                                            {detailedAddressStates[enterpriseId]?.isOpen && (
                                                <div className={styles.detailedAddressBox}>
                                                    <div className={styles.detailedAddressContent}>
                                                        <div className={styles.detailAddressP}>상세주소</div>
                                                        <div className={styles.detailAddress}>
                                                            {detailedAddressStates[enterpriseId]?.district}
                                                        </div>
                                                        <button 
                                                            className={styles.close}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                toggleDetailedAddress(
                                                                    enterprise.city,
                                                                    enterprise.district,
                                                                    enterprise.region,
                                                                    enterpriseId
                                                                );
                                                            }}
                                                        >
                                                            <img src={closeBtn} alt="close-button" className={styles.closeBtn}/>
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p>선택한 조건에 해당하는 기업이 없습니다.</p>
                    )}
                </div>
            </div>

            {isSocialPurposeModalOpen && (
                <SocialPurposeModal
                    isActive={isSocialPurposeModalOpen}
                    handleClose={closeSocialPurposeModal}
                    initialSocialPurposes={activeFilters.SocialPurposes}
                />
            )}

            <TypeModal handleClose={closeTypeModal} />

            <OnoffStoreModal handleClose={closeOnoffStoreModal} />
        </div>
    );
}

export default ListModal;