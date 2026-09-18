import '@testing-library/jest-dom';

// Polyfill TextEncoder/TextDecoder if not present in test environment
if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}
