import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

export const useProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            
            // axiosInstance를 사용하여 API 호출
            const data = await axiosInstance.get('/api/users');
            
            // 응답 데이터의 result 필드를 프로필 정보로 설정
            setProfile(data.result);
            
        } catch (err) {
            setError(err);
            console.error('사용자 정보 로드 실패:', err);
            
            // 토큰이 만료되었거나 유효하지 않은 경우는 
            // axiosInstance의 인터셉터에서 자동으로 처리됨
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // 토큰이 있는 경우에만 API 호출
        const token = localStorage.getItem('accessToken');
        if (token) {
            fetchProfile();
        }
    }, []);

    return { profile, loading, error, fetchProfile };
};