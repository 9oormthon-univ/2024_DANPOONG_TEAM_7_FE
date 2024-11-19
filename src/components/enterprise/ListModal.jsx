import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setTypeModalOpen } from '../../redux/slice/TypeSlice';
import { setOnoffModalOpen } from '../../redux/slice/OnoffStoreSlice';
import { 
    setFilteredEnterprises
} from '../../redux/slice/FilteredEnterpriseListSlice';
import CategoryModal from './CategoryModal';
import TypeModal from './TypeModal';
import OnoffStoreModal from './OnoffStoreModal';
import styles from '../../styles/enterprise/ListModal.module.css';
import alignmentIcon from '../../assets/images/enterprise/alignment-icon.svg'

function ListModal({ isActive, handleClose }) {
    const dispatch = useDispatch();
    const [selectedSorting, setSelectedSorting] = useState('');
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

    // Redux store에서 데이터 가져오기
    const { socialEnterprises } = useSelector(state => state.enterprise);
    const activeFilters = useSelector(state => state.filteredEnterprise.activeFilters);
    const filteredEnterprises = useSelector(state => state.filteredEnterprise.filteredEnterprises);


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
                    initialCategories={activeFilters.categories}
                />
            )}

            <TypeModal handleClose={closeTypeModal} />

            <OnoffStoreModal handleClose={closeOnoffStoreModal} />
        </div>
    );
}

export default ListModal;