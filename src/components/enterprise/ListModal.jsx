import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useSelector, useDispatch } from 'react-redux';
import { setCategoryModalOpen } from '../../redux/slice/CategorySlice';
import { setOnoffModalOpen } from '../../redux/slice/OnoffStoreSlice';
import { 
    setFilteredEnterprises
} from '../../redux/slice/FilteredEnterpriseListSlice';
import { formatCompanyName } from '../../utils/companyNameUtils';
import { handleExternalUrl } from '../../utils/urlUtils';
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

    // Redux store에서 데이터 가져오기
    const { socialEnterprises } = useSelector(state => state.enterprise);
    const activeFilters = useSelector(state => state.filteredEnterprise.activeFilters);
    const filteredEnterprises = useSelector(state => state.filteredEnterprise.filteredEnterprises);

    // 주소 분리 함수
    const splitAddress = (address, region) => {
        if (region === "경기") {
            // '경기도'로 시작하는 주소 처리
            if (address.startsWith("경기도")) {
                // 시/군 패턴을 둘 다 포함하여 매칭
                const match = address.match(/^(경기도 [가-힣]+[시|군])(.+)$/);
                if (match) {
                    return {
                        mainAddress: match[1],
                        detailAddress: match[2].trim()
                    };
                }
            } else {
                // 첫 번째 '시'나 '군' 단위로 분리
                const match = address.match(/^(.+?[시|군])(.+)$/);
                if (match) {
                    return {
                        mainAddress: match[1],
                        detailAddress: match[2].trim()
                    };
                }
            }
        } else if (region === "서울") {
            // '구' 단위로 주소 분리
            const match = address.match(/^(.+구)(.+)$/);
            if (match) {
                return {
                    mainAddress: match[1],
                    detailAddress: match[2].trim()
                };
            }
        } else if (region === "서울") {
            // '구' 단위로 주소 분리
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
    //TypeModal
    const openTypeModal = () => {
        setIsTypeModalOpen(true);
    };

    const closeTypeModal = () => {
        setIsTypeModalOpen(false);
    };

    //CategoryModal
    const openCategoryModal = () => {
        dispatch(setCategoryModalOpen(true));
    };

    const closeCategoryModal = () => {
        dispatch(setCategoryModalOpen(false));
    };

    //OnoffStoreModal
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

    // 버튼 선택 상태만 관리하는 함수
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
        <div className={`${styles.listModalContainer} ${isActive ? styles.active : ''}`}>
            <div className={styles.listModalBackground} onClick={handleClose}></div>
            <div className={styles.listModalContent}>
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
                                                    //`${((enterprise.recommendationScore || 0) / 100) * 67}px`
                                                    // 100점 만점일 경우 비율 계산
                                                }}
                                            >
                                            </div>
                                        </div>
                                        <p className={styles.averageRecommendationP}>평균 추천</p>
                                    </div>
                                    <div className={styles.listRow1}>
                                        <div className={styles.listCompanyName}>
                                            <p className={styles.companyNameFront}>
                                                {formatCompanyName(enterprise.companyName).front}
                                            </p>
                                            {formatCompanyName(enterprise.companyName).back && (
                                                <>
                                                    <p className={styles.companyNameBack}>
                                                        {formatCompanyName(enterprise.companyName).back}
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                        <div className={styles.typeInfo}>
                                            <p className={styles.listSocialPurposeType}>
                                                {enterprise.socialPurposeType}
                                            </p>
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
                                                <p className={styles.mainAddress}>{splitAddress(enterprise.address, enterprise.region).mainAddress}</p>
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
                                                            e.stopPropagation(); // 이벤트 버블링 방지
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
                                        {enterprise.homepage && (  // homepage가 존재할 때만 스토어 보기 버튼 표시
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