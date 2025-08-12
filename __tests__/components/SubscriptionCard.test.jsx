import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SubscriptionCard from '../../components/features/subscriptions/SubscriptionCard';

const mockSubscription = {
  id: 1,
  name: 'Netflix',
  amount: 15.99,
  status: 'active',
  lastUsed: '2 days ago',
  category: 'Entertainment',
  logo: '🎬',
  nextBilling: '2025-08-15',
  yearlyDiscount: 0
};

const defaultProps = {
  subscription: mockSubscription,
  onCancel: jest.fn(),
  onPause: jest.fn(),
  onActivate: jest.fn()
};

describe('SubscriptionCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders subscription information correctly', () => {
    render(<SubscriptionCard {...defaultProps} />);
    
    expect(screen.getByText('Netflix')).toBeInTheDocument();
    expect(screen.getByText('$15.99')).toBeInTheDocument();
    expect(screen.getByText('Entertainment')).toBeInTheDocument();
    expect(screen.getByText('active')).toBeInTheDocument();
  });

  test('calls onCancel when cancel button is clicked', async () => {
    render(<SubscriptionCard {...defaultProps} />);
    
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    
    await waitFor(() => {
      expect(defaultProps.onCancel).toHaveBeenCalledWith(1);
    });
  });

  test('shows loading state during action', async () => {
    render(<SubscriptionCard {...defaultProps} />);
    
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    
    expect(screen.getByText('Cancelling...')).toBeInTheDocument();
  });

  test('shows pause button for active subscriptions', () => {
    render(<SubscriptionCard {...defaultProps} />);
    expect(screen.getByText('Pause')).toBeInTheDocument();
  });

  test('shows reactivate button for paused subscriptions', () => {
    const pausedSubscription = { ...mockSubscription, status: 'paused' };
    render(<SubscriptionCard {...defaultProps} subscription={pausedSubscription} />);
    expect(screen.getByText('Reactivate')).toBeInTheDocument();
  });

  test('expands details when more details button is clicked', () => {
    render(<SubscriptionCard {...defaultProps} />);
    
    const moreDetailsButton = screen.getByText('More details');
    fireEvent.click(moreDetailsButton);
    
    expect(screen.getByText('Annual cost:')).toBeInTheDocument();
    expect(screen.getByText('$191.88')).toBeInTheDocument();
  });

  test('is accessible with proper ARIA labels', () => {
    render(<SubscriptionCard {...defaultProps} />);
    
    expect(screen.getByLabelText(/Netflix subscription - active/)).toBeInTheDocument();
  });
});
