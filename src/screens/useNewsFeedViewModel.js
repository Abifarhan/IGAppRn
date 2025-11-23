
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

  const seedPosts = useCallback(async (postsToSeed = []) => {
    setLoading(true);
    setError(null);
    try {
      const seedUseCase = container.get(TYPES.SeedPostsUseCase);
      const result = await seedUseCase.execute(postsToSeed);
      if (result && result.ok) {
        // optionally refresh posts after seeding
        await fetchPosts();
        return result;
      } else {
        setError(result ? result.error : new Error('Seed failed'));
        return result;
      }
    } catch (err) {
      setError(err);
      return { ok: false, error: err };
    } finally {
      setLoading(false);
    }
  }, [fetchPosts]);

  return {
    posts,
    loading,
    error,
    fetchPosts,
    seedPosts,
    setPosts, // for seeding or other direct updates
  };
}
