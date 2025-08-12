import { renderHook } from '@testing-library/react';
import { useAnalytics } from '../../hooks/useAnalytics';
import { AppProvider } from '../../context';

const mockSubscriptions = [
  { id: 1, name: 'Netflix', amount: 15.99, status: 'active' },
  { id: 2, name: 'Spotify', amount: 9.99, status: 'active' },
  { id: 3, name: 'Adobe', amount: 52.99, status: 'unused' }
];

const mockEmails = [
  { id: 1, emailsPerWeek: 7, unsubscribed: false },
  { id: 2, emailsPerWeek: 14, unsubscribed: false },
  { id: 3, emailsPerWeek: 2, unsubscribed: true }
];

const mockUser = {
  totalSaved: 247.80,
  savingsGoal: 300
};

describe('useAnalytics', () => {
  test('calculates financial metrics correctly', () => {
    const { result } = renderHook(
      () => useAnalytics(mockSubscriptions, mockEmails, mockUser),
      { wrapper: AppProvider }
    );

    expect(result.current.analytics.financial.monthlySpend).toBe('25.98');
    expect(result.current.analytics.financial.potentialSavings).toBe('52.99');
    expect(result.current.analytics.financial.annualSpend).toBe('311.76');
  });

  test('calculates email metrics correctly', () => {
    const { result } = renderHook(
      () => useAnalytics(mockSubscriptions, mockEmails, mockUser),
      { wrapper: AppProvider }
    );

    expect(result.current.analytics.emails.weeklyEmails).toBe(21);
  });

  test('calculates goal progress correctly', () => {
    const { result } = renderHook(
      () => useAnalytics(mockSubscriptions, mockEmails, mockUser),
      { wrapper: AppProvider }
    );

    expect(result.current.analytics.goals.progress).toBe('82.6');
    expect(result.current.analytics.goals.remaining).toBe('52.20');
  });

  test('provides currency formatting function', () => {
    const { result } = renderHook(
      () => useAnalytics(mockSubscriptions, mockEmails, mockUser),
      { wrapper: AppProvider }
    );

    expect(result.current.formatCurrency(25.99)).toBe('$25.99');
  });
});
