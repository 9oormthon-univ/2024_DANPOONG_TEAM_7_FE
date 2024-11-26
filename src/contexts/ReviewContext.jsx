import { createContext, useContext, useState, useCallback } from 'react';
import { convertKeywordsToTagNumbers } from '../utils/tagUtils';
import axiosInstance from '../api/axiosInstance';

const ReviewContext = createContext(null);

export const ReviewProvider = ({ children }) => {
    const [reviewText, setReviewText] = useState('');
    const [submissionStatus, setSubmissionStatus] = useState('idle');
    const [selectedKeywords, setSelectedKeywords] = useState([]);
    const [currentEnterprise, setCurrentEnterprise] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // 리뷰 목록 조회
    const fetchReviews = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.get('/api/reviews');
            if (response.result) {
                setReviews(response.result);
            }
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error('리뷰 목록 조회 실패:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // 리뷰 작성
    const submitReview = useCallback(async (reviewData) => {
        setIsLoading(true);
        setSubmissionStatus('submitting');
        try {
            const response = await axiosInstance.post('/api/reviews', reviewData);
            if (response.result) {
                setReviews(prev => [...prev, response.result]);
                setSubmissionStatus('success');
                handleClearReviewData();
            }
            return response.result;
        } catch (err) {
            setError(err.message);
            setSubmissionStatus('error');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // 리뷰 삭제
    const deleteReview = useCallback(async (reviewId) => {
        setIsLoading(true);
        try {
            await axiosInstance.delete(`/api/reviews/${reviewId}`);
            setReviews(prev => prev.filter(review => review.id !== reviewId));
            return true;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // 리뷰 제출 데이터 준비
    const prepareSubmissionData = useCallback(() => {
        if (!currentEnterprise || !reviewText) return null;

        const tagNumbers = convertKeywordsToTagNumbers(selectedKeywords);
        
        return {
            enterpriseId: currentEnterprise.enterpriseId,
            content: reviewText,
            visitDate: new Date().toISOString().split('T')[0],
            tagNumbers
        };
    }, [currentEnterprise, reviewText, selectedKeywords]);

    // 리뷰 데이터 검증
    const validateReviewData = useCallback(() => {
        return {
            isValid: 
                currentEnterprise?.enterpriseId &&
                reviewText.length >= 10 &&
                selectedKeywords.length > 0,
            errors: {
                enterprise: !currentEnterprise?.enterpriseId,
                reviewText: reviewText.length < 10,
                keywords: selectedKeywords.length === 0
            }
        };
    }, [currentEnterprise, reviewText, selectedKeywords]);

    const handleClearReviewData = useCallback(() => {
        setReviewText('');
        setSubmissionStatus('idle');
        setSelectedKeywords([]);
        setCurrentEnterprise(null);
        setError(null);
    }, []);

    const value = {
        // 상태
        reviewText,
        submissionStatus,
        selectedKeywords,
        currentEnterprise,
        reviews,
        isLoading,
        error,
        
        // 함수들
        setReviewText,
        setSubmissionStatus,
        setSelectedKeywords,
        setCurrentEnterprise,
        fetchReviews,
        submitReview,
        deleteReview,
        prepareSubmissionData,
        validateReviewData,
        clearReviewData: handleClearReviewData
    };

    return (
        <ReviewContext.Provider value={value}>
            {children}
        </ReviewContext.Provider>
    );
};

export const useReview = () => {
    const context = useContext(ReviewContext);
    if (!context) {
        throw new Error('useReview must be used within a ReviewProvider');
    }
    return context;
};