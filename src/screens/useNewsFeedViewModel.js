
import { useState, useCallback } from 'react';
import { container, TYPES } from '../di/container';

export function useNewsFeedViewModel() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Resolve use case from DI container
      const fetchPostsUseCase = container.get(TYPES.FetchPostsUseCase);
      const fetchedPosts = await fetchPostsUseCase();
      setPosts(fetchedPosts);
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
