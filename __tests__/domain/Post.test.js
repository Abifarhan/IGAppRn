import { mapDocToPost } from '../../src/domain/Post';

describe('mapDocToPost', () => {
  it('maps fields and applies defaults', () => {
    const doc = { id: '1', data: () => ({ user: 'Alice', text: 'Hi' }) };
    const p = mapDocToPost(doc);
    expect(p.id).toBe('1');
    expect(p.user).toBe('Alice');
    expect(p.text).toBe('Hi');
    expect(p.type).toBe('text');
  });

  it('handles Firestore timestamp-like object', () => {
    const ts = { toDate: () => new Date('2020-01-01T00:00:00Z') };
    const doc = { id: '2', data: () => ({ createdAt: ts }) };
    const p = mapDocToPost(doc);
    expect(p.time).toBe(new Date('2020-01-01T00:00:00Z').toISOString());
  });
});
