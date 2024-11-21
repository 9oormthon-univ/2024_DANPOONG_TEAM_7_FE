import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setBookmarkData } from '../redux/slices/SearchSlice';

export const useBookmarks = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchBookmarks = async () => {
        try {
            setLoading(true);
            // 실제 API 연동 시:
            // const response = await axios.get('/api/bookmarks');
            const response = await fetch('/dummyData/bookmarkData.json');
            const data = await response.json();
            
            dispatch(setBookmarkData(data));
            
        } catch (err) {
            setError(err);
            console.error('Failed to load bookmarks:', err);
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, fetchBookmarks };
};