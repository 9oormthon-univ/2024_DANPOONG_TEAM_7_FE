// contexts/EditContext.jsx
import { createContext, useContext, useState } from 'react';
import { convertTagNumbersToKeywords, convertKeywordsToTagNumbers } from '../utils/tagUtils'; // import 추가

const EditContext = createContext(null);

export const EditProvider = ({ children }) => {
    const [reviewText, setReviewText] = useState('');
    const [selectedKeywords, setSelectedKeywords] = useState([]);
    const [currentReview, setCurrentReview] = useState(null);
    const [submissionStatus, setSubmissionStatus] = useState('idle');

    // 수정할 리뷰 데이터 설정
    const setEditReviewData = (reviewData) => {
        // 먼저 상태 초기화
        clearEditData();
        
        // 새로운 리뷰 데이터 설정
        const keywords = convertTagNumbersToKeywords(reviewData.tagNumbers);
        setCurrentReview({
            ...reviewData,
            keywords
        });
        setReviewText(reviewData.content);
        setSelectedKeywords(keywords);
        setSubmissionStatus('idle');
    };

    // 수정 데이터 준비
    const prepareEditSubmissionData = () => {
        if (!currentReview || !reviewText) return null;

        const tagNumbers = convertKeywordsToTagNumbers(selectedKeywords);
        
        return {
            content: reviewText,
            tags: tagNumbers
        };
    };

    const validateEditData = () => {
        return {
            isValid: 
                currentReview?.reviewId &&
                reviewText.trim().length >= 10 &&
                selectedKeywords.length > 0,
            errors: {
                review: !currentReview?.reviewId,
                reviewText: reviewText.trim().length < 10,
                keywords: selectedKeywords.length === 0
            }
        };
    };

    const clearEditData = () => {
        setReviewText('');
        setSelectedKeywords([]);
        setCurrentReview(null);
        setSubmissionStatus('idle');
    };

    const value = {
        reviewText,
        selectedKeywords,
        currentReview,
        submissionStatus,
        setReviewText,
        setSelectedKeywords,
        setCurrentReview: setEditReviewData,
        prepareSubmissionData: prepareEditSubmissionData,
        validateEditData,
        clearEditData,
        setSubmissionStatus
    };

    return (
        <EditContext.Provider value={value}>
            {children}
        </EditContext.Provider>
    );
};

export const useEdit = () => {
    const context = useContext(EditContext);
    if (!context) {
        throw new Error('useEdit must be used within an EditProvider');
    }
    return context;
};

export default EditProvider;