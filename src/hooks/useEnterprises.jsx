import { useState } from 'react';
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
            setError(null);
            
            const response = await fetch('/dummyData/SocialEnterprises.json');
            if (!response.ok) throw new Error('Network response was not ok');
            
            const data = await response.json();
            
            dispatch(setSocialEnterprises(data));
            dispatch(setFilteredEnterprises(data));
            dispatch(setShouldShowMarkers(false));
            
            setLoading(false);
            return data;
        } catch (err) {
            setError(err.message);
            setLoading(false);
            throw err;
        }
    };

    return { loading, error, fetchEnterprises };
};