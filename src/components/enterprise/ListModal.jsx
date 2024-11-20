import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useSelector, useDispatch } from 'react-redux';
import { setCategoryModalOpen } from '../../redux/slices/CategorySlice';
import { setOnoffModalOpen } from '../../redux/slices/OnoffStoreSlice';
import { setFilteredEnterprises } from '../../redux/slices/FilteredEnterpriseListSlice';
import { formatCompanyName } from '../../utils/companyNameUtils';
import { handleExternalUrl } from '../../utils/urlUtils';
import useSwipeableModal from '../../hooks/useSwipeableModal';
import CategoryModal from './CategoryModal';
import TypeModal from './TypeModal';
import OnoffStoreModal from './OnoffStoreModal';
import styles from '../../styles/enterprise/ListModal.module.css';
import alignmentIcon from '../../assets/images/enterprise/alignment-icon.svg';
import listAddressOpenIcon from '../../assets/images/enterprise/list-addressopen.svg'
import listAddressCloseIcon from '../../assets/images/enterprise/list-addressclose.svg'
import closeBtn from '../../assets/images/enterprise/detailed-addressclose.svg'

function ListModal({ isActive, handleClose }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [selectedSorting, setSelectedSorting] = useState('');
    const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
    const [detailedAddressStates, setDetailedAddressStates] = useState({});
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

    // 주소 분리 함수
    const splitAddress = (address, region) => {
        if (region === "경기") {
            if (address.startsWith("경기도")) {
                const match = address.match(/^(경기도 [가-힣]+[시|군])(.+)$/);
                if (match) {
                    return {
                        mainAddress: match[1],
                        detailAddress: match[2].trim()
                    };
                }
            } else {
                const match = address.match(/^(.+?[시|군])(.+)$/);
                if (match) {
                    return {
                        mainAddress: match[1],
                        detailAddress: match[2].trim()
                    };
                }
            }
        } else if (region === "서울") {
            const match = address.match(/^(.+구)(.+)$/);
            if (match) {
                return {
                    mainAddress: match[1],
                    detailAddress: match[2].trim()
                };
            }
        }
        return {
            mainAddress: address,
            detailAddress: ''
        };
    };

    //모달 열고 닫기 함수
    const openTypeModal = () => {
        setIsTypeModalOpen(true);
    };

    const closeTypeModal = () => {
        setIsTypeModalOpen(false);
    };

    const openCategoryModal = () => {
        dispatch(setCategoryModalOpen(true));
    };

    const closeCategoryModal = () => {
        dispatch(setCategoryModalOpen(false));
    };

    const openOnoffStoreModal = () => {
        dispatch(setOnoffModalOpen(true));
    };

    const closeOnoffStoreModal = () => {
        dispatch(setOnoffModalOpen(false));
    };

    // 상세주소 확인
    const toggleDetailedAddress = (address, region, enterpriseId) => {
        const isCurrentlyOpen = detailedAddressStates[enterpriseId]?.isOpen || false;
        
        if (!isCurrentlyOpen) {
            const { detailAddress } = splitAddress(address, region);
            setDetailedAddressStates(prev => ({
                ...prev,
                [enterpriseId]: {
                    isOpen: true,
                    detailAddress: detailAddress
                }
            }));
        } else {
            setDetailedAddressStates(prev => ({
                ...prev,
                [enterpriseId]: {
                    isOpen: false,
                    detailAddress: ''
                }
            }));
        }
    };

    // 버튼 선택 상태 관리 함수
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
                    <button className={styles.alignmentBtn} onClick={openCategoryModal}>
                        <p>카테고리별</p>
                        <img src={alignmentIcon} alt="alignment-icon" className={styles.alignmentIcon}/>
                    </button>
                    <button className={styles.alignmentBtn} onClick={openTypeModal}>
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
                            const enterpriseId = enterprise.number || index;
                
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
                                    <div className={styles.listRow1}>
                                        <div className={styles.listCompanyInfoRow1}>
                                            <span className={styles.companyNameFront}>
                                                {formatCompanyName(enterprise.companyName).front}
                                            </span>
                                            <span className={styles.listSocialPurposeType}>
                                                {enterprise.socialPurposeType}
                                            </span>
                                        </div>
                                        <div className={styles.listCompanyInfoRow2}>
                                            {formatCompanyName(enterprise.companyName).back && (
                                                <>
                                                    <p className={styles.companyNameBack}>
                                                        {formatCompanyName(enterprise.companyName).back}
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div className={styles.listRow2}>
                                        <button 
                                            className={styles.listAddressBtn}
                                            onClick={() => toggleDetailedAddress(
                                                enterprise.address, 
                                                enterprise.region,
                                                enterpriseId
                                            )}
                                        >
                                            <div className={styles.listAddress}>
                                                <p className={styles.mainAddress}>
                                                    {splitAddress(enterprise.address, enterprise.region).mainAddress}
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
                                                        {detailedAddressStates[enterpriseId]?.detailAddress}
                                                    </div>
                                                    <button 
                                                        className={styles.close}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleDetailedAddress(
                                                                enterprise.address,
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
                                        <div className={styles.listReviewCount}>리뷰 수</div>
                                    </div>
                                    <div className={styles.listRow3}>
                                        <button 
                                            className={styles.listInfoBtn}
                                            onClick={() => handleInfoClick(enterprise.number)}
                                        >
                                            정보 보기
                                        </button>
                                        {enterprise.homepage && (
                                            <button 
                                                className={styles.storeInfoBtn}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleExternalUrl(enterprise.homepage);
                                                }}
                                            >
                                                스토어 보기
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p>선택한 조건에 해당하는 기업이 없습니다.</p>
                    )}
                </div>
            </div>

            {isTypeModalOpen && (
                <TypeModal
                    isActive={isTypeModalOpen}
                    handleClose={closeTypeModal}
                    initialTypes={activeFilters.types}
                />
            )}

            <CategoryModal handleClose={closeCategoryModal} />

            <OnoffStoreModal handleClose={closeOnoffStoreModal} />
        </div>
    );
}

export default ListModal;