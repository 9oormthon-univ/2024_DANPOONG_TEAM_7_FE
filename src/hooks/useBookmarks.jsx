// hooks/useBookmarks.jsx
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setBookmarkLocations } from '../redux/slices/VisitedBookmarkSlice';  // import 변경

export const useBookmarks = () => {
    const dispatch = useDispatch();
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchBookmarks = async () => {
        try {
            setLoading(true);
            const response = await fetch('/dummyData/bookmarkData.json');
            const data = await response.json();
            
            // 로컬 상태와 Redux 상태 모두 업데이트
            setBookmarks(data);
            dispatch(setBookmarkLocations(data));  // setBookmarkData -> setBookmarkLocations
            
            // 실제 API 연동 시:
            // const response = await fetch('/api/bookmarks', {
            //     headers: {
            //         'Authorization': `Bearer ${accessToken}`,
            //     }
            // });
            // const data = await response.json();
            // setBookmarks(data);
            // dispatch(setBookmarkLocations(data));
            
        } catch (err) {
            setError(err);
            console.error('즐겨찾기 목록 로드 실패:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookmarks();
    }, [dispatch]);

    return { bookmarks, loading, error, fetchBookmarks };
};