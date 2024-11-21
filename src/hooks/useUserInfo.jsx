// hooks/useUserInfo.js
import { useState, useEffect } from 'react';

export const useUserInfo = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUserInfo = async () => {
        try {
            setLoading(true);
            // 현재는 더미데이터를 불러오지만, 나중에 백엔드 API로 대체될 부분
            const response = await fetch('/dummyData/userDummyData.json');
            const data = await response.json();
            setUserInfo(data[0]); // 현재는 더미데이터의 첫 번째 유저
            
            // 나중에는 이렇게 될 것입니다:
            // const response = await fetch('/api/user/info', {
            //     headers: {
            //         'Authorization': `Bearer ${accessToken}`,
            //     }
            // });
            // const data = await response.json();
            // setUserInfo(data);
            
        } catch (err) {
            setError(err);
            console.error('사용자 정보 로드 실패:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserInfo();
    }, []);

    return { userInfo, loading, error, fetchUserInfo };
};