import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/enterprise/EnterpriseSearch.module.css';
import KakaoMap from '../../components/enterprise/KakaoMap';
import ListModal from '../../components/enterprise/ListModal';
import RegionModal from '../../components/enterprise/RegionModal';
import { useEnterprise } from '../../contexts/EnterpriseContext';
import { useVisitBookmark } from '../../contexts/VisitBookmarkContext';
import { getFromLocalStorage, STORAGE_KEYS } from '../../utils/enterpriseStorage';

// images
import searchIcon from '../../assets/images/enterprise/company-search.svg';
import BookmarkIcon from '../../assets/images/map/icon-bookmark.svg';
import ReviewIcon from '../../assets/images/map/icon-review.svg';
import regionIcon from '../../assets/images/enterprise/region-button.svg';

function EnterpriseSearch() {
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState('');
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [isListModalOpen, setIsListModalOpen] = useState(false);
    const [isRegionModalOpen, setIsRegionModalOpen] = useState(false);

    const { 
        setSearchQuery, 
        addToSearchHistory,
        setActiveMarkerType,
        updateRegion,
        selectedRegion,
        filteredEnterprises,
        isLoading,
        error,
        setDisplayMode,
        updateLastAction
    } = useEnterprise();

    const { 
        fetchVisitedLocations,
        fetchBookmarkLocations,
        isLoading: bookmarkLoading
    } = useVisitBookmark();

    useEffect(() => {
        const storedRegion = getFromLocalStorage(STORAGE_KEYS.REGION);
        if (!storedRegion) {
            setIsRegionModalOpen(true);
        }
    }, [selectedRegion]);

    const handleSearch = () => {
        if (inputValue.trim()) {
            setSearchQuery(inputValue);
            addToSearchHistory(inputValue);
            updateLastAction('search');
            setDisplayMode('search');
            setInputValue('');
            setIsInputFocused(false);
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    const handleVisitedClick = async () => {
        updateLastAction('visited');
        await fetchVisitedLocations();
    };

    const handleBookmarkClick = async () => {
        updateLastAction('bookmark');
        await fetchBookmarkLocations();
    };

    const handleListModalOpen = () => {
        setIsListModalOpen(true);
        setActiveMarkerType('enterprises');
        setDisplayMode('enterprises');
    };

    const handleRegionClick = () => {
        setIsRegionModalOpen(true);
    };

    const handleRegionChange = (newRegion) => {
        updateRegion(newRegion);
        setIsRegionModalOpen(false);
    };

    const handleModalClose = () => {
        setIsListModalOpen(false);
        setActiveMarkerType('');
        setDisplayMode('initial');
    };

    if (error) {
        return <div className={styles.error}>데이터를 불러오는데 실패했습니다: {error}</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button 
                    className={styles.regionBtn}
                    onClick={handleRegionClick}
                >
                    <img
                        src={regionIcon}
                        alt='region icon'
                        className={styles.region}
                    />
                </button>
                <div className={styles.searchContainer}>
                    <input
                        type="text"
                        className={`${styles.searchInput} ${isInputFocused ? styles.focused : ''}`}
                        placeholder="사회적 기업으로 검색해보세요!"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        onFocus={() => setIsInputFocused(true)}
                        onBlur={() => setIsInputFocused(false)}
                    />
                    <button 
                        className={styles.searchBtn}
                        onClick={handleSearch}
                    >
                        <img 
                            src={searchIcon} 
                            alt="search icon" 
                            className={styles.searchIcon} 
                        />
                    </button> 
                </div>
            </div>
            

            <div className={styles.map}>
                <div className={styles.mapView}>
                    <KakaoMap />
                    <div className={styles.filterContainer}>
                        <button 
                            className={styles.bookmarkBtn}
                            onClick={handleBookmarkClick}
                            disabled={bookmarkLoading}
                        >
                            <img 
                                src={BookmarkIcon} 
                                alt='bookmark icon' 
                                className={styles.bookmarkIcon}
                            />
                        </button>
                        <button 
                            className={styles.reviewBtn}
                            onClick={handleVisitedClick}
                        >
                            <img 
                                src={ReviewIcon} 
                                alt='review icon' 
                                className={styles.reviewIcon}
                            />
                        </button>
                        <button
                            className={styles.listBtn}
                            onClick={handleListModalOpen}
                        >
                            <span className={styles.listCount}>
                                {filteredEnterprises.length}
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            <ListModal
                isActive={isListModalOpen}
                handleClose={handleModalClose}
            />
            
            <RegionModal 
                isOpen={isRegionModalOpen}
                onClose={() => setIsRegionModalOpen(false)}
                onRegionChange={handleRegionChange}
            />
        </div>
    );
}

export default EnterpriseSearch;