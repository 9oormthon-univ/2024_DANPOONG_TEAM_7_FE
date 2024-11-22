import React, { useState, useCallback } from 'react';
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

//utils
import { formatCompanyName } from '../../utils/companyNameUtils';
import { handleExternalUrl } from '../../utils/urlUtils';

//hooks
import useSwipeableModal from '../../hooks/useSwipeableModal';
import { useBookmarks } from '../../hooks/useBookmarks';

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
    const { 
        touchHandlers, 
        modalStyle, 
        isBackgroundActive,
        handleBackgroundClick 
    } = useSwipeableModal(isActive, handleClose);

    const { 
        bookmarks, 
        loading: bookmarkLoading, 
        error: bookmarkError,
        addBookmark,
        removeBookmark 
    } = useBookmarks();

    // Redux store에서 데이터 가져오기
    const { socialEnterprises } = useSelector(state => state.enterprise);
    const activeFilters = useSelector(state => state.filteredEnterprise.activeFilters);
    const filteredEnterprises = useSelector(state => state.filteredEnterprise.filteredEnterprises);

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
        return bookmarks?.some(bookmark => bookmark.enterpriseId === enterpriseId);
    }, [bookmarks]);

    // 북마크 토글 처리 함수
    const handleBookmarkToggle = async (enterpriseId) => {
        try {
            if (isBookmarked(enterpriseId)) {
                await removeBookmark(enterpriseId);
            } else {
                await addBookmark(enterpriseId);
            }
        } catch (error) {
            console.error('북마크 처리 중 오류 발생:', error);
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
                    {filteredEnterprises.length > 0 ? (
                        filteredEnterprises.map((enterprise, index) => {
                            const enterpriseId = enterprise.enterpriseId || index;
                            const bookmarked = isBookmarked(enterpriseId); 
                            // enterprise.number -> enterprise.enterpriseId
                            return (
                                <div key={enterpriseId} className={styles.socialEnterprise}>
                                    <div className={styles.averageRecommendation}>
                                        <div className={styles.graph}>
                                            <div 
                                                className={styles.graphDegree}
                                                style={{ 
                                                    height: `30px`
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