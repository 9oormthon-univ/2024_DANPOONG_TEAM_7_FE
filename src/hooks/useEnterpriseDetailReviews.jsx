import { useState, useEffect } from 'react';

const useEnterpriseDetailReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEnterpriseReviews = async () => {
      try {
        const response = await fetch('/dummyData/enterpriseDetailReviews.json');
        if (!response.ok) {
          throw new Error('Failed to fetch enterprise reviews');
        }
        const data = await response.json();
        setReviews(data);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch enterprise reviews'));
        setIsLoading(false);
      }
    };

    fetchEnterpriseReviews();
  }, []);

  return { reviews, isLoading, error };
};

export default useEnterpriseDetailReviews;