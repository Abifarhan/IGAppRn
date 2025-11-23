module.exports = {
  preset: 'react-native',
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native' +
      '|@react-native' +
      '|firebase' +
      ')/)'
  ],
  testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],
};
module.exports = {
  preset: 'react-native',
};
