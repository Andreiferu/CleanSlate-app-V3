import { BaseAPIService } from './base.js';

class EmailsService extends BaseAPIService {
  constructor() {
    super('/api');
  }

  async getEmails() {
    try {
      return await this.request('/emails');
    } catch (error) {
      console.error('Failed to fetch emails:', error);
      console.warn('Using fallback email data due to API error');
      return this.getDefaultEmails();
    }
  }

  async updateEmail(id, updates) {
    try {
      return await this.request(`/emails/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates)
      });
    } catch (error) {
      console.error('Failed to update email:', error);
      throw error;
    }
  }

  async bulkUnsubscribe(emailIds) {
    try {
      return await this.request('/emails/bulk-unsubscribe', {
        method: 'POST',
        body: JSON.stringify({ emailIds })
      });
    } catch (error) {
      console.error('Failed to bulk unsubscribe:', error);
      throw error;
    }
  }

  getDefaultEmails() {
    return [
      // Tech & News
      { 
        id: 1, 
        sender: 'TechCrunch', 
        type: 'newsletter', 
        frequency: 'daily', 
        unsubscribed: false, 
        emailsPerWeek: 7, 
        category: 'Tech News', 
        importance: 'medium',
        logo: '📱',
        description: 'Latest startup and technology news'
      },
      { 
        id: 2, 
        sender: 'The Verge', 
        type: 'newsletter', 
        frequency: 'daily', 
        unsubscribed: false, 
        emailsPerWeek: 5, 
        category: 'Tech News', 
        importance: 'medium',
        logo: '⚡',
        description: 'Technology, science, art, and culture'
      },
      
      // Shopping & Deals
      { 
        id: 3, 
        sender: 'Amazon', 
        type: 'promotional', 
        frequency: 'weekly', 
        unsubscribed: false, 
        emailsPerWeek: 3, 
        category: 'Shopping', 
        importance: 'medium',
        logo: '📦',
        description: 'Product recommendations and deals'
      },
      { 
        id: 4, 
        sender: 'Groupon', 
        type: 'promotional', 
        frequency: 'daily', 
        unsubscribed: false, 
        emailsPerWeek: 14, 
        category: 'Deals', 
        importance: 'low',
        logo: '🎫',
        description: 'Local deals and discounts'
      },
      { 
        id: 5, 
        sender: 'Best Buy', 
        type: 'promotional', 
        frequency: 'weekly', 
        unsubscribed: false, 
        emailsPerWeek: 4, 
        category: 'Electronics', 
        importance: 'low',
        logo: '🛒',
        description: 'Electronics deals and new arrivals'
      },
      
      // Professional & Learning
      { 
        id: 6, 
        sender: 'LinkedIn', 
        type: 'notification', 
        frequency: 'daily', 
        unsubscribed: false, 
        emailsPerWeek: 10, 
        category: 'Professional', 
        importance: 'high',
        logo: '💼',
        description: 'Job updates and professional networking'
      },
      { 
        id: 7, 
        sender: 'Medium', 
        type: 'newsletter', 
        frequency: 'weekly', 
        unsubscribed: true, 
        emailsPerWeek: 2, 
        category: 'Reading', 
        importance: 'high',
        logo: '📚',
        description: 'Curated articles and stories'
      },
      { 
        id: 8, 
        sender: 'Coursera', 
        type: 'promotional', 
        frequency: 'weekly', 
        unsubscribed: false, 
        emailsPerWeek: 2, 
        category: 'Education', 
        importance: 'high',
        logo: '🎓',
        description: 'Online course recommendations'
      },
      
      // Entertainment & Lifestyle
      { 
        id: 9, 
        sender: 'Spotify', 
        type: 'notification', 
        frequency: 'weekly', 
        unsubscribed: false, 
        emailsPerWeek: 1, 
        category: 'Music', 
        importance: 'medium',
        logo: '🎵',
        description: 'New music and playlist updates'
      },
      { 
        id: 10, 
        sender: 'Netflix', 
        type: 'notification', 
        frequency: 'weekly', 
        unsubscribed: false, 
        emailsPerWeek: 2, 
        category: 'Entertainment', 
        importance: 'medium',
        logo: '🎬',
        description: 'New shows and movie recommendations'
      },
      
      // Finance & Banking
      { 
        id: 11, 
        sender: 'Chase Bank', 
        type: 'notification', 
        frequency: 'monthly', 
        unsubscribed: false, 
        emailsPerWeek: 1, 
        category: 'Banking', 
        importance: 'high',
        logo: '🏦',
        description: 'Account statements and security alerts'
      },
      { 
        id: 12, 
        sender: 'Mint', 
        type: 'notification', 
        frequency: 'weekly', 
        unsubscribed: false, 
        emailsPerWeek: 1, 
        category: 'Finance', 
        importance: 'high',
        logo: '💰',
        description: 'Budget insights and bill reminders'
      },
      
      // Spam & Low Priority
      { 
        id: 13, 
        sender: 'Daily Horoscope', 
        type: 'promotional', 
        frequency: 'daily', 
        unsubscribed: false, 
        emailsPerWeek: 7, 
        category: 'Lifestyle', 
        importance: 'low',
        logo: '🔮',
        description: 'Daily horoscope predictions'
      },
      { 
        id: 14, 
        sender: 'Recipe of the Day', 
        type: 'newsletter', 
        frequency: 'daily', 
        unsubscribed: false, 
        emailsPerWeek: 7, 
        category: 'Food', 
        importance: 'low',
        logo: '👨‍🍳',
        description: 'Daily cooking recipes and tips'
      },
      { 
        id: 15, 
        sender: 'Fashion Deals', 
        type: 'promotional', 
        frequency: 'daily', 
        unsubscribed: false, 
        emailsPerWeek: 10, 
        category: 'Fashion', 
        importance: 'low',
        logo: '👗',
        description: 'Fashion sales and new arrivals'
      }
    ];
  }
}

export const emailsService = new EmailsService();
