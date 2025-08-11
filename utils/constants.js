export const APP_CONFIG = {
  name: 'CleanSlate v3',
  version: '3.0.0',
  description: 'Digital Life Decluttering Platform',
  
  features: {
    aiAssistant: true,
    pushNotifications: true,
    analytics: true,
    exportData: true
  },
  
  validation: {
    minSubscriptionAmount: 0.01,
    maxSubscriptionAmount: 9999.99,
    maxSubscriptionNameLength: 100,
    maxEmailLength: 254
  },
  
  defaults: {
    savingsGoal: 300,
    currency: 'USD',
    theme: 'light'
  }
};

export const SUBSCRIPTION_STATUSES = {
  ACTIVE: 'active',
  UNUSED: 'unused',
  FORGOTTEN: 'forgotten',
  PAUSED: 'paused',
  CANCELLED: 'cancelled'
};

export const EMAIL_TYPES = {
  PROMOTIONAL: 'promotional',
  NEWSLETTER: 'newsletter',
  NOTIFICATION: 'notification'
};

export const INSIGHT_TYPES = {
  WARNING: 'warning',
  TIP: 'tip',
  SUCCESS: 'success',
  INFO: 'info'
};
