import 'reflect-metadata';
import { Container } from 'inversify';
import { FirestorePostRepository } from '../repositories/PostRepository';
import { fetchPostsUseCase } from '../usecases/fetchPosts';

// Define symbols for DI
const TYPES = {
  IPostRepository: Symbol.for('IPostRepository'),
  FetchPostsUseCase: Symbol.for('FetchPostsUseCase'),
};

// Create the container
const container = new Container();

// Bind repository implementation to interface
container.bind(TYPES.IPostRepository).to(FirestorePostRepository);

// Bind use case as a dynamic value that resolves the repository from the container
container.bind(TYPES.FetchPostsUseCase).toDynamicValue(() => {
  return async () => {
    const repo = container.get(TYPES.IPostRepository);
    return await fetchPostsUseCase(repo);
  };
});

export { container, TYPES };