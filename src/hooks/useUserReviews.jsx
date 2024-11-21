// hooks/useUserReviews.js
import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setReviewData } from '../redux/slices/SearchSlice';

export const useUserReviews = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            // 실제 API 연동 시:
            // const response = await axios.get('/api/reviews');
            const response = await fetch('/dummyData/reviewData.json');
            const data = await response.json();
            
            dispatch(setReviewData(data));
            
        } catch (err) {
            setError(err);
            console.error('Failed to load reviews:', err);
        } finally {
            setLoading(false);
        }
    };

    // useCallback을 사용하여 fetchReviews 함수가 리렌더링마다 새로 생성되는 것을 방지
    const memoizedFetchReviews = useCallback(fetchReviews, [dispatch]);

    return { loading, error, fetchReviews: memoizedFetchReviews };
};