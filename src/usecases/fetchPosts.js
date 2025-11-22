// Use case depends on repository interface, not implementation
export async function fetchPostsUseCase(postRepository) {
  return await postRepository.getAllPosts();
}
