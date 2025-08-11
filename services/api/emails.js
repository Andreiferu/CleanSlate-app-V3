class EmailsService {
  getDefaultEmails() {
    return [
      { id: 1, sender: 'TechCrunch', type: 'promotional', frequency: 'daily', unsubscribed: false, emailsPerWeek: 7, category: 'Tech News', importance: 'low' },
      { id: 2, sender: 'Groupon', type: 'promotional', frequency: 'daily', unsubscribed: false, emailsPerWeek: 14, category: 'Deals', importance: 'low' },
      { id: 3, sender: 'Amazon', type: 'promotional', frequency: 'weekly', unsubscribed: false, emailsPerWeek: 3, category: 'Shopping', importance: 'medium' },
      { id: 4, sender: 'Medium', type: 'newsletter', frequency: 'weekly', unsubscribed: true, emailsPerWeek: 2, category: 'Reading', importance: 'high' },
      { id: 5, sender: 'LinkedIn', type: 'notification', frequency: 'daily', unsubscribed: false, emailsPerWeek: 10, category: 'Professional', importance: 'high' }
    ];
  }
}

export const emailsService = new EmailsService();
