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
// Bind FetchPostsUseCase using dynamic factory (no decorators required)
container.bind(TYPES.FetchPostsUseCase).toDynamicValue(() => {
  const repo = container.get(TYPES.IPostRepository);
  const UseCase = require('../usecases/FetchPostsUseCase').FetchPostsUseCase;
  return new UseCase(repo);
}).inSingletonScope();

export { container, TYPES };