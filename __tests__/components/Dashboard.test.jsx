import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AppProvider } from '../../context';
import Dashboard from '../../components/features/dashboard/Dashboard';

// Mock useAnalytics hook
jest.mock('../../hooks/useAnalytics', () => ({
  useAnalytics: () => ({
    analytics: {
      financial: {
        potentialSavings: '90.97',
        monthlySpend: '139.95',
        annualSpend: '1679.40'
      },
      emails: { weeklyEmails: 34 },
      goals: { progress: '82.6', remaining: '52.20' },
      trends: {
        savings: 12,
        spending: -5,
        emails: -8,
        goal: 15
      }
    },
    formatCurrency: (amount) => `$${amount}`
  })
}));

// Mock useSubscriptions hook
jest.mock('../../hooks/useSubscriptions', () => ({
  useSubscriptions: () => ({
    prioritySubscriptions: [
      { id: 3, name: 'Adobe Creative Cloud', amount: 52.99, status: 'unused' },
      { id: 4, name: 'Disney+', amount: 7.99, status: 'forgotten' }
    ]
  })
}));

describe('Dashboard', () => {
  test('renders all stat cards correctly', () => {
    render(
      <AppProvider>
        <Dashboard />
      </AppProvider>
    );

    expect(screen.getByText('Monthly Savings Potential')).toBeInTheDocument();
    expect(screen.getByText('$90.97')).toBeInTheDocument();
    expect(screen.getByText('Current Monthly Spend')).toBeInTheDocument();
    expect(screen.getByText('$139.95')).toBeInTheDocument();
    expect(screen.getByText('Email Overload')).toBeInTheDocument();
    expect(screen.getByText('34')).toBeInTheDocument();
    expect(screen.getByText('Savings Goal Progress')).toBeInTheDocument();
    expect(screen.getByText('82.6%')).toBeInTheDocument();
  });

  test('shows priority action alert when unused subscriptions exist', () => {
    render(
      <AppProvider>
        <Dashboard />
      </AppProvider>
    );

    expect(screen.getByText('Priority Action Needed')).toBeInTheDocument();
    expect(screen.getByText(/2 unused subscriptions/)).toBeInTheDocument();
    expect(screen.getByText(/save you \$60.98\/month/)).toBeInTheDocument();
  });

  test('displays CleanSlate v3 ready message', () => {
    render(
      <AppProvider>
        <Dashboard />
      </AppProvider>
    );

    expect(screen.getByText('CleanSlate v3 is Ready!')).toBeInTheDocument();
    expect(screen.getByText('✅ Context API')).toBeInTheDocument();
    expect(screen.getByText('✅ Custom Hooks')).toBeInTheDocument();
    expect(screen.getByText('✅ Modular Components')).toBeInTheDocument();
    expect(screen.getByText('✅ PWA Support')).toBeInTheDocument();
  });
});
