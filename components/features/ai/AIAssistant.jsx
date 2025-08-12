import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, Send, X, Minimize2, Maximize2, 
  TrendingUp, DollarSign, Mail, Target,
} from 'lucide-react';
import { useApp } from '../../../context';
import { useAnalytics } from '../../../hooks';

const AIAssistant = React.memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const { state } = useApp();
  const { analytics } = useAnalytics(state.subscriptions, state.emails, state.user);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Welcome message
      setTimeout(() => {
        addAIMessage(getWelcomeMessage());
      }, 500);
    }
  }, [isOpen]);

  const getWelcomeMessage = () => {
    const potentialSavings = parseFloat(analytics.financial.potentialSavings);
    const emailOverload = analytics.emails.weeklyEmails;
    
    let message = "👋 Hi! I'm your CleanSlate AI assistant. I've analyzed your subscriptions and emails. ";
    
    if (potentialSavings > 50) {
      message += `I found you could save ${potentialSavings.toFixed(2)}/month! `;
    }
    
    if (emailOverload > 50) {
      message += `Also, you're getting ${emailOverload} emails/week - I can help reduce that. `;
    }
    
    message += "What would you like to optimize first?";
    
    return message;
  };

  const addAIMessage = (content, suggestions = []) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'ai',
      content,
      suggestions,
      timestamp: new Date()
    }]);
  };

  const addUserMessage = (content) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'user',
      content,
      timestamp: new Date()
    }]);
  };

  const generateAIResponse = async (userMessage) => {
    setIsTyping(true);
    
    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    const response = getSmartResponse(userMessage.toLowerCase());
    addAIMessage(response.message, response.suggestions);
    
    setIsTyping(false);
  };

  const getSmartResponse = (message) => {
    const subscriptions = state.subscriptions;
    const emails = state.emails;
    const unusedSubs = subscriptions.filter(s => s.status === 'unused' || s.status === 'forgotten');
    const lowPriorityEmails = emails.filter(e => e.importance === 'low' && !e.unsubscribed);
    
    // Keyword-based responses
    if (message.includes('save') || message.includes('money') || message.includes('budget')) {
      const savings = unusedSubs.reduce((sum, sub) => sum + sub.amount, 0);
      return {
        message: `💰 I found ${unusedSubs.length} unused subscriptions costing you ${savings.toFixed(2)}/month! The biggest waste is ${unusedSubs[0]?.name} at ${unusedSubs[0]?.amount}/month. Want me to help you cancel them?`,
        suggestions: ['Cancel unused subscriptions', 'Show me yearly discounts', 'Analyze my spending']
      };
    }
    
    if (message.includes('email') || message.includes('inbox') || message.includes('unsubscribe')) {
      const timeWasted = lowPriorityEmails.reduce((sum, email) => sum + email.emailsPerWeek, 0) * 1.5;
      return {
        message: `📧 You're receiving ${lowPriorityEmails.length} low-priority email sources that waste ${timeWasted.toFixed(1)} minutes/week. I can bulk unsubscribe you from things like daily horoscopes and fashion deals!`,
        suggestions: ['Bulk unsubscribe low priority', 'Show email breakdown', 'Optimize my inbox']
      };
    }
    
    if (message.includes('unused') || message.includes('cancel') || message.includes('forgotten')) {
      if (unusedSubs.length > 0) {
        return {
          message: `🎯 Here are your unused subscriptions:\n${unusedSubs.map(sub => `• ${sub.name}: ${sub.amount}/month (last used ${sub.lastUsed})`).join('\n')}\n\nShall I help you cancel these?`,
          suggestions: ['Cancel all unused', 'Review each individually', 'Set usage reminders']
        };
      } else {
        return {
          message: "🎉 Great news! You don't have any unused subscriptions. Your subscription management is on point!",
          suggestions: ['Check for yearly discounts', 'Optimize email subscriptions', 'Set spending alerts']
        };
      }
    }
    
    if (message.includes('goal') || message.includes('target') || message.includes('progress')) {
      const progress = (state.user.totalSaved / state.user.savingsGoal) * 100;
      const remaining = state.user.savingsGoal - state.user.totalSaved;
      return {
        message: `🎯 You're ${progress.toFixed(1)}% to your ${state.user.savingsGoal} savings goal! Just ${remaining.toFixed(2)} to go. At your current rate, you could reach it by canceling those unused subscriptions!`,
        suggestions: ['Update savings goal', 'Track monthly progress', 'Celebrate milestones']
      };
    }
    
    if (message.includes('analytics') || message.includes('report') || message.includes('analysis')) {
      const topCategory = Object.entries(
        subscriptions.filter(s => s.status === 'active')
          .reduce((acc, sub) => {
            acc[sub.category] = (acc[sub.category] || 0) + sub.amount;
            return acc;
          }, {})
      ).sort(([,a], [,b]) => b - a)[0];
      
      return {
        message: `📊 Quick analysis: You spend most on ${topCategory[0]} (${topCategory[1].toFixed(2)}/month). Your optimization score is ${Math.round(((parseFloat(analytics.financial.monthlySpend) - parseFloat(analytics.financial.potentialSavings)) / parseFloat(analytics.financial.monthlySpend)) * 100)}%. Want a detailed breakdown?`,
        suggestions: ['Show detailed analytics', 'Category breakdown', 'Spending trends']
      };
    }
    
    if (message.includes('hello') || message.includes('hi') || message.includes('help')) {
      return {
        message: "👋 Hello! I'm here to help you optimize your digital subscriptions and clean up your inbox. I can analyze your spending, find unused subscriptions, and reduce email overload. What would you like to work on?",
        suggestions: ['Find savings opportunities', 'Clean up my emails', 'Show me analytics', 'Set savings goals']
      };
    }
    
    // Default intelligent response
    const insights = [
      `You have ${subscriptions.filter(s => s.status === 'active').length} active subscriptions totaling ${analytics.financial.monthlySpend}/month.`,
      unusedSubs.length > 0 ? `${unusedSubs.length} subscriptions are unused and could be cancelled.` : 'All your subscriptions are being used!',
      lowPriorityEmails.length > 0 ? `${lowPriorityEmails.length} email sources are low-priority and could be cleaned up.` : 'Your email subscriptions look well-managed.',
    ];
    
    return {
      message: `🤖 ${insights.join(' ')} What specific area would you like me to help optimize?`,
      suggestions: ['Subscription analysis', 'Email cleanup', 'Savings recommendations', 'Usage insights']
    };
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    const userMsg = inputMessage.trim();
    setInputMessage('');
    addUserMessage(userMsg);
    
    await generateAIResponse(userMsg);
  };

  const handleSuggestionClick = async (suggestion) => {
    addUserMessage(suggestion);
    await generateAIResponse(suggestion);
  };

  const quickActions = [
    { icon: DollarSign, text: 'Find savings', action: () => handleSuggestionClick('Find savings opportunities') },
    { icon: Mail, text: 'Clean emails', action: () => handleSuggestionClick('Clean up my emails') },
    { icon: TrendingUp, text: 'Show analytics', action: () => handleSuggestionClick('Show me analytics') },
    { icon: Target, text: 'Check goals', action: () => handleSuggestionClick('Check my savings goals') }
  ];

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 relative group"
        >
          <Bot className="h-6 w-6" />
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            !
          </div>
          <div className="absolute bottom-full right-0 mb-2 bg-gray-900 text-white text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            AI Assistant - Click for insights!
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
      isMinimized ? 'w-80' : 'w-96'
    }`}>
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bot className="h-6 w-6" />
            <div>
              <h3 className="font-bold text-lg">CleanSlate AI</h3>
              <p className="text-xs opacity-90">Your optimization assistant</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 hover:bg-white/20 rounded transition-colors"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Quick Actions */}
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className="flex items-center space-x-2 p-2 bg-white rounded-lg hover:bg-blue-50 transition-colors text-sm"
                  >
                    <action.icon className="h-4 w-4 text-blue-500" />
                    <span className="text-gray-700">{action.text}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div className="h-80 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.type === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {message.type === 'ai' && (
                      <div className="flex items-center space-x-2 mb-2">
                        <Bot className="h-4 w-4 text-blue-500" />
                        <span className="text-xs font-medium text-blue-500">AI Assistant</span>
                      </div>
                    )}
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                    
                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="mt-3 space-y-1">
                        {message.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="block w-full text-left text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded hover:bg-blue-100 transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-3 rounded-2xl">
                    <div className="flex items-center space-x-2">
                      <Bot className="h-4 w-4 text-blue-500" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask me anything about your subscriptions..."
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}

        {isMinimized && (
          <div className="p-4 text-center">
            <Bot className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600">AI Assistant ready to help</p>
            <p className="text-xs text-gray-500">{messages.length} messages</p>
          </div>
        )}
      </div>
    </div>
  );
});

AIAssistant.displayName = 'AIAssistant';

export default AIAssistant;
