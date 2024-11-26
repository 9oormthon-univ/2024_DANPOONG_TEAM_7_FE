import axiosInstance from '../api/axiosInstance';

export const STORAGE_KEYS = {
  REGION: 'selectedRegion',
  ENTERPRISES: 'enterprises',
  FILTERS: 'activeFilters',
  TOKEN: 'accessToken'  // axiosInstance와 일치하도록 변경
};

export const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const getFromLocalStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
};

export const fetchEnterprises = async (region) => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.warn('No authentication token found, redirecting to login');
      window.location.href = '/';
      return [];
    }

    const response = await axiosInstance.get(`/api/enterprises/${region}`);
    
    if (response.isSuccess && response.result) {
      return response.result;
    } else {
      throw new Error(response.message || 'Failed to fetch enterprises');
    }
  } catch (error) {
    console.error('Error fetching enterprises:', error);
    if (error.response?.status === 401) {
      // axiosInstance의 인터셉터가 처리할 것입니다
      return [];
    }
    throw error;
  }
};

export const filterEnterprisesByRegion = (enterprises, region) => {
  if (!region || !enterprises) return [];
  return enterprises.filter(enterprise => enterprise.region === region);
};

export const applyFilters = (enterprises, filters) => {
  if (!enterprises || !filters) return enterprises;

  return enterprises.filter(enterprise => {
    const matchesType = !filters.types?.length || 
      filters.types.includes('전체') || 
      filters.types.includes(enterprise.type);

    const matchesSocialPurpose = !filters.socialPurpose?.length || 
      filters.socialPurpose.includes('전체') || 
      filters.socialPurpose.includes(enterprise.socialPurpose);

    const matchesOnoffStore = !filters.onoffStore?.length || 
      (filters.onoffStore.includes('온라인') ? enterprise.website : !enterprise.website);

    return matchesType && matchesSocialPurpose && matchesOnoffStore;
  });
};