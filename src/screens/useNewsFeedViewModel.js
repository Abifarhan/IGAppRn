
import { useState, useCallback } from 'react';
import { container, TYPES } from '../di/container';

export function useNewsFeedViewModel() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
      const fetchPostsUseCase = container.get(TYPES.FetchPostsUseCase);
      const result = await fetchPostsUseCase.execute(params);
      if (result && result.ok) {
        setPosts(result.value || []);
      } else {
        setError(result ? result.error : new Error('Unknown error'));
      }
    } catch (err) {
      setError(err);
    }
    setLoading(false);
  }, []);

  return {
    posts,
    loading,
    error,
    fetchPosts,
    setPosts, // for seeding or other direct updates
  };
}
