import 'reflect-metadata';
import { Container } from 'inversify';

// Define symbols for DI
const TYPES = {
  IPostRepository: Symbol.for('IPostRepository'),
  FetchPostsUseCase: Symbol.for('FetchPostsUseCase'),
  SeedPostsUseCase: Symbol.for('SeedPostsUseCase'),
};

// Create the container
const container = new Container();

// Bind repository implementation lazily to avoid requiring heavy ESM modules
container.bind(TYPES.IPostRepository).toDynamicValue(() => {
  // require at runtime so tests that only rebind won't pull in firebase
  const Repo = require('../repositories/PostRepository').FirestorePostRepository;
  const db = require('../firebase/config').db;
  return new Repo(db);
});

// Bind use case as a dynamic value that resolves the repository from the container
container.bind(TYPES.FetchPostsUseCase).toDynamicValue(() => {
  const repo = container.get(TYPES.IPostRepository);
  const UseCase = require('../usecases/FetchPostsUseCase').FetchPostsUseCase;
  return new UseCase(repo);
}).inSingletonScope();

// Bind SeedPostsUseCase
container.bind(TYPES.SeedPostsUseCase).toDynamicValue(() => {
  const repo = container.get(TYPES.IPostRepository);
  const UseCase = require('../usecases/SeedPostsUseCase').SeedPostsUseCase;
  return new UseCase(repo);
}).inSingletonScope();

export { container, TYPES };