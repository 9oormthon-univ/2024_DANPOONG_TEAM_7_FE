import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; 
import styles from '../../styles/enterprise/ListModal.module.css';
import TypeModal from './TypeModal';
import SocialPurposeModal from './SocialPurposeModal';
import OnoffStoreModal from './OnoffStoreModal';
import { useEnterprise } from '../../contexts/EnterpriseContext';
import { getFromLocalStorage, saveToLocalStorage, STORAGE_KEYS } from '../../utils/enterpriseStorage';
import { useVisitBookmark } from '../../contexts/VisitBookmarkContext';
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
    const navigate = useNavigate();
    const [selectedSorting, setSelectedSorting] = useState('');
    const [isSocialPurposeModalOpen, setIsSocialPurposeModalOpen] = useState(false);
    const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
    const [isOnoffModalOpen, setIsOnoffModalOpen] = useState(false);
    const [detailedAddressStates, setDetailedAddressStates] = useState({});
    const [initialized, setInitialized] = useState(false);  

    const { 
        filteredEnterprises,
        selectedRegion,
        activeFilters
    } = useEnterprise();

    const { 
        bookmarkLocations, 
        addBookmark, 
        removeBookmark,
        isLoading: bookmarkLoading,
        fetchBookmarkLocations
    } = useVisitBookmark();

    useEffect(() => {
        if (isActive) {
            fetchBookmarkLocations().catch(error => {
                console.error('즐겨찾기 목록 갱신 실패:', error);
            });
        }
    }, [isActive, fetchBookmarkLocations]);

    // 북마크 관리
    const handleBookmarkToggle = async (enterpriseId) => {
        try {
            if (isBookmarked(enterpriseId)) {
                await removeBookmark(enterpriseId);
            } else {
                await addBookmark(enterpriseId);
            }
            // 북마크 작업 후 목록 갱신
            await fetchBookmarkLocations();
        } catch (error) {
            console.error('북마크 처리 실패:', error);
        }
    };

    const isBookmarked = useCallback((enterpriseId) => {
        return bookmarkLocations?.some(bookmark => bookmark.enterpriseId === enterpriseId) || false;
    }, [bookmarkLocations]);

    const { 
        touchHandlers, 
        modalStyle, 
        isBackgroundActive,
        handleBackgroundClick 
    } = useSwipeableModal(isActive, handleClose);

    // 상세주소 토글
    const toggleDetailedAddress = (enterpriseId) => {
        setDetailedAddressStates(prev => ({
            ...prev,
            [enterpriseId]: {
                isOpen: !prev[enterpriseId]?.isOpen
            }
        }));
    };

    // 정렬 관리
    const handleSortingSelect = (sortType) => {
        setSelectedSorting(prev => prev === sortType ? '' : sortType);
    };

    // 기업 정보 페이지로 이동
    const handleInfoClick = (enterpriseId) => {
        navigate(`/enterprise/info/${enterpriseId}`);
    };

    // 평균 추천 그래프 높이 계산
    const calculateGraphHeight = (reviewCount) => {
        const MAX_HEIGHT = 100;
        const MAX_REVIEWS = 30;
        return Math.min((reviewCount / MAX_REVIEWS) * 100, MAX_HEIGHT);
    };

    return (
        <div className={`${styles.listModalContainer} ${isBackgroundActive ? styles.active : ''}`}>
            <div className={styles.listModalBackground} onClick={handleBackgroundClick} />
            <div 
                className={styles.listModalContent}
                style={modalStyle}
                {...touchHandlers}
            >
                <div className={styles.swipeHandle}>
                    <div className={styles.handleBar} />
                </div>

                {/* 헤더 영역 */}
                <div className={styles.listModalHeader}>
                    <button className={styles.alignmentBtn} onClick={() => setIsTypeModalOpen(true)}>
                        <p>카테고리별</p>
                        <img src={alignmentIcon} alt="alignment-icon" />
                    </button>
                    <button className={styles.alignmentBtn} onClick={() => setIsSocialPurposeModalOpen(true)}>
                        <p>유형별</p>
                        <img src={alignmentIcon} alt="alignment-icon" />
                    </button>
                    <button className={styles.alignmentBtn} onClick={() => setIsOnoffModalOpen(true)}>
                        <p>온/오프라인</p>
                        <img src={alignmentIcon} alt="alignment-icon" />
                    </button>
                </div>

                {/* 정렬 옵션 */}
                <div className={styles.companySorting}>
                    <button
                        className={`${styles.sortingReviewBtn} ${selectedSorting === '리뷰 순' ? styles.selectedSorting : ''}`}
                        onClick={() => handleSortingSelect('리뷰 순')}
                    >
                        리뷰 순
                    </button>
                    <button
                        className={`${styles.sortingRecommendationBtn} ${selectedSorting === '높은 추천 순' ? styles.selectedSorting : ''}`}
                        onClick={() => handleSortingSelect('높은 추천 순')}
                    >
                        높은 추천 순
                    </button>
                </div>

                {/* 기업 목록 */}
                <div className={styles.companyList}>
                    {filteredEnterprises.length > 0 ? (
                        filteredEnterprises.map(enterprise => (
                            <div key={enterprise.enterpriseId} className={styles.socialEnterprise}>
                                <div className={styles.averageRecommendation}>
                                    <div className={styles.graph}>
                                        <div 
                                            className={styles.graphDegree}
                                            style={{ height: `${calculateGraphHeight(enterprise.reviewCount)}%` }}
                                        />
                                    </div>
                                    <p className={styles.averageRecommendationP}>평균 추천</p>
                                </div>

                                <div className={styles.listInfo}>
                                    {/* 기업명 및 북마크 */}
                                    <div className={styles.listRow1}>
                                        <button 
                                            className={styles.companyName}
                                            onClick={() => handleInfoClick(enterprise.enterpriseId)}
                                        >
                                           <p>{formatCompanyName(enterprise.name).front}</p>
                                            {formatCompanyName(enterprise.name).middle && (
                                                <p className={styles.companyNameMiddle}>
                                                    {formatCompanyName(enterprise.name).middle}
                                                </p>
                                            )}
                                            {formatCompanyName(enterprise.name).back && (
                                                <p className={styles.companyNameBack}>
                                                    {formatCompanyName(enterprise.name).back}
                                                </p>
                                            )}
                                        </button>
                                        <button 
                                            className={styles.bookmarkBtn}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleBookmarkToggle(enterprise.enterpriseId);
                                            }}
                                            disabled={bookmarkLoading}
                                        >
                                            <img 
                                                key={`bookmark-${enterprise.enterpriseId}-${isBookmarked(enterprise.enterpriseId)}`}
                                                src={isBookmarked(enterprise.enterpriseId) ? bookmarkOn : bookmarkOff}
                                                alt="bookmark"
                                                className={styles.bookmarkIcon}
                                            />
                                        </button>
                                    </div>

                                    {/* 기업 정보 */}
                                    <div className={styles.listRow2}>
                                        <span>{enterprise.socialPurpose}</span>
                                        <span>{enterprise.type}</span>
                                    </div>

                                    {/* 주소 정보 */}
                                    <div className={styles.listRow3}>
                                        <button 
                                            className={styles.listAddressBtn}
                                            onClick={() => toggleDetailedAddress(enterprise.enterpriseId)}
                                        >
                                            <p className={styles.mainAddress}>
                                                {enterprise.city}
                                            </p>
                                            <img 
                                                src={detailedAddressStates[enterprise.enterpriseId]?.isOpen 
                                                    ? listAddressOpenIcon 
                                                    : listAddressCloseIcon
                                                } 
                                                alt="toggle address" 
                                            />
                                        </button>

                                        {detailedAddressStates[enterprise.enterpriseId]?.isOpen && (
                                            <div className={styles.detailedAddressBox}>
                                                <div className={styles.detailedAddressContent}>
                                                    <div className={styles.detailAddressP}>상세주소</div>
                                                    <div className={styles.detailAddress}>
                                                        {enterprise.district}
                                                    </div>
                                                    <button 
                                                        className={styles.close}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleDetailedAddress(enterprise.enterpriseId);
                                                        }}
                                                    >
                                                        <img src={closeBtn} alt="close" />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className={styles.noResults}>선택한 조건에 해당하는 기업이 없습니다.</p>
                    )}
                </div>
            </div>

            {/* 모달 컴포넌트들 */}
            <TypeModal 
                isOpen={isTypeModalOpen} 
                handleClose={() => setIsTypeModalOpen(false)} 
            />
            <SocialPurposeModal 
                isActive={isSocialPurposeModalOpen} 
                handleClose={() => setIsSocialPurposeModalOpen(false)} 
            />
            <OnoffStoreModal 
                isOpen={isOnoffModalOpen} 
                handleClose={() => setIsOnoffModalOpen(false)} 
            />
        </div>
    );
}

export default ListModal;