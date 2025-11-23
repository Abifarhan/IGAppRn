import { Result } from '../domain/Result';

export class SeedPostsUseCase {
  constructor(postRepository) {
    this.postRepository = postRepository;
  }

  async execute(posts = []) {
    try {
      const created = [];
      for (const p of posts) {
        const res = await this.postRepository.addPost(p);
        created.push(res);
      }
      return Result.success(created);
    } catch (err) {
      return Result.failure(err);
    }
  }
}
