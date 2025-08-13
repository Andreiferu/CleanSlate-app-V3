import { useMemo } from 'react';
import { useApp } from '../context';

export function useEmails() {
  const { state, actions } = useApp();
  const { emails } = state;

  // Filtered emails by status
  const activeEmails = useMemo(() => {
    return emails.filter(email => !email.unsubscribed);
  }, [emails]);

  const unsubscribedEmails = useMemo(() => {
    return emails.filter(email => email.unsubscribed);
  }, [emails]);

  // Email statistics
  const emailStats = useMemo(() => {
    const active = emails.filter(email => !email.unsubscribed);
    const totalWeeklyEmails = active.reduce((sum, email) => sum + email.emailsPerWeek, 0);
    const totalTimeWasted = totalWeeklyEmails * 1.5; // 1.5 minutes per email
    
    // Group by category
    const byCategory = {};
    active.forEach(email => {
      if (!byCategory[email.category]) {
        byCategory[email.category] = {
          count: 0,
          weeklyEmails: 0,
          timeWasted: 0
        };
      }
      byCategory[email.category].count++;
      byCategory[email.category].weeklyEmails += email.emailsPerWeek;
      byCategory[email.category].timeWasted += email.emailsPerWeek * 1.5;
    });

    // Group by importance
    const byImportance = {};
    active.forEach(email => {
      if (!byImportance[email.importance]) {
        byImportance[email.importance] = {
          count: 0,
          weeklyEmails: 0,
          timeWasted: 0
        };
      }
      byImportance[email.importance].count++;
      byImportance[email.importance].weeklyEmails += email.emailsPerWeek;
      byImportance[email.importance].timeWasted += email.emailsPerWeek * 1.5;
    });

    return {
      total: emails.length,
      active: active.length,
      unsubscribed: emails.length - active.length,
      totalWeeklyEmails,
      totalTimeWasted,
      byCategory,
      byImportance
    };
  }, [emails]);

  // Priority emails (high volume, low importance)
  const priorityEmails = useMemo(() => {
    return emails
      .filter(email => !email.unsubscribed && email.emailsPerWeek > 5 && email.importance === 'low')
      .sort((a, b) => b.emailsPerWeek - a.emailsPerWeek);
  }, [emails]);

  return {
    emails,
    activeEmails,
    unsubscribedEmails,
    priorityEmails,
    emailStats,
    // Actions
    unsubscribeEmail: actions.unsubscribeEmail,
    resubscribeEmail: actions.resubscribeEmail,
    archiveEmail: actions.archiveEmail
  };
}
