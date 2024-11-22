// hooks/useProfile.jsx
import { useState, useEffect } from 'react';

export const useProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await fetch('/dummyData/userDummyData.json');
            const data = await response.json();
            setProfile(data[0]); 
            
            // 실제 API 연동 시:
            // const response = await fetch('/api/profile', {
            //     headers: {
            //         'Authorization': `Bearer ${accessToken}`,
            //     }
            // });
            // const data = await response.json();
            // setProfile(data);
            
        } catch (err) {
            setError(err);
            console.error('프로필 정보 로드 실패:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    return { profile, loading, error, fetchProfile };
};