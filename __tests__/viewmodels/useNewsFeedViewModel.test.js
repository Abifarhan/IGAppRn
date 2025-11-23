import React, { useEffect } from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { View, Text } from 'react-native';

import { rebind } from '../../src/test/utils/diTestHelper';
import { TYPES } from '../../src/di/container';
const fakePosts = [{ id: 'p1', text: 'hello' }];
const mockUseCase = { execute: jest.fn().mockResolvedValue(fakePosts) };

import { useNewsFeedViewModel } from '../../src/screens/useNewsFeedViewModel';

function TestComponent() {
  const { posts, loading, error, fetchPosts } = useNewsFeedViewModel();

  useEffect(() => {
    // trigger fetch on mount
    fetchPosts();
  }, [fetchPosts]);

  return (
    <View>
      <Text testID="len">{String(posts.length)}</Text>
      {loading && <Text testID="loading">loading</Text>}
      {error && <Text testID="error">error</Text>}
    </View>
  );
}

describe('useNewsFeedViewModel', () => {
  it('fetches posts and updates state', async () => {
    let tree;
    // rebind the FetchPostsUseCase in the container for this test
    const restore = rebind(TYPES.FetchPostsUseCase, () => mockUseCase);
    await act(async () => {
      tree = ReactTestRenderer.create(<TestComponent />);
      // let effects and promises resolve
      await new Promise((r) => setTimeout(r, 0));
    });

    // restore the original binding
    restore();

    const root = tree.root;
    const lenNode = root.findByProps({ testID: 'len' });
    const lenValue = lenNode.props.children;
    expect(String(lenValue)).toBe(String(fakePosts.length));
  });
});
