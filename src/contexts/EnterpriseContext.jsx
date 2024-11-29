import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  saveToLocalStorage, 
  getFromLocalStorage, 
  STORAGE_KEYS,
  fetchEnterprises as fetchEnterprisesUtil,
  filterEnterprisesByRegion,
  applyFilters 
} from '../utils/enterpriseStorage';

const EnterpriseContext = createContext(null);

export const EnterpriseProvider = ({ children }) => {
  const navigate = useNavigate();
  
  const [filteredEnterprises, setFilteredEnterprises] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(() => {
    const savedRegion = getFromLocalStorage(STORAGE_KEYS.REGION);
    return savedRegion || '';
  });

  const [selectedCities, setSelectedCities] = useState(() => {
    const savedCities = getFromLocalStorage(STORAGE_KEYS.CITIES);
    return savedCities || [];
  });

  const [enterprises, setEnterprises] = useState(() => {
    return getFromLocalStorage(STORAGE_KEYS.ENTERPRISES, []);
  });

  const [activeFilters, setActiveFilters] = useState(() => {
    return getFromLocalStorage(STORAGE_KEYS.FILTERS, {
      types: [],
      socialPurpose: [],
      onoffStore: []
    });
  });

  const [shouldShowMarkers, setShouldShowMarkers] = useState(true);
  const [activeMarkerType, setActiveMarkerType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 검색 관련 상태 추가
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState(
    getFromLocalStorage('searchHistory', [])
  );
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [displayMode, setDisplayMode] = useState('initial');
  const [lastUpdated, setLastUpdated] = useState(null);

  const [lastAction, setLastAction] = useState({
    type: null,
    timestamp: null
});

  const [reviewEnterprises, setReviewEnterprises] = useState([]);

  // 인증 상태 확인
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/');
    }
  }, [navigate]);
  
  useEffect(() => {
    const initializeData = async () => {
      const savedRegion = getFromLocalStorage(STORAGE_KEYS.REGION);
      const savedCities = getFromLocalStorage(STORAGE_KEYS.CITIES);
        
      if (savedRegion && savedCities?.length) {
        try {
          await fetchEnterprises({
            region: savedRegion,
            cities: savedCities
          });
        } catch (error) {
          console.error('Failed to initialize data:', error);
        }
      }
    };
  
    initializeData();
  }, []);

  const fetchEnterprises = useCallback(async ({ region, cities, isReviewMode = false }) => {
    if (!region) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // 리뷰 모드일 경우
      if (isReviewMode) {
        const data = await fetchEnterprisesUtil({
          region: '경기',
          cities: ['전체']
        });
        setReviewEnterprises(data); // 리뷰용 상태 업데이트
        return data;
      }
      
      // 일반 모드일 경우
      const data = await fetchEnterprisesUtil({
        region,
        cities
      });
      setEnterprises(data);
      saveToLocalStorage(STORAGE_KEYS.ENTERPRISES, data);
      return data;
    } catch (error) {
      setError(error.message);
      if (error.response?.status === 401) navigate('/');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  // 필터링 로직
  useEffect(() => {
    if (enterprises.length > 0 && selectedRegion) {
      const filtered = applyFilters(enterprises, activeFilters);
      setFilteredEnterprises(filtered);
    }
  }, [enterprises, selectedRegion, activeFilters]);

  const updateLastAction = useCallback((actionType) => {
    setLastAction({
        type: actionType,
        timestamp: Date.now()
    });
}, []);

  // 필터 업데이트
  const updateFilters = useCallback((newFilters) => {
    const updatedFilters = { ...activeFilters, ...newFilters };
    setActiveFilters(updatedFilters);
    saveToLocalStorage(STORAGE_KEYS.FILTERS, updatedFilters);
    
    if (Object.values(updatedFilters).some(filter => 
        Array.isArray(filter) && filter.length > 0)
    ) {
        updateLastAction('enterprises');
    }
}, [activeFilters, updateLastAction]);

  // 지역 업데이트
  const updateRegion = useCallback(async ({ region, cities }) => {
    setSelectedRegion(region);
    setSelectedCities(cities);
    saveToLocalStorage(STORAGE_KEYS.REGION, region);
    saveToLocalStorage(STORAGE_KEYS.CITIES, cities);
    
    // 동일한 값으로 API 호출
    return await fetchEnterprises({ region, cities });
  }, [fetchEnterprises]);
  
  // 검색 히스토리 추가
  const addToSearchHistory = useCallback((query) => {
    const newHistory = [{
      searchId: Date.now(),
      query,
      searchTime: new Date().toLocaleString()
    }, ...searchHistory].slice(0, 5); // 최근 5개만 유지
    
    setSearchHistory(newHistory);
    saveToLocalStorage('searchHistory', newHistory);
  }, [searchHistory]);

  // 검색 히스토리 삭제
  const removeFromHistory = useCallback((searchId) => {
    const updatedHistory = searchHistory.filter(item => item.searchId !== searchId);
    setSearchHistory(updatedHistory);
    saveToLocalStorage('searchHistory', updatedHistory);
  }, [searchHistory]);

  // 검색어 초기화
  const clearSearchQuery = useCallback(() => {
    setSearchQuery('');
    setLastUpdated(null);
  }, []);

  // 검색어 설정
  const handleSearchQuery = useCallback((query) => {
    setSearchQuery(query);
    setLastUpdated(Date.now());
  }, []);
  

  const value = {
    // 기존 상태와 함수들
    enterprises,
    setEnterprises,
    filteredEnterprises,
    setFilteredEnterprises,
    selectedRegion,
    updateRegion,
    activeFilters,
    updateFilters,
    shouldShowMarkers,
    setShouldShowMarkers,
    activeMarkerType,
    setActiveMarkerType,
    isLoading,
    error,
    fetchEnterprises,
    lastAction,
    updateLastAction,

    // 검색 관련 상태와 함수들
    searchQuery,
    searchHistory,
    selectedLocation,
    displayMode,
    lastUpdated,
    setSearchQuery: handleSearchQuery,
    addToSearchHistory,
    removeFromHistory,
    clearSearchQuery,
    setSelectedLocation,
    setDisplayMode,
    reviewEnterprises
  };

  return (
    <EnterpriseContext.Provider value={value}>
      {children}
    </EnterpriseContext.Provider>
  );
};

export const useEnterprise = () => {
  const context = useContext(EnterpriseContext);
  if (!context) {
    throw new Error('useEnterprise must be used within an EnterpriseProvider');
  }
  return context;
};