import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AppProvider } from '../../context';
import AIAssistant from '../../components/features/ai/AIAssistant';

// Mock the analytics hook
jest.mock('../../hooks/useAnalytics', () => ({
  useAnalytics: () => ({
    analytics: {
      financial: {
        monthlySpend: '139.95',
        potentialSavings: '90.97'
      },
      emails: { weeklyEmails: 34 }
    }
  })
}));

describe('AIAssistant', () => {
  const renderWithProvider = (component) => {
    return render(
      <AppProvider>
        {component}
      </AppProvider>
    );
  };

  test('renders floating button when closed', () => {
    renderWithProvider(<AIAssistant />);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(screen.getByText('!')).toBeInTheDocument(); // Notification indicator
  });

  test('opens chat interface when button is clicked', () => {
    renderWithProvider(<AIAssistant />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(screen.getByText('CleanSlate AI')).toBeInTheDocument();
    expect(screen.getByText('Your optimization assistant')).toBeInTheDocument();
  });

  test('shows welcome message when opened', async () => {
    renderWithProvider(<AIAssistant />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText(/Hi! I'm your CleanSlate AI assistant/)).toBeInTheDocument();
    });
  });

  test('displays quick action buttons', () => {
    renderWithProvider(<AIAssistant />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(screen.getByText('Find savings')).toBeInTheDocument();
    expect(screen.getByText('Clean emails')).toBeInTheDocument();
    expect(screen.getByText('Show analytics')).toBeInTheDocument();
    expect(screen.getByText('Check goals')).toBeInTheDocument();
  });

  test('can send messages', async () => {
    renderWithProvider(<AIAssistant />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    const input = screen.getByPlaceholderText('Ask me anything about your subscriptions...');
    const sendButton = screen.getByRole('button', { name: /send/i });
    
    fireEvent.change(input, { target: { value: 'help me save money' } });
    fireEvent.click(sendButton);
    
    expect(screen.getByText('help me save money')).toBeInTheDocument();
    
    // Wait for AI response
    await waitFor(() => {
      expect(screen.getByText(/I found.*unused subscriptions/)).toBeInTheDocument();
    });
  });

  test('can be minimized and maximized', () => {
    renderWithProvider(<AIAssistant />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    const minimizeButton = screen.getByRole('button', { name: /minimize/i });
    fireEvent.click(minimizeButton);
    
    expect(screen.getByText('AI Assistant ready to help')).toBeInTheDocument();
    
    const maximizeButton = screen.getByRole('button', { name: /maximize/i });
    fireEvent.click(maximizeButton);
    
    expect(screen.getByPlaceholderText('Ask me anything about your subscriptions...')).toBeInTheDocument();
  });
});
