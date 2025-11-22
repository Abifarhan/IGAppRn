import { PostRepository } from '../repositories/PostRepository';

export async function fetchPostsUseCase() {
  return await PostRepository.getAllPosts();
}
