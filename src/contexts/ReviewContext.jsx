// contexts/ReviewContext.jsx
import { createContext, useContext, useState } from 'react';
import { convertKeywordsToTagNumbers } from '../utils/tagUtils';

const ReviewContext = createContext(null);

export const ReviewProvider = ({ children }) => {
    const [reviewText, setReviewText] = useState('');
    const [submissionStatus, setSubmissionStatus] = useState('idle');
    const [selectedKeywords, setSelectedKeywords] = useState([]);
    const [currentEnterprise, setCurrentEnterprise] = useState(null);

    // 리뷰 제출 데이터 준비 함수 추가
    const prepareSubmissionData = () => {
        if (!currentEnterprise || !reviewText) return null;

        const tagNumbers = convertKeywordsToTagNumbers(selectedKeywords);
        
        return {
            enterpriseId: currentEnterprise.enterpriseId,
            content: reviewText,
            visitDate: new Date().toISOString().split('T')[0],
            tagNumbers
        };
    };

    // 리뷰 데이터 검증 함수 추가
    const validateReviewData = () => {
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
    };

    const handleClearReviewData = () => {
        console.log('ReviewContext: Clearing all review data');
        setReviewText('');
        setSubmissionStatus('idle');
        setSelectedKeywords([]);
        setCurrentEnterprise(null);
    };

    const value = {
        // 상태
        reviewText,
        submissionStatus,
        selectedKeywords,
        currentEnterprise,
        
        // 함수들
        setReviewText,
        setSubmissionStatus,
        setSelectedKeywords,
        setCurrentEnterprise,
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