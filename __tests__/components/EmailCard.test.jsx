import { ChevronUp, ChevronDown } from 'lucide-react';
import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import EmailCard from '../../components/features/emails/EmailCard';

const mockEmail = {
  id: 1,
  sender: 'TechCrunch',
  type: 'newsletter',
  frequency: 'daily',
  unsubscribed: false,
  emailsPerWeek: 7,
  category: 'Tech News',
  importance: 'medium',
  logo: '📱'
};

const defaultProps = {
  email: mockEmail,
  onUnsubscribe: jest.fn(),
  onResubscribe: jest.fn(),
  onArchive: jest.fn()
};

describe('EmailCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders email information correctly', () => {
    render(<EmailCard {...defaultProps} />);
    
    expect(screen.getByText('TechCrunch')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText('Tech News')).toBeInTheDocument();
    expect(screen.getByText('daily')).toBeInTheDocument();
  });

  test('calculates time wasted correctly', () => {
    render(<EmailCard {...defaultProps} />);
    
    // 7 emails * 1.5 minutes = 10.5 minutes weekly
    expect(screen.getByText('10.5 min')).toBeInTheDocument();
  });

  test('shows unsubscribe button for active emails', () => {
    render(<EmailCard {...defaultProps} />);
    expect(screen.getByText('Unsubscribe')).toBeInTheDocument();
    expect(screen.getByText('Archive')).toBeInTheDocument();
  });

  test('shows resubscribe button for unsubscribed emails', () => {
    const unsubscribedEmail = { ...mockEmail, unsubscribed: true };
    render(<EmailCard {...defaultProps} email={unsubscribedEmail} />);
    
    expect(screen.getByText('Resubscribe')).toBeInTheDocument();
    expect(screen.queryByText('Unsubscribe')).not.toBeInTheDocument();
  });

  test('calls onUnsubscribe when unsubscribe button is clicked', async () => {
    render(<EmailCard {...defaultProps} />);
    
    const unsubscribeButton = screen.getByText('Unsubscribe');
    fireEvent.click(unsubscribeButton);
    
    await waitFor(() => {
      expect(defaultProps.onUnsubscribe).toHaveBeenCalledWith(1);
    });
  });

  test('expands details when more details button is clicked', () => {
    render(<EmailCard {...defaultProps} />);
    
    const moreDetailsButton = screen.getByText('More details');
    fireEvent.click(moreDetailsButton);
    
    expect(screen.getByText('Monthly emails:')).toBeInTheDocument();
    expect(screen.getByText('Annual emails:')).toBeInTheDocument();
  });
});
