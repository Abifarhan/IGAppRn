import { renderHook, act } from '@testing-library/react-hooks';
import { rebind } from '../../src/test/utils/diTestHelper';
import { TYPES } from '../../src/di/container';
import { useNewsFeedViewModel } from '../../src/screens/useNewsFeedViewModel';

describe('useNewsFeedViewModel (hooks)', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fetches first page and loadMore appends', async () => {
    const page1 = [{ id: '1' }];
    const page2 = [{ id: '2' }];
    const mockUseCase = {
      execute: jest.fn(async (params) => {
        if (!params || !params.cursor) return { ok: true, value: { posts: page1, lastDoc: {} } };
        return { ok: true, value: { posts: page2, lastDoc: null } };
      }),
    };

    const restore = rebind(TYPES.FetchPostsUseCase, () => mockUseCase);

    const { result } = renderHook(() => useNewsFeedViewModel());

    // initial fetch
    await act(async () => {
      await result.current.fetchPosts({}, { reset: true });
    });
    expect(result.current.posts.length).toBe(1);

    // load more
    await act(async () => {
      await result.current.loadMore();
    });
    expect(result.current.posts.length).toBe(2);

    restore();
  });

  it('subscribeRealtime updates posts', async () => {
    const mockRepo = {
      getPostsRealtime: jest.fn((params, cb) => {
        // call callback synchronously to avoid timing/teardown issues in tests
        cb([{ id: 'r1' }], {});
        return () => {};
      }),
    };

    const restoreRepo = rebind(TYPES.IPostRepository, () => mockRepo);

    const { result, waitFor } = renderHook(() => useNewsFeedViewModel());

    act(() => {
      result.current.subscribeRealtime({}, (p) => {});
    });

    await waitFor(() => {
      expect(result.current.posts.length).toBe(1);
    });

    restoreRepo();
  });
});
