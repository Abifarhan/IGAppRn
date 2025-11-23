
import { useState, useCallback } from 'react';
import { container, TYPES } from '../di/container';

export function useNewsFeedViewModel() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [pageSize] = useState(10);

  const fetchPosts = useCallback(async (params = {}, { reset = false } = {}) => {
    setLoading(true);
    setError(null);
    try {
      const fetchPostsUseCase = container.get(TYPES.FetchPostsUseCase);
      // inject pageSize and cursor if not provided
      const callParams = { ...(params || {}), orderBy: params.orderBy || { field: 'createdAt', direction: 'desc' }, limit: params.limit || pageSize };
      if (!reset && lastDoc) callParams.cursor = lastDoc;

      const result = await fetchPostsUseCase.execute(callParams);
      if (result && result.ok) {
        const payload = result.value || {};
        const fetched = payload.posts || [];
        const newLast = payload.lastDoc || null;
        if (reset) {
          setPosts(fetched);
        } else {
          setPosts(prev => [...prev, ...fetched]);
        }
        setLastDoc(newLast);
        setHasMore(Boolean(newLast));
      } else {
        setError(result ? result.error : new Error('Unknown error'));
      }
    } catch (err) {
      setError(err);
    }
    setLoading(false);
  }, [lastDoc, pageSize]);

  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;
    await fetchPosts({}, { reset: false });
  }, [hasMore, loading, fetchPosts]);

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
    loadMore,
    lastDoc,
    hasMore,
  };
}
