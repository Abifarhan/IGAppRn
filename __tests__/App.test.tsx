/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

// Mock the heavy NewsFeedScreen so App can render in tests without importing firebase
jest.mock('../src/screens/NewsFeedScreen', () => {
  return () => null;
});

import App from '../App';

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});
