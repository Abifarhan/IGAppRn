import { FetchPostsUseCase } from '../../src/usecases/FetchPostsUseCase';
import { isSuccess } from '../../src/domain/Result';

describe('FetchPostsUseCase', () => {
  it('calls repository.getAllPosts and returns posts', async () => {
    const fakePosts = [{ id: '1', text: 'hello' }];
    const mockRepo = {
      getAllPosts: jest.fn().mockResolvedValue(fakePosts),
    };

    const useCase = new FetchPostsUseCase(mockRepo);
    const result = await useCase.execute();

    expect(mockRepo.getAllPosts).toHaveBeenCalledTimes(1);
    expect(isSuccess(result)).toBe(true);
    expect(result.value).toBe(fakePosts);
  });
});
