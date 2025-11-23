// Plain JS class (no decorators) so it can be instantiated directly in tests
export class FetchPostsUseCase {
  constructor(postRepository) {
    this.postRepository = postRepository;
  }

  async execute() {
    return await this.postRepository.getAllPosts();
  }
}
