import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    setSearchModalOpen,
    setMyLocationData,  // SearchSlice에서 export한 액션
    setBookmarkData,    // SearchSlice에서 export한 액션
 } from '../../redux/slice/SearchSlice.jsx';
import { setSocialEnterprises } from '../../redux/slice/EnterpriseSlice.jsx';
import { setFilteredEnterprises } from '../../redux/slice/FilteredEnterpriseListSlice.jsx';
import KakaoMap from '../../components/enterprise/KakaoMap';
import styles from '../../styles/enterprise/EnterpriseSearch.module.css';
import searchIcon from '../../assets/images/enterprise/search-icon.svg';
import SearchModal from '../../components/enterprise/SearchModal';
import ListModal from '../../components/enterprise/ListModal';

function EnterpriseSearch() {
    const dispatch = useDispatch();
    const [isListModal, setIsListModal] = useState(true);
    const [isListModalFullView, setIsListModalFullView] = useState(false);
    const isFirstClick = useRef(true);  // 첫 클릭 여부를 추적하는 ref
    
    // 데이터 로딩을 페이지 레벨로 이동
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/dummyData/SocialEnterprises.json');
                const data = await response.json();
                dispatch(setSocialEnterprises(data));

                // 내장소 데이터 로드
                const mylocationResponse = await fetch('/dummyData/mylocationData.json');
                const mylocationData = await mylocationResponse.json();
                dispatch(setMyLocationData(mylocationData));

                // 즐겨찾기 데이터 로드
                const bookmarkResponse = await fetch('/dummyData/bookmarkData.json');
                const bookmarkData = await bookmarkResponse.json();
                dispatch(setBookmarkData(bookmarkData));

            } catch (error) {
                console.error('Failed to load data:', error);
            }
        };
        fetchData();
    }, [dispatch]);

    const { isSearchModalOpen } = useSelector(state => state.search);
    const { socialEnterprises } = useSelector(state => state.enterprise);
    const { filteredEnterprises } = useSelector(state => state.filteredEnterprise);

    const openListModal = () => {
        if (isFirstClick.current) {
            // 첫 클릭일 때는 원본 데이터로 설정
            if(socialEnterprises.length > 0) {
                dispatch(setFilteredEnterprises(socialEnterprises));
            }
            isFirstClick.current = false;  // 첫 클릭 후 상태 변경
        }
        // 첫 클릭이 아닐 때는 기존 필터링된 데이터 유지
        setIsListModalFullView(true);
    };

    const openSearchModal = () => {
        dispatch(setSearchModalOpen(true));
        setIsListModal(false);
    };
    
    const closeSearchModal = () => {
        dispatch(setSearchModalOpen(false));
        setIsListModal(true);
    };

    const closeListModal = () => {
        setIsListModalFullView(false);
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
                handleSectionClick={(section) => console.log('Section clicked:', section)}
            />
            
            {shouldShowListModal && (
                <ListModal
                    isActive={isListModalFullView}
                    handleClose={closeListModal}
                />
            )}
        </div>
    );
}

export default EnterpriseSearch;