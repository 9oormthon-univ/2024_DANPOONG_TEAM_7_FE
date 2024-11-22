import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../../styles/enterprise/EnterpriseSearch.module.css';
import KakaoMap from '../../components/enterprise/KakaoMap';
import ListModal from '../../components/enterprise/ListModal';

//redux
import { 
    setSearchQuery,
    addToSearchHistory,
    setDisplayMode,
} from '../../redux/slices/SearchSlice';
import { 
    setFilteredEnterprises,
    setShouldShowMarkers 
} from '../../redux/slices/FilteredEnterpriseListSlice';

import { 
    fetchVisitedLocations,
    fetchBookmarkLocations,
    setActiveMarkerType
} from '../../redux/slices/VisitedBookmarkSlice'; 

//hooks
import { useEnterprises } from '../../hooks/useEnterprises';

//img
import searchIcon from '../../assets/images/enterprise/company-search.svg';
import BookmarkIcon from '../../assets/images/map/icon-bookmark.svg';
import ReviewIcon from '../../assets/images/map/icon-review.svg';

function EnterpriseSearch() {
    const dispatch = useDispatch();
    const [isListModalFullView, setIsListModalFullView] = useState(false);    
    const [inputValue, setInputValue] = useState('');
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    const { loading: enterprisesLoading, error: enterprisesError, fetchEnterprises } = useEnterprises();
    const { isLoading: visitedBookmarkLoading, error: visitedBookmarkError } = useSelector(
        state => state.visitedBookmark
    );
    const { socialEnterprises } = useSelector(state => state.enterprise);
    const { filteredEnterprises } = useSelector(state => state.filteredEnterprise);

    useEffect(() => {
        if (isInitialized) return;
        
        const loadData = async () => {
            try {
                const enterprisesData = await fetchEnterprises();
                await dispatch(fetchVisitedLocations());
                await dispatch(fetchBookmarkLocations());
                setIsInitialized(true);
            } catch (error) {
                console.error('Failed to load data:', error);
            }
        };

        loadData();
    }, [dispatch, fetchEnterprises, isInitialized]);

    const handleSearch = () => {
        if (inputValue.trim()) {
            dispatch(setSearchQuery(inputValue));
            dispatch(addToSearchHistory(inputValue));
            dispatch(setDisplayMode('search'));
            dispatch(setActiveMarkerType('search'));
            setInputValue('');
            setIsInputFocused(false);
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const closeListModal = () => {
        setIsListModalFullView(false);
    };

    const handleVisitedClick = () => {
        dispatch(fetchVisitedLocations());            
        dispatch(setActiveMarkerType('visited')); 
        dispatch(setDisplayMode('visited')); 
    };

    const handleBookmarkClick = () => {
        dispatch(fetchBookmarkLocations());
        dispatch(setActiveMarkerType('bookmark'));
        dispatch(setDisplayMode('bookmark'));
    };

    return (
        <div className={styles.container}>
            <div className={styles.searchContainer}>
                <input
                    type="text"
                    className={`${styles.searchInput} ${isInputFocused ? styles.focused : ''}`}
                    placeholder="사회적 기업으로 검색해보세요!"
                    value={inputValue}
                    onChange={handleInputChange}
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

            <div className={styles.map}>
                <div className={styles.mapView}>
                    <KakaoMap />
                    <div className={styles.filterContainer}>
                        <button 
                            className={styles.bookmarkBtn}
                            onClick={handleBookmarkClick}
                        >
                            <img src={BookmarkIcon} alt='bookmark icon' className={styles.bookmarkIcon}/>
                        </button>
                        <button 
                            className={styles.reviewBtn}
                            onClick={handleVisitedClick}
                        >
                            <img src={ReviewIcon} alt='review icon' className={styles.reviewIcon}/>
                        </button>
                    </div>
                </div>
            </div>

            <ListModal
                isActive={isListModalFullView}
                handleClose={closeListModal}
            />
        </div>
    );
}

export default EnterpriseSearch;