import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setSearchQuery,
  addToSearchHistory,
  removeFromHistory,
  setSearchModalOpen
} from '../../redux/slice/SearchSlice';
import styles from '../../styles/enterprise/SearchModal.module.css';
import searchBack from '../../assets/images/enterprise/enterprise-back.svg';
import searchIcon from '../../assets/images/enterprise/search-icon.svg';
import searchLine from '../../assets/images/enterprise/searchline.svg';
import searchDelete from '../../assets/images/enterprise/searchdelete.svg';

function SearchModal({ handleClose, handleSectionClick }) {
    const [inputValue, setInputValue] = useState('');
    const [activeSection, setActiveSection] = useState(''); // 섹션 상태 추가
    const dispatch = useDispatch();
    const searchHistory = useSelector(state => state.search.searchHistory);
    const isActive = useSelector(state => state.search.isSearchModalOpen);
    
    if (!isActive) return null;

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    // Enter 키 입력 처리
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    // 검색 실행 함수
    const handleSearch = () => {
        if (inputValue.trim()) {
            dispatch(setSearchQuery(inputValue));
            dispatch(addToSearchHistory(inputValue));
            setInputValue('');
            dispatch(setSearchModalOpen(false));
            handleClose();
        }
    };

    // 이전 검색어 클릭 시 바로 검색
    const handleHistoryClick = (query) => {
        dispatch(setSearchQuery(query));
        dispatch(setSearchModalOpen(false));
        handleClose();
    };

    const handleDeleteHistory = (searchId) => {
        dispatch(removeFromHistory(searchId));
    };

    // 섹션 선택 함수 이름 변경
    const handleSectionSelect = (section) => {
        setActiveSection(section);
    };

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
                    className={styles.searchSectionBtn} 
                    onClick={() => handleSectionSelect('최근검색')}
                >
                    최근검색
                </button>
                <button 
                    className={styles.searchSectionBtn} 
                    onClick={() => handleSectionSelect('내장소')}
                >
                    내장소
                </button>
                <button 
                    className={styles.searchSectionBtn} 
                    onClick={() => handleSectionSelect('즐겨찾기')}
                >
                    즐겨찾기
                </button>
            </div>
            <img src={searchLine} alt="search line" className={styles.searchLine} />
            
            {/* 조건부 렌더링 */}
            {activeSection === '최근검색' && (
                searchHistory && searchHistory.length > 0 ? (
                    searchHistory.map((history) => (
                        <div key={history.searchId} className={styles.searchHistory}>
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
                    <p>검색 기록이 없습니다.</p>
                )
            )}
            {activeSection === '내장소' && <p>내 장소입니다.</p>}
            {activeSection === '즐겨찾기' && <p>즐겨찾기 입니다.</p>}
        </div>
    );
}

export default SearchModal;