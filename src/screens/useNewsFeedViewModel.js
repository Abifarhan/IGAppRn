
import { useState, useCallback, useRef } from 'react';
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
    console.log('[ViewModel] fetchPosts start', { params, reset });
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
        console.log('[ViewModel] fetchPosts success', { fetchedLength: fetched.length, newLast });
        if (reset) {
          setPosts(fetched);
        } else {
          setPosts(prev => [...prev, ...fetched]);
        }
        setLastDoc(newLast);
        setHasMore(Boolean(newLast));
      } else {
        const err = result ? result.error : new Error('Unknown error');
        console.log('[ViewModel] fetchPosts failure', err);
        setError(err);
      }
    } catch (err) {
      console.log('[ViewModel] fetchPosts exception', err);
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
    console.log('[ViewModel] seedPosts start', { count: postsToSeed.length });
    try {
      const seedUseCase = container.get(TYPES.SeedPostsUseCase);
      const result = await seedUseCase.execute(postsToSeed);
      if (result && result.ok) {
        console.log('[ViewModel] seedPosts success', { created: result.value });
        // optionally refresh posts after seeding
        await fetchPosts();
        return result;
      } else {
        console.log('[ViewModel] seedPosts failure', result && result.error);
        setError(result ? result.error : new Error('Seed failed'));
        return result;
      }
    } catch (err) {
      console.log('[ViewModel] seedPosts exception', err);
      setError(err);
      return { ok: false, error: err };
    } finally {
      setLoading(false);
    }
  }, [fetchPosts]);

  // Realtime subscription
  const realtimeRef = useRef(null);

  const subscribeRealtime = useCallback((params = {}) => {
    try {
      const repo = container.get(TYPES.IPostRepository);
      console.log('[ViewModel] subscribeRealtime start', { params });
      const unsubscribe = repo.getPostsRealtime(params, (updatedPosts) => {
        console.log('[ViewModel] subscribeRealtime update', { len: updatedPosts && updatedPosts.length });
        setPosts(updatedPosts);
      });
      console.log('[ViewModel] subscribeRealtime subscribed');
      realtimeRef.current = unsubscribe;
      return unsubscribe;
    } catch (err) {
      console.log('[ViewModel] subscribeRealtime exception', err);
      setError(err);
      return null;
    }
  }, [realtimeRef]);

  const unsubscribeRealtime = useCallback(() => {
    if (realtimeRef.current) {
      try {
        realtimeRef.current();
      } catch (e) {
        // ignore
      }
      realtimeRef.current = null;
    }
  }, [realtimeRef]);

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
    subscribeRealtime,
    unsubscribeRealtime,
  };
}
