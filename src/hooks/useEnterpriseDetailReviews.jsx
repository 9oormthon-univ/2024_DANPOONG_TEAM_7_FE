import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const useEnterpriseDetailReviews = (enterpriseId) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await axiosInstance.get(`/api/reviews/${enterpriseId}/enterprises`);
        setReviews(data.result);
      } catch (err) {
        setError(err.response?.data?.message || '리뷰를 불러오는데 실패했습니다');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [enterpriseId]);

  return { reviews, loading, error };
};

export default useEnterpriseDetailReviews;