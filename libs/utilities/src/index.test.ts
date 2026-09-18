import { formatCurrency, getEnv } from './index';

describe('Shared Utilities', () => {
  test('should format USD currency properly', () => {
    expect(formatCurrency(100, 'USD')).toBe('$100.00');
    expect(formatCurrency(49.99, 'USD')).toBe('$49.99');
  });

  test('should format converted EUR and GBP currency', () => {
    // 100 USD * 0.92 EUR rate = 92.00
    expect(formatCurrency(100, 'EUR')).toBe('€92.00');
    // 100 USD * 0.79 GBP rate = 79.00
    expect(formatCurrency(100, 'GBP')).toBe('£79.00');
  });

  test('should retrieve env variable or fallback value', () => {
    expect(getEnv('NON_EXISTENT_VAR', 'default_fallback')).toBe('default_fallback');
  });
});
