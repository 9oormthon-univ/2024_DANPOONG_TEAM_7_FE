import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setSocialEnterprises } from '../../redux/slice/EnterpriseSlice';
import KakaoMap from '../../components/enterprise/KakaoMap';
import styles from '../../styles/enterprise/EnterpriseSearch.module.css';
import searchIcon from '../../assets/images/enterprise/search-icon.svg';
import SearchModal from '../../components/enterprise/SearchModal';
import ListModal from '../../components/enterprise/ListModal';


function EnterpriseSearch() {
    const dispatch = useDispatch();
    const [isSearchModal, setIsSearchModal] = useState(false);
    const [searchHistory, setSearchHistory] = useState([]); // dummyData
    const [isListModal, setIsListModal] = useState(false); //ListModal

    // socialEnterprise 데이터를 Redux store에 저장
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/dummyData/SocialEnterprises.json');
                const data = await response.json();
                dispatch(setSocialEnterprises(data)); // Redux action을 dispatch
            } catch (error) {
                console.error('Failed to load data:', error);
            }
        };

        fetchData();
    }, [dispatch]);

    //검색 아이콘을 누를 시에 뜨는 Modal
    const openSearchModal = () => setIsSearchModal(true);
    const closeSearchModal = () => setIsSearchModal(false);
    
    //검색 Modal 내부 버튼
    const handleSectionClick = (section) => {
        console.log('Section clicked:', section);
    };

    //목록보기를 누를 시에 뜨는 Modal
    const openListModal = () => {
        console.log('Modal open');
        setIsListModal(true);
    };

    const closeListModal = () => {
        console.log('Modal close');
        setIsListModal(false);
    };

    const handleCategoryModal = (category) => {
        console.log('Handling category modal for:', category);
    };

    const handleTypeModal = (type) => {
        console.log('Handling type modal for:', type);
    };

    return (
        <div className={styles.container}>
            <div className={styles.topBar}>
                <p className={styles.pageName}>기업 찾기</p>
                <button className={styles.searchBtn} onClick={openSearchModal}>
                    <img src={searchIcon} alt="search icon" className={styles.searchIcon} />
                </button>
            </div>
            <div className={styles.map}>
                <div className={styles.mapView}>
                    <KakaoMap />
                </div>
                <button className={styles.listDetailBtn} onClick={openListModal}>
                    <div className={styles.listSquare}></div>
                    <p className={styles.listDetail}>목록보기</p>
                </button>
            </div>

            {isSearchModal && (
                <SearchModal 
                    isActive={isSearchModal}
                    handleClose={closeSearchModal}
                    searchHistory={searchHistory}
                    handleSectionClick={handleSectionClick}
                />
            )}
            
            {isListModal && (
                <ListModal
                    isActive={isListModal}
                    handleClose={closeListModal}
                    openCategoryModal={handleCategoryModal}
                    openTypeModal={handleTypeModal}
                />
            )}
        </div>
    );
}

export default EnterpriseSearch;