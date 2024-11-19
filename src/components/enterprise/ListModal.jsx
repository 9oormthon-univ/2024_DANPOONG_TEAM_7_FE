import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setTypeModalOpen } from '../../redux/slice/TypeSlice';
import { setOnoffModalOpen } from '../../redux/slice/OnoffStoreSlice';
import { 
    setFilteredEnterprises, 
    updateActiveFilters 
} from '../../redux/slice/FilteredEnterpriseListSlice'; // 새로운 import
import CategoryModal from './CategoryModal';
import TypeModal from './TypeModal';
import OnoffStoreModal from './OnoffStoreModal';
import styles from '../../styles/enterprise/ListModal.module.css';
import alignmentIcon from '../../assets/images/enterprise/alignment-icon.svg'

function ListModal({ isActive, handleClose }) {
    const dispatch = useDispatch();
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

    // Redux store에서 데이터 가져오기
    const { socialEnterprises, selectedCategories } = useSelector(state => state.enterprise);
    const { selectedTypes } = useSelector(state => state.type);
    const { selectedOnoffStore, isOnoffModalOpen } = useSelector(state => state.onoffStore);

    // 카테고리, 유형, 온오프 모두를 고려한 필터링
    const filteredEnterprises = React.useMemo(() => {
        // 초기 데이터
        let filteredList = [...socialEnterprises];

        // 카테고리 필터링
        if (selectedCategories.length > 0 && !selectedCategories.includes('전체')) {
            filteredList = filteredList.filter(enterprise => 
                selectedCategories.includes(enterprise.socialPurposeType)
            );
        }

        // 유형 필터링
        if (selectedTypes.length > 0 && !selectedTypes.includes('전체')) {
            filteredList = filteredList.filter(enterprise => 
                selectedTypes.includes(enterprise.field)
            );
        }

        // 온오프 필터링
        if (selectedOnoffStore.length > 0) {
            filteredList = filteredList.filter(enterprise => 
                selectedOnoffStore.includes(enterprise.storeType)
            );
        }

        return filteredList;
    }, [socialEnterprises, selectedCategories, selectedTypes, selectedOnoffStore]);

    // 필터링된 결과가 변경될 때마다 Redux store 업데이트
    useEffect(() => {
        // 필터링된 기업 목록을 Redux store에 저장
        dispatch(setFilteredEnterprises(filteredEnterprises));
        
        // 현재 적용된 필터 상태도 함께 저장
        dispatch(updateActiveFilters({
            categories: selectedCategories,
            types: selectedTypes,
            onoffStore: selectedOnoffStore
        }));
    }, [dispatch, filteredEnterprises, selectedCategories, selectedTypes, selectedOnoffStore]);

    console.log('ListModal - Filtered Enterprises:', {
        totalCount: socialEnterprises.length,
        filteredCount: filteredEnterprises.length,
        selectedCategories,
        selectedTypes,
        selectedOnoffStore
    });

    const openCategoryModal = () => {
        setIsCategoryModalOpen(true);
    };

    const closeCategoryModal = () => {
        setIsCategoryModalOpen(false);
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
                    <button className={styles.sortingReviewBtn}>리뷰 순</button>
                    <button className={styles.sortingRecommendationBtn}>높은 추천 순</button>
                </div>
                <div className={styles.companyList}>
                    {filteredEnterprises.length > 0 ? (
                        filteredEnterprises.map((enterprise, index) => (
                            <div key={enterprise.number || index} className={styles.socialEnterprise}>
                                <div className={styles.listRow}>
                                    <p className={styles.listCompanyName}>{enterprise.companyName}</p>
                                    <div className={styles.typeInfo}>
                                        <p className={styles.listSocialPurposeType}>
                                            {enterprise.socialPurposeType}
                                        </p>
                                    </div>
                                </div>
                                <div className={styles.listRow}>
                                    <p className={styles.listAddress}>{enterprise.address}</p>
                                </div>
                                <div className={styles.listRow}>
                                    <button className={styles.listInfo}>정보 보기</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>선택한 조건에 해당하는 기업이 없습니다.</p>
                    )}
                </div>
            </div>

            {isCategoryModalOpen && (
                <CategoryModal
                    isActive={isCategoryModalOpen}
                    handleClose={closeCategoryModal}
                    initialCategories={selectedCategories}
                />
            )}

            <TypeModal handleClose={closeTypeModal} />

            <OnoffStoreModal handleClose={closeOnoffStoreModal} />
        </div>
    );
}

export default ListModal;