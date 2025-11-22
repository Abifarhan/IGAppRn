import { injectable, inject } from 'inversify';
import { TYPES } from '../di/container';

@injectable()
export class FetchPostsUseCase {
  constructor(
    @inject(TYPES.IPostRepository) postRepository
  ) {
    this.postRepository = postRepository;
  }

  async execute() {
    return await this.postRepository.getAllPosts();
  }
}
