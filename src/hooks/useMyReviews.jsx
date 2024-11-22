// hooks/useMyReviews.jsx

import { useState, useEffect } from 'react';
import { convertTagNumbersToKeywords } from '../utils/tagUtils';

export const useMyReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchMyReviews = async () => {
        try {
            setLoading(true);
            const response = await fetch('/dummyData/reviewData.json');
            const data = await response.json();
            
            // 태그 번호를 키워드 정보로 변환
            const processedReviews = data.map(review => ({
                ...review,
                keywords: convertTagNumbersToKeywords(review.tagNumbers)
            }));
            
            setReviews(processedReviews);
            
        } catch (err) {
            setError(err);
            console.error('내 리뷰 목록 로드 실패:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyReviews();
    }, []);

    return { reviews, loading, error, fetchMyReviews };
};