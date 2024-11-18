import React, { useState } from 'react';
import styles from '../../styles/enterprise/SearchModal.module.css';
import searchBack from '../../assets/images/enterprise/enterprise-back.svg';
import searchIcon from '../../assets/images/enterprise/search-icon.svg';
import searchLine from '../../assets/images/enterprise/searchline.svg';
import searchDelete from '../../assets/images/enterprise/searchdelete.svg';

function SearchModal({ isActive, handleClose, searchHistory, handleSectionClick, handleSendData }) {
    const [inputValue, setInputValue] = useState('');
    
    if (!isActive) return null;

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleSend = () => {
        if (handleSendData) {
            handleSendData(inputValue);
        }
        setInputValue('');
    };

    return (
        <div className={styles.searchModalContainer}>
            <div className={styles.searchModalHeader}>
                <button className={styles.back} onClick={handleClose}>
                    <img src={searchBack} alt="search back" className={styles.searchBack} />
                </button>
                <input 
                    type="text" 
                    placeholder="기업 검색" 
                    value={inputValue} 
                    onChange={(e) => setInputValue(e.target.value)} 
                    className={styles.searchInput}
                />
                <button onClick={handleSend} className={styles.searchBtn}>
                    <img src={searchIcon} alt="search icon" className={styles.searchIcon} />
                </button>
            </div>
            <img src={searchLine} alt="search line" className={styles.searchLine} />
            <div className={styles.searchSection}>
                <button className={styles.searchSectionBtn} onClick={() => handleSectionClick('최근검색')}>최근검색</button>
                <button className={styles.searchSectionBtn} onClick={() => handleSectionClick('내장소')}>내장소</button>
                <button className={styles.searchSectionBtn} onClick={() => handleSectionClick('즐겨찾기')}>즐겨찾기</button>
            </div>
            <img src={searchLine} alt="search line" className={styles.searchLine} />
            {searchHistory && searchHistory.length > 0 ? (
                searchHistory.map((history, index) => (
                    <div key={history.searchId} className={styles.searchHistory}>
                        <p className={styles.query}>{history.query}</p>
                        <p className={styles.searchTime}>{history.searchTime}</p>
                        <button className={styles.delete}>
                            <img src={searchDelete} alt="search delete" className={styles.searchDelete} />
                        </button>
                    </div>
                ))
            ) : (
                <p>No subscriptions found.</p>
            )}
        </div>
    );
}

export default SearchModal;