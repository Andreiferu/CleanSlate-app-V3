import { 
  formatCurrency, 
  formatPercentage, 
  formatDate, 
  formatRelativeTime, 
  truncateText, 
  capitalizeFirst 
} from '../../utils/formatters';

describe('formatters', () => {
  describe('formatCurrency', () => {
    test('should format USD currency correctly', () => {
      expect(formatCurrency(123.45)).toBe('$123.45');
      expect(formatCurrency(0)).toBe('$0.00');
      expect(formatCurrency(1000)).toBe('$1,000.00');
    });

    test('should format different currencies', () => {
      expect(formatCurrency(100, 'EUR')).toMatch(/€100/);
      expect(formatCurrency(100, 'GBP')).toMatch(/£100/);
    });

    test('should handle edge cases', () => {
      expect(formatCurrency(-50)).toBe('-$50.00');
      expect(formatCurrency(0.01)).toBe('$0.01');
      expect(formatCurrency(999999.99)).toBe('$999,999.99');
    });
  });

  describe('formatPercentage', () => {
    test('should format percentages correctly', () => {
      expect(formatPercentage(50)).toBe('50.0%');
      expect(formatPercentage(75.5)).toBe('75.5%');
      expect(formatPercentage(100)).toBe('100.0%');
    });

    test('should handle different decimal places', () => {
      expect(formatPercentage(33.333, 2)).toBe('33.33%');
      expect(formatPercentage(66.666, 0)).toBe('67%');
    });
  });

  describe('formatDate', () => {
    test('should format dates correctly', () => {
      const date = new Date('2024-12-25');
      const formatted = formatDate(date);
      
      expect(formatted).toMatch(/Dec/);
      expect(formatted).toMatch(/25/);
      expect(formatted).toMatch(/2024/);
    });

    test('should handle string dates', () => {
      const formatted = formatDate('2024-01-01');
      
      expect(formatted).toMatch(/Jan/);
      expect(formatted).toMatch(/1/);
      expect(formatted).toMatch(/2024/);
    });
  });

  describe('formatRelativeTime', () => {
    const now = new Date('2024-08-12T12:00:00Z');
    
    beforeAll(() => {
      jest.useFakeTimers();
      jest.setSystemTime(now);
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    test('should format relative times correctly', () => {
      const today = new Date('2024-08-12T10:00:00Z');
      const yesterday = new Date('2024-08-11T12:00:00Z');
      const lastWeek = new Date('2024-08-05T12:00:00Z');
      const lastMonth = new Date('2024-07-12T12:00:00Z');
      
      expect(formatRelativeTime(today)).toBe('Today');
      expect(formatRelativeTime(yesterday)).toBe('Yesterday');
      expect(formatRelativeTime(lastWeek)).toBe('7 days ago');
      expect(formatRelativeTime(lastMonth)).toBe('4 weeks ago');
    });
  });

  describe('truncateText', () => {
    test('should truncate long text', () => {
      const longText = 'This is a very long text that should be truncated';
      expect(truncateText(longText, 20)).toBe('This is a very lo...');
    });

    test('should not truncate short text', () => {
      const shortText = 'Short text';
      expect(truncateText(shortText, 20)).toBe('Short text');
    });

    test('should handle edge cases', () => {
      expect(truncateText('', 10)).toBe('');
      expect(truncateText('abc', 3)).toBe('abc');
      expect(truncateText('abcd', 3)).toBe('...');
    });
  });

  describe('capitalizeFirst', () => {
    test('should capitalize first letter', () => {
      expect(capitalizeFirst('hello')).toBe('Hello');
      expect(capitalizeFirst('WORLD')).toBe('World');
      expect(capitalizeFirst('tEST')).toBe('Test');
    });

    test('should handle edge cases', () => {
      expect(capitalizeFirst('')).toBe('');
      expect(capitalizeFirst('a')).toBe('A');
      expect(capitalizeFirst('123')).toBe('123');
    });
  });
});
