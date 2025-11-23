import { container } from '../../di/container';

// Simple DI test helper for unit tests.
// Usage:
// const restore = rebind(TYPES.FetchPostsUseCase, () => mockUseCase);
// ... run test ...
// restore();

export function rebind(symbol, valueFactory) {
  const hadBinding = container.isBound(symbol);
  let previousFactory = null;

  if (hadBinding) {
    try {
      previousFactory = container.get(symbol);
    } catch (e) {
      previousFactory = null;
    }
    container.unbind(symbol);
  }

  if (typeof valueFactory === 'function') {
    container.bind(symbol).toDynamicValue(() => valueFactory());
  } else {
    container.bind(symbol).toConstantValue(valueFactory);
  }

  return function restore() {
    if (container.isBound(symbol)) {
      container.unbind(symbol);
    }

    if (hadBinding && previousFactory !== null) {
      container.bind(symbol).toConstantValue(previousFactory);
    }
  };
}

export function isBound(symbol) {
  return container.isBound(symbol);
}
