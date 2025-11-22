import { useState, useCallback } from 'react';
import { fetchPostsUseCase } from '../usecases/fetchPosts';
import { FirestorePostRepository } from '../repositories/PostRepository';

export function useNewsFeedViewModel() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const repo = new FirestorePostRepository();
      const fetchedPosts = await fetchPostsUseCase(repo);
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
