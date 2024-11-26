import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const VisitBookmarkContext = createContext(null);

export function VisitBookmarkProvider({ children }) {
    const [bookmarkLocations, setBookmarkLocations] = useState([]);
    const [visitedLocations, setVisitedLocations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // 북마크 목록 조회
    const fetchBookmarkLocations = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.get('/api/likes');
            if (response?.result) {
                setBookmarkLocations(response.result);
            }
            return response?.result;
        } catch (error) {
            console.error('즐겨찾기 조회 실패:', error);
            setError(error.message);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // 방문 장소 조회
    const fetchVisitedLocations = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.get('/api/enterprises/users/visit');
            if (response?.result) {
                setVisitedLocations(response.result);
            }
            return response?.result;
        } catch (error) {
            console.error('방문 장소 조회 실패:', error);
            setError(error.message);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // 북마크 추가
    const addBookmark = useCallback(async (enterpriseId) => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.post(`/api/likes/${enterpriseId}`);
            if (response?.result) {
                setBookmarkLocations(prev => [...prev, response.result]);
            }
            return response?.result;
        } catch (error) {
            setError(error.message);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // 북마크 제거
    const removeBookmark = useCallback(async (enterpriseId) => {
        setIsLoading(true);
        try {
            await axiosInstance.delete(`/api/likes/${enterpriseId}`);
            setBookmarkLocations(prev => 
                prev.filter(bookmark => bookmark.enterpriseId !== enterpriseId)
            );
        } catch (error) {
            setError(error.message);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // 초기 데이터 로드
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                await Promise.all([
                    fetchBookmarkLocations(),
                    fetchVisitedLocations()
                ]);
            } catch (error) {
                console.error('초기 데이터 로드 실패:', error);
                setError(error.message);
            }
        };

        const token = localStorage.getItem('accessToken');
        if (token) {
            loadInitialData();
        }
    }, [fetchBookmarkLocations, fetchVisitedLocations]);

    const value = {
        bookmarkLocations,
        visitedLocations,
        isLoading,
        error,
        addBookmark,
        removeBookmark,
        fetchBookmarkLocations,
        fetchVisitedLocations
    };

    return (
        <VisitBookmarkContext.Provider value={value}>
            {children}
        </VisitBookmarkContext.Provider>
    );
}

export const useVisitBookmark = () => {
    const context = useContext(VisitBookmarkContext);
    if (!context) {
        throw new Error('useVisitBookmark must be used within a VisitBookmarkProvider');
    }
    return context;
};