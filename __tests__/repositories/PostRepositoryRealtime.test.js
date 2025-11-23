jest.mock('firebase/firestore', () => {
  return {
    collection: jest.fn((db, name) => ({ __collection: name })),
    query: jest.fn((col, ...clauses) => ({ __query: clauses })),
    orderBy: jest.fn((field, dir) => ({ __orderBy: [field, dir] })),
    limit: jest.fn((n) => ({ __limit: n })),
    onSnapshot: jest.fn((q, cb) => {
      // simulate a snapshot call
      const docs = [ { id: 'x', data: () => ({ text: 'x' }) } ];
      const snapshot = { docs };
      // call back asynchronously
      setTimeout(() => cb(snapshot), 0);
      return () => { /* unsubscribe */ };
    }),
  };
});

import { FirestorePostRepository } from '../../src/repositories/PostRepository';

describe('FirestorePostRepository.getPostsRealtime', () => {
  it('subscribes and calls onUpdate with mapped posts, returns unsubscribe', async () => {
    const fakeDb = { name: 'fake' };
    const repo = new FirestorePostRepository(fakeDb);

    const onUpdate = jest.fn();
    const unsubscribe = repo.getPostsRealtime({ orderBy: { field: 'createdAt' }, limit: 1 }, onUpdate);

    expect(typeof unsubscribe).toBe('function');

    // wait for async callback
    await new Promise(r => setTimeout(r, 10));
    expect(onUpdate).toHaveBeenCalledTimes(1);
  });
});
