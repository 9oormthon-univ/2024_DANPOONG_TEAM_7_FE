// hooks/useVisitedEnterprises.jsx
import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { 
   setVisitedLocations, 
   setLoading as setVisitedLoading,
   setError as setVisitedError,
   setActiveMarkerType 
} from '../redux/slices/VisitedBookmarkSlice';

export const useVisitedEnterprises = () => {
  const dispatch = useDispatch();
  const [visitedEnterprises, setVisitedEnterprises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVisitedEnterprises = async () => {
      try {
          // 로컬 상태와 Redux 상태 모두 로딩 시작
          setLoading(true);
          dispatch(setVisitedLoading(true));

          const response = await fetch('/dummyData/visitedData.json');
          const data = await response.json();
          
          // 로컬 상태와 Redux 상태 모두 데이터 업데이트
          setVisitedEnterprises(data);
          dispatch(setVisitedLocations(data));
          dispatch(setActiveMarkerType('visited'));
          
          // 실제 API 연동 시:
          // const response = await fetch('/api/visited-enterprises', {
          //     headers: {
          //         'Authorization': `Bearer ${accessToken}`,
          //     }
          // });
          // const data = await response.json();
          // setVisitedEnterprises(data);
          // dispatch(setVisitedLocations(data));
          // dispatch(setActiveMarkerType('visited'));
          
      } catch (err) {
          // 로컬 상태와 Redux 상태 모두 에러 업데이트
          setError(err);
          dispatch(setVisitedError(err.message));
          console.error('방문 기업 목록 로드 실패:', err);
      } finally {
          // 로컬 상태와 Redux 상태 모두 로딩 종료
          setLoading(false);
          dispatch(setVisitedLoading(false));
      }
  };

  // useCallback을 사용하여 함수 메모이제이션
  const memoizedFetchVisitedEnterprises = useCallback(fetchVisitedEnterprises, [dispatch]);

  return { 
      visitedEnterprises, 
      loading, 
      error, 
      fetchVisitedEnterprises: memoizedFetchVisitedEnterprises 
  };
};