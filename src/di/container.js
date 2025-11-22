import 'reflect-metadata';
import { Container } from 'inversify';
import { FirestorePostRepository } from '../repositories/PostRepository';
import { fetchPostsUseCase } from '../usecases/fetchPosts';
import { FetchPostsUseCase } from '../usecases/FetchPostsUseCase';

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
// Bind FetchPostsUseCase class
container.bind(TYPES.FetchPostsUseCase).to(FetchPostsUseCase).inSingletonScope();

export { container, TYPES };