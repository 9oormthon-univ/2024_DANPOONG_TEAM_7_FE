import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setSearchQuery,
  addToSearchHistory,
  removeFromHistory,
  setSearchModalOpen,
  setSelectedLocation,
  setDisplayMode
} from '../../redux/slice/SearchSlice';
import styles from '../../styles/enterprise/SearchModal.module.css';
import searchBack from '../../assets/images/enterprise/enterprise-back.svg';
import searchIcon from '../../assets/images/enterprise/search-icon.svg';
import searchLine from '../../assets/images/enterprise/searchline.svg';
import searchDelete from '../../assets/images/enterprise/searchdelete.svg';
import searchHistoryIcon from '../../assets/images/searchhistoryicon.svg'
import myLocationIcon from '../../assets/images/map/map-myplace.svg'
import bookmarkIcon from '../../assets/images/map/map-bookmark.svg'
function SearchModal({ handleClose }) {
    const [inputValue, setInputValue] = useState('');
    const [activeSection, setActiveSection] = useState('');
    const dispatch = useDispatch();
    
    // Redux state에서 필요한 데이터 가져오기
    const searchHistory = useSelector(state => state.search.searchHistory);
    const mylocationData = useSelector(state => state.search.mylocationData);
    const bookmarkData = useSelector(state => state.search.bookmarkData);
    const isActive = useSelector(state => state.search.isSearchModalOpen);
    
    if (!isActive) return null;

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    const handleSearch = () => {
        if (inputValue.trim()) {
            dispatch(setSearchQuery(inputValue));
            dispatch(addToSearchHistory(inputValue));
            dispatch(setDisplayMode('search')); // 검색 모드로 변경
            setInputValue('');
            dispatch(setSearchModalOpen(false));
            handleClose();
        }
    };

    const handleHistoryClick = (query) => {
        dispatch(setSearchQuery(query));
        dispatch(setDisplayMode('search')); // 검색 모드로 변경
        dispatch(setSearchModalOpen(false));
        handleClose();
    };

    const handleDeleteHistory = (searchId) => {
        dispatch(removeFromHistory(searchId));
    };

    // 장소 선택 처리
    const handleLocationSelect = (location, mode) => {
        dispatch(setSelectedLocation(location));
        dispatch(setDisplayMode(mode)); // 'mylocation' 또는 'bookmark' 모드로 변경
        dispatch(setSearchModalOpen(false));
        handleClose();
    };

    // 섹션 선택
    const handleSectionSelect = (section) => {
        setActiveSection(section);
    };


    const formatSearchTime = (searchTime) => {
        const dateObj = new Date(searchTime);
        return dateObj.toLocaleDateString();
      };

    // 내장소 렌더링 함수
    const renderMylocationList = (locations) => {
        if (!locations || locations.length === 0) {
            return <p className={styles.emptyMessage}>등록된 내 장소가 없습니다.</p>;
        }

        return locations.map((location) => (
            <div key={location.certificationNumber} className={styles.myLocationList}>
                <img src={myLocationIcon} alt="search history icon" className={styles.myLocationIcon} />
                <button 
                    className={styles.query}
                    onClick={() => handleLocationSelect(location, 'mylocation')}
                >
                    {location.companyName}
                </button>
            </div>
        ));
    };

    // 즐겨찾기 렌더링 함수
    const renderBookmarkList = (locations) => {
        if (!locations || locations.length === 0) {
            return <p className={styles.emptyMessage}>등록된 즐겨찾기가 없습니다.</p>;
        }

        return locations.map((location) => (
            <div key={location.certificationNumber} className={styles.BookmarkList}>
                <img src={bookmarkIcon} alt="bookmarker icon" className={styles.bookmarkIcon} />
                <button 
                    className={styles.query}
                    onClick={() => handleLocationSelect(location, 'bookmark')}
                >
                    {location.companyName}
                </button>
            </div>
        ));
    };

    // 검색 기록의 searchTime 값 출력
    console.log('searchHistory:', searchHistory);

    return (
        <div className={styles.searchModalContainer}>
            <div className={styles.searchModalHeader}>
                <button 
                    className={styles.back} 
                    onClick={() => {
                        handleClose();
                        dispatch(setSearchModalOpen(false));
                    }}
                >
                    <img src={searchBack} alt="search back" className={styles.searchBack} />
                </button>
                <input 
                    type="text" 
                    placeholder="기업의 이름이나 유형" 
                    value={inputValue} 
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    className={styles.searchInput}
                />
                <button onClick={handleSearch} className={styles.searchBtn}>
                    <img src={searchIcon} alt="search icon" className={styles.searchIcon} />
                </button>
            </div>
            <img src={searchLine} alt="search line" className={styles.searchLine} />
            <div className={styles.searchSection}>
                <button 
                    className={`${styles.searchSectionBtn} ${activeSection === '최근검색' ? styles.active : ''}`}
                    onClick={() => handleSectionSelect('최근검색')}
                >
                    최근검색
                </button>
                <button 
                    className={`${styles.searchSectionBtn} ${activeSection === '내장소' ? styles.active : ''}`}
                    onClick={() => handleSectionSelect('내장소')}
                >
                    내장소
                </button>
                <button 
                    className={`${styles.searchSectionBtn} ${activeSection === '즐겨찾기' ? styles.active : ''}`}
                    onClick={() => handleSectionSelect('즐겨찾기')}
                >
                    즐겨찾기
                </button>
            </div>
            <img src={searchLine} alt="search line" className={styles.searchLine} />
            <div className={styles.contentSection}>
                {activeSection === '최근검색' && (
                    searchHistory && searchHistory.length > 0 ? (
                        searchHistory.map((history) => (
                            <div key={history.searchId} className={styles.searchHistory}>
                                <img src={searchHistoryIcon} alt="search history icon" className={styles.searchHistoryIcon} />
                                <button 
                                    className={styles.query}
                                    onClick={() => handleHistoryClick(history.query)}
                                >
                                    {history.query}
                                </button>
                                <p className={styles.searchTime}>{history.searchTime}</p>
                                <button 
                                    className={styles.delete}
                                    onClick={() => handleDeleteHistory(history.searchId)}
                                >
                                    <img src={searchDelete} alt="search delete" className={styles.searchDelete} />
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className={styles.emptyMessage}>검색 기록이 없습니다.</p>
                    )
                )}
                {activeSection === '내장소' && (
                    <div className={styles.locationList}>
                        {renderMylocationList(mylocationData, 'mylocation')}
                    </div>
                )}
                {activeSection === '즐겨찾기' && (
                    <div className={styles.locationList}>
                        {renderBookmarkList(bookmarkData, 'bookmark')}
                    </div>
                )}
            </div>
        </div>
    );
}

export default SearchModal;