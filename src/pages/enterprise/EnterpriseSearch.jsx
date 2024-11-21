import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    setSearchModalOpen,
    setSearchQuery,
    addToSearchHistory,
    setDisplayMode,
    setSelectedLocation
} from '../../redux/slices/SearchSlice';
import { 
    setFilteredEnterprises,
    setShouldShowMarkers 
} from '../../redux/slices/FilteredEnterpriseListSlice';

//api
import { useEnterprises } from '../../hooks/useEnterprises';
import { useUserReviews } from '../../hooks/useUserReviews';
import { useBookmarks } from '../../hooks/useBookmarks';

import KakaoMap from '../../components/enterprise/KakaoMap';
import styles from '../../styles/enterprise/EnterpriseSearch.module.css';
import searchIcon from '../../assets/images/enterprise/search-icon.svg';
import SearchModal from '../../components/enterprise/SearchModal';
import ListModal from '../../components/enterprise/ListModal';
import BookmarkIcon from '../../assets/images/map/icon-bookmark.svg';
import ReviewIcon from '../../assets/images/map/icon-review.svg';

function EnterpriseSearch() {
    const dispatch = useDispatch();
    const [isListModal, setIsListModal] = useState(true);
    const [isListModalFullView, setIsListModalFullView] = useState(false);    
    const [inputValue, setInputValue] = useState('');
    const [isInputFocused, setIsInputFocused] = useState(false);

    // API hooks
    const { loading: enterprisesLoading, error: enterprisesError, fetchEnterprises } = useEnterprises();
    const { loading: reviewsLoading, error: reviewsError, fetchReviews } = useUserReviews();
    const { loading: bookmarksLoading, error: bookmarksError, fetchBookmarks } = useBookmarks();

    // Redux states
    const { 
        reviewData,
        isSearchModalOpen 
    } = useSelector(state => state.search);
    const { socialEnterprises } = useSelector(state => state.enterprise);
    const { filteredEnterprises } = useSelector(state => state.filteredEnterprise);

    // 초기 데이터 로딩
    useEffect(() => {
        const loadData = async () => {
            try {
                await Promise.all([
                    fetchEnterprises(),
                    fetchReviews(),
                    fetchBookmarks()
                ]);
            } catch (error) {
                console.error('Failed to load data:', error);
            }
        };
        loadData();
    }, []);
    // 로딩 상태 통합 체크
    const isLoading = enterprisesLoading || reviewsLoading || bookmarksLoading;
    const hasError = enterprisesError || reviewsError || bookmarksError;

    if (isLoading) return <div>로딩 중...</div>;
    if (hasError) return <div>데이터를 불러오는데 실패했습니다.</div>;

    const handleSearch = () => {
        if (inputValue.trim()) {
            dispatch(setSearchQuery(inputValue));
            dispatch(addToSearchHistory(inputValue));
            dispatch(setDisplayMode('search'));
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

    const openListModal = () => {
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

    const shouldShowListModal = !isSearchModalOpen;

    const handleReviewClick = () => {
        if (reviewData && reviewData.length > 0) {
            dispatch(setSelectedLocation(reviewData[0])); 
            dispatch(setDisplayMode('review'));
            dispatch(setFilteredEnterprises(reviewData));
            dispatch(setShouldShowMarkers(true));
        } else {
            alert('등록된 리뷰가 없습니다.');
        }
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
                        <button className={styles.bookmarkBtn}>
                            <img src={BookmarkIcon} alt='bookmark icon' className={styles.bookmarkIcon}/>
                        </button>
                        <button 
                            className={styles.reviewBtn}
                            onClick={handleReviewClick}>
                            <img src={ReviewIcon} alt='review icon' className={styles.reviewIcon}/>
                        </button>
                    </div>
                </div>
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