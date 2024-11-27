import axiosInstance from '../api/axiosInstance';

export const STORAGE_KEYS = {
  REGION: 'selectedRegion',
  CITIES: 'selectedCities',
  ENTERPRISES: 'enterprises',
  FILTERS: 'activeFilters',
  TOKEN: 'accessToken'
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

export const fetchEnterprises = async ({ region, cities }) => {
  try {
    if (!region || !cities) return [];
    
    const citiesParam = Array.isArray(cities) ? 
      `경기도 ${cities[0]}` : 
      `경기도 ${cities}`;
      
    const response = await axiosInstance.get(`/api/enterprises/${region}/${citiesParam}`);
    return response.result || [];
  } catch (error) {
    console.error('Error fetching enterprises:', error);
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