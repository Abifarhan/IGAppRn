// Plain JS class (no decorators) so it can be instantiated directly in tests
import { Result } from '../domain/Result';

export class FetchPostsUseCase {
  constructor(postRepository) {
    this.postRepository = postRepository;
  }

  async execute(params) {
    try {
      const posts = await this.postRepository.getAllPosts(params);
      return Result.success(posts);
    } catch (err) {
      return Result.failure(err);
    }
  }
}
