import { SeedPostsUseCase } from '../../src/usecases/SeedPostsUseCase';
import { isSuccess } from '../../src/domain/Result';

describe('SeedPostsUseCase', () => {
  it('calls repository.addPost for each post and returns created refs', async () => {
    const postsToSeed = [{ text: 'a' }, { text: 'b' }];
    const mockRepo = {
      addPost: jest.fn().mockImplementation(async (p) => ({ id: Math.random().toString(), ...p }))
    };

    const useCase = new SeedPostsUseCase(mockRepo);
    const result = await useCase.execute(postsToSeed);

    expect(mockRepo.addPost).toHaveBeenCalledTimes(postsToSeed.length);
    expect(isSuccess(result)).toBe(true);
    expect(result.value.length).toBe(postsToSeed.length);
  });
});
