import { mapDocToPost } from '../../src/domain/Post';

describe('mapDocToPost', () => {
  it('maps text and converts createdAt to ISO string for time', () => {
    const mockTimestamp = { toDate: () => new Date('2020-01-01T00:00:00Z') };
    const doc = { id: 'abc', data: () => ({ text: 'hi', createdAt: mockTimestamp }) };

    const mapped = mapDocToPost(doc);
    expect(mapped.id).toBe('abc');
    expect(mapped.text).toBe('hi');
    expect(mapped.time).toBe('2020-01-01T00:00:00.000Z');
  });

  it('returns null time when createdAt missing', () => {
    const doc = { id: 'x', data: () => ({ text: 'no time' }) };
    const mapped = mapDocToPost(doc);
    expect(mapped.time).toBeNull();
  });

  it('defaults missing fields to safe values', () => {
    const doc = { id: '1', data: () => ({}) };
    const mapped = mapDocToPost(doc);
    expect(mapped.id).toBe('1');
    expect(mapped.text).toBe('');
    expect(mapped.user).toBe('Unknown');
    expect(mapped.type).toBe('text');
  });
});
