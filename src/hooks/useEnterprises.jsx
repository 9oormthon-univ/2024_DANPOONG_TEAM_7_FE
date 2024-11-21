import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setSocialEnterprises } from '../redux/slices/EnterpriseSlice';
import { setFilteredEnterprises, setShouldShowMarkers } from '../redux/slices/FilteredEnterpriseListSlice';

export const useEnterprises = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchEnterprises = async () => {
        try {
            setLoading(true);
            // 실제 API 연동 시:
            // const response = await axios.get('/api/enterprises');
            const response = await fetch('/dummyData/SocialEnterprises.json');
            const data = await response.json();
            
            dispatch(setSocialEnterprises(data));
            dispatch(setFilteredEnterprises(data));
            dispatch(setShouldShowMarkers(false));
            
        } catch (err) {
            setError(err);
            console.error('Failed to load enterprises:', err);
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, fetchEnterprises };
};