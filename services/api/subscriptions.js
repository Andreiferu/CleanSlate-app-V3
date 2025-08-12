import { BaseAPIService } from './base.js';

class SubscriptionsService extends BaseAPIService {
  constructor() {
    super('/api');
  }

  async getSubscriptions() {
    try {
      return await this.request('/subscriptions');
    } catch (error) {
      console.error('Failed to fetch subscriptions:', error);
      
      // Fallback la date locale
      console.warn('Using fallback data due to API error');
      return this.getDefaultSubscriptions();
    }
  }

  async updateSubscription(id, updates) {
    try {
      return await this.request(`/subscriptions/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates)
      });
    } catch (error) {
      console.error('Failed to update subscription:', error);
      throw error;
    }
  }

  async cancelSubscription(id) {
    try {
      return await this.request(`/subscriptions/${id}/cancel`, {
        method: 'POST'
      });
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      throw error;
    }
  }

  getDefaultSubscriptions() {
    return [
      { id: 1, name: 'Netflix', amount: 15.99, status: 'active', lastUsed: '2 days ago', category: 'Entertainment', logo: '🎬', nextBilling: '2025-08-15', yearlyDiscount: 0 },
      { id: 2, name: 'Spotify Premium', amount: 9.99, status: 'active', lastUsed: '1 hour ago', category: 'Music', logo: '🎵', nextBilling: '2025-08-12', yearlyDiscount: 20 },
      { id: 3, name: 'Adobe Creative Cloud', amount: 52.99, status: 'unused', lastUsed: '3 months ago', category: 'Software', logo: '🎨', nextBilling: '2025-08-20', yearlyDiscount: 16 },
      { id: 4, name: 'Disney+', amount: 7.99, status: 'forgotten', lastUsed: '6 months ago', category: 'Entertainment', logo: '🏰', nextBilling: '2025-08-18', yearlyDiscount: 0 },
      { id: 5, name: 'LinkedIn Premium', amount: 29.99, status: 'unused', lastUsed: '2 months ago', category: 'Professional', logo: '💼', nextBilling: '2025-08-25', yearlyDiscount: 25 },
      { id: 6, name: 'Canva Pro', amount: 12.99, status: 'paused', lastUsed: '1 month ago', category: 'Design', logo: '🎯', nextBilling: 'Paused', yearlyDiscount: 10 },
      { id: 7, name: 'GitHub Pro', amount: 4.00, status: 'active', lastUsed: 'Today', category: 'Development', logo: '💻', nextBilling: '2025-08-11', yearlyDiscount: 16 },
      { id: 8, name: 'Notion Pro', amount: 8.00, status: 'active', lastUsed: 'Yesterday', category: 'Productivity', logo: '📝', nextBilling: '2025-08-14', yearlyDiscount: 20 }
    ];
  }
}

export const subscriptionsService = new SubscriptionsService();
