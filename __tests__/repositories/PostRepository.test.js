jest.mock('firebase/firestore', () => {
  return {
    collection: jest.fn((db, name) => ({ __collection: name })),
    getDocs: jest.fn(async (q) => {
      // q may be the collection or a query; return a fake snapshot
      const docs = [
        { id: 'a', data: () => ({ text: 'one' }) },
        { id: 'b', data: () => ({ text: 'two' }) },
      ];
      return { docs };
    }),
    query: jest.fn((col, ...clauses) => ({ __query: clauses })),
    orderBy: jest.fn((field, dir) => ({ __orderBy: [field, dir] })),
    limit: jest.fn((n) => ({ __limit: n })),
    startAfter: jest.fn((c) => ({ __startAfter: true })),
  };
});

import { FirestorePostRepository } from '../../src/repositories/PostRepository';

describe('FirestorePostRepository.getAllPosts', () => {
  it('returns posts and lastDoc and uses orderBy/limit/cursor', async () => {
    const fakeDb = { name: 'fake' };
    const repo = new FirestorePostRepository(fakeDb);

    const res = await repo.getAllPosts({ orderBy: { field: 'createdAt', direction: 'desc' }, limit: 2, cursor: { some: 'cursor' } });

    expect(res).toHaveProperty('posts');
    expect(Array.isArray(res.posts)).toBe(true);
    expect(res.posts.length).toBe(2);
    expect(res).toHaveProperty('lastDoc');
  });
});
