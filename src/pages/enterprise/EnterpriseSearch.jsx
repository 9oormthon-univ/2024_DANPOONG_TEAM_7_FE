import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'; // useSelector 추가
import { setSearchModalOpen } from '../../redux/slice/SearchSlice';
import KakaoMap from '../../components/enterprise/KakaoMap';
import styles from '../../styles/enterprise/EnterpriseSearch.module.css';
import searchIcon from '../../assets/images/enterprise/search-icon.svg';
import SearchModal from '../../components/enterprise/SearchModal';
import ListModal from '../../components/enterprise/ListModal';
import { useState } from 'react';

function EnterpriseSearch() {
    const dispatch = useDispatch();
    const [isListModal, setIsListModal] = useState(true);
    const [isListModalFullView, setIsListModalFullView] = useState(false);
    
    // SearchModal의 상태를 가져옴
    const { isSearchModalOpen } = useSelector(state => state.search);

    //CategoryModal
    const openCategoryModal = () => {
        dispatch(setCategoryModalOpen(true));
    };

    //TypeModal
    const openTypeModal = () => {
        dispatch(setTypeModalOpen(true));
    };

    //OnoffStoreModal
    const openOnoffStoreModal = () => {
        dispatch(setOnoffModalOpen(true));
    };

    //검색 아이콘을 누를 시에 뜨는 Modal
    const openSearchModal = () => {
        dispatch(setSearchModalOpen(true));
        setIsListModal(false); // 검색 모달이 열릴 때 목록 모달 숨김
    };
    
    const closeSearchModal = () => {
        dispatch(setSearchModalOpen(false));
        setIsListModal(true); // 검색 모달이 닫힐 때 목록 모달 다시 표시
    };
    
    //검색 Modal 내부 버튼
    const handleSectionClick = (section) => {
        console.log('Section clicked:', section);
    };

    //목록보기를 누를 시에 뜨는 Modal
    const openListModal = () => {
        console.log('Modal open');
        setIsListModalFullView(true);
    };

    const closeListModal = () => {
        console.log('Modal close');
        setIsListModalFullView(false);
    };

    const handleCategoryModal = (category) => {
        console.log('Handling category modal for:', category);
    };

    const handleTypeModal = (type) => {
        console.log('Handling type modal for:', type);
    };

    // 검색 모달 상태에 따라 ListModal 표시 여부 결정
    const shouldShowListModal = isListModal && !isSearchModalOpen;

    return (
        <div className={styles.container}>
            <div className={styles.topBar}></div>
            <button className={styles.searchBtn} onClick={openSearchModal}>
                <img src={searchIcon} alt="search icon" className={styles.searchIcon} />
            </button>
            <div className={styles.map}>
                <div className={styles.mapView}>
                    <KakaoMap />
                </div>
                <button className={styles.listDetailBtn} onClick={openListModal}>
                    <div className={styles.listSquare}></div>
                    <p className={styles.listDetail}>목록보기</p>
                </button>
            </div>

            <SearchModal 
                handleClose={closeSearchModal}
                handleSectionClick={handleSectionClick}
            />
            
            {shouldShowListModal && (
                <ListModal
                isActive={isListModalFullView}
                handleClose={() => setIsListModalFullView(false)}
                openCategoryModal={openCategoryModal}
                openTypeModal={openTypeModal}
                openOnoffModal={openOnoffStoreModal}
                />
            )}
        </div>
    );
}

export default EnterpriseSearch;