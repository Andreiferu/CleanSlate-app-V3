// services/nordigen/subscriptionDetector.js
class SubscriptionDetector {
  constructor() {
    this.knownServices = {
      'netflix': { name: 'Netflix', category: 'Entertainment', logo: '🎬' },
      'spotify': { name: 'Spotify', category: 'Music', logo: '🎵' },
      'adobe': { name: 'Adobe', category: 'Software', logo: '🎨' },
      'disney': { name: 'Disney+', category: 'Entertainment', logo: '🏰' },
      'digi': { name: 'Digi', category: 'Telecom', logo: '📡' },
      'orange': { name: 'Orange', category: 'Telecom', logo: '📱' }
    };
  }

  async detectSubscriptions(transactions) {
    const merchantGroups = {};
    
    // Group by merchant
    transactions.forEach(t => {
      const merchant = this.extractMerchant(t);
      if (!merchantGroups[merchant]) {
        merchantGroups[merchant] = [];
      }
      merchantGroups[merchant].push(t);
    });

    // Detect subscriptions
    const subscriptions = [];
    Object.entries(merchantGroups).forEach(([merchant, trans]) => {
      if (trans.length >= 2) {
        const known = this.matchKnownService(merchant);
        subscriptions.push({
          name: known?.name || merchant,
          merchant: merchant,
          amount: Math.abs(parseFloat(trans[0].transactionAmount?.amount || trans[0].amount || 0)),
          frequency: trans.length >= 3 ? 'monthly' : 'irregular',
          category: known?.category || 'Other',
          logo: known?.logo || '📊',
          confidence: Math.min(0.95, 0.5 + (trans.length * 0.1)),
          transactionCount: trans.length,
          status: 'active'
        });
      }
    });

    return subscriptions;
  }

  extractMerchant(transaction) {
    return (transaction.creditorName || 
            transaction.merchant?.name || 
            transaction.remittanceInformationUnstructured || 
            'Unknown').toLowerCase().trim();
  }

  matchKnownService(merchant) {
    const searchText = merchant.toLowerCase();
    for (const [pattern, service] of Object.entries(this.knownServices)) {
      if (searchText.includes(pattern)) {
        return service;
      }
    }
    return null;
  }
}

let detector = null;
export function getSubscriptionDetector() {
  if (!detector) {
    detector = new SubscriptionDetector();
  }
  return detector;
}

export async function detectSubscriptions(transactions) {
  const detector = getSubscriptionDetector();
  return detector.detectSubscriptions(transactions);
}
