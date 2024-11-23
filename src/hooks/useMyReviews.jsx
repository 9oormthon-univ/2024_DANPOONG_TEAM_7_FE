import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { convertTagNumbersToKeywords } from '../utils/tagUtils';

export const useMyReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchMyReviews = async () => {
        try {
            setLoading(true);
            
            // axiosInstance를 사용하여 API 호출
            const data = await axiosInstance.get('/api/reviews');
            
            // 응답 데이터 구조에 맞게 처리
            const processedReviews = data.result.reviews.map(review => ({
                ...review,
                keywords: convertTagNumbersToKeywords(review.tagNumbers)
            }));
            
            setReviews(processedReviews);
            
        } catch (err) {
            setError(err);
            console.error('내 리뷰 목록 로드 실패:', err);
            
            // 토큰이 만료되었거나 유효하지 않은 경우
            if (err.response?.status === 401) {
                // axiosInstance의 인터셉터에서 처리되므로 추가 처리 불필요
                return;
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // 토큰이 있는 경우에만 API 호출
        const token = localStorage.getItem('accessToken');
        if (token) {
            fetchMyReviews();
        }
    }, []);

    return { reviews, loading, error, fetchMyReviews };
};