const translations = {
  en: {
    dashboard: {
      title: 'Dashboard',
      savingsPotential: 'Monthly Savings Potential',
      currentSpend: 'Current Monthly Spend',
      emailOverload: 'Email Overload',
      savingsGoal: 'Savings Goal Progress',
      readyMessage: 'CleanSlate v3 is Ready!',
      priorityAction: 'Priority Action Needed'
    },
    subscriptions: {
      title: 'Subscriptions',
      search: 'Search subscriptions...',
      cancel: 'Cancel',
      pause: 'Pause',
      reactivate: 'Reactivate',
      moreDetails: 'More details',
      lessDetails: 'Less details',
      lastUsed: 'Last used:',
      nextBilling: 'Next billing:',
      annualCost: 'Annual cost:',
      processing: 'Processing...'
    },
    emails: {
      title: 'Email Cleanup',
      comingSoon: 'Smart email management features coming in the next development phase!'
    },
    analytics: {
      title: 'Advanced Analytics',
      comingSoon: 'Comprehensive insights and AI recommendations coming soon!'
    },
    notifications: {
      subscriptionCancelled: '{name} cancelled. You\'ll save ${amount}/month!',
      subscriptionPaused: '{name} paused successfully',
      subscriptionReactivated: '{name} reactivated successfully'
    }
  },
  ro: {
    dashboard: {
      title: 'Tablou de Bord',
      savingsPotential: 'Potențial de Economii Lunare',
      currentSpend: 'Cheltuieli Lunare Curente',
      emailOverload: 'Supraîncărcare Email',
      savingsGoal: 'Progres Obiectiv Economii',
      readyMessage: 'CleanSlate v3 este Gata!',
      priorityAction: 'Acțiune Prioritară Necesară'
    },
    subscriptions: {
      title: 'Abonamente',
      search: 'Caută abonamente...',
      cancel: 'Anulează',
      pause: 'Pauză',
      reactivate: 'Reactivează',
      moreDetails: 'Mai multe detalii',
      lessDetails: 'Mai puține detalii',
      lastUsed: 'Ultima utilizare:',
      nextBilling: 'Următoarea facturare:',
      annualCost: 'Cost anual:',
      processing: 'Se procesează...'
    },
    emails: {
      title: 'Curățare Email',
      comingSoon: 'Funcționalitățile inteligente de gestionare email vin în următoarea fază!'
    },
    analytics: {
      title: 'Analize Avansate',
      comingSoon: 'Analize cuprinzătoare și recomandări AI vin curând!'
    },
    notifications: {
      subscriptionCancelled: '{name} anulat. Vei economisi ${amount}/lună!',
      subscriptionPaused: '{name} pus în pauză cu succes',
      subscriptionReactivated: '{name} reactivat cu succes'
    }
  }
};

class I18nService {
  constructor() {
    this.currentLocale = this.detectLocale();
    this.translations = translations;
  }

  detectLocale() {
    // Detectează limba din browser sau localStorage
    const stored = localStorage.getItem('cleanslate_locale');
    if (stored && this.translations[stored]) {
      return stored;
    }

    const browserLang = navigator.language.split('-')[0];
    return this.translations[browserLang] ? browserLang : 'en';
  }

  setLocale(locale) {
    if (this.translations[locale]) {
      this.currentLocale = locale;
      localStorage.setItem('cleanslate_locale', locale);
      
      // Trigger re-render
      window.dispatchEvent(new CustomEvent('localeChanged', { detail: locale }));
    }
  }

  t(key, params = {}) {
    const keys = key.split('.');
    let value = this.translations[this.currentLocale];

    for (const k of keys) {
      value = value?.[k];
    }

    if (!value) {
      console.warn(`Translation missing for key: ${key} in locale: ${this.currentLocale}`);
      return key;
    }

    // Replace parameters
    return value.replace(/\{(\w+)\}/g, (match, param) => {
      return params[param] !== undefined ? params[param] : match;
    });
  }

  formatCurrency(amount, locale = null) {
    const targetLocale = locale || this.currentLocale;
    const localeMap = {
      'en': 'en-US',
      'ro': 'ro-RO'
    };

    const currencyMap = {
      'en': 'USD',
      'ro': 'RON'
    };

    return new Intl.NumberFormat(localeMap[targetLocale] || 'en-US', {
      style: 'currency',
      currency: currencyMap[targetLocale] || 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }

  formatDate(date, locale = null) {
    const targetLocale = locale || this.currentLocale;
    const localeMap = {
      'en': 'en-US',
      'ro': 'ro-RO'
    };

    return new Intl.DateTimeFormat(localeMap[targetLocale] || 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(date));
  }
}

export const i18n = new I18nService();

// React hook pentru i18n
export function useTranslation() {
  const [locale, setLocale] = React.useState(i18n.currentLocale);

  React.useEffect(() => {
    const handleLocaleChange = (event) => {
      setLocale(event.detail);
    };

    window.addEventListener('localeChanged', handleLocaleChange);
    return () => window.removeEventListener('localeChanged', handleLocaleChange);
  }, []);

  return {
    t: i18n.t.bind(i18n),
    locale,
    setLocale: i18n.setLocale.bind(i18n),
    formatCurrency: i18n.formatCurrency.bind(i18n),
    formatDate: i18n.formatDate.bind(i18n)
  };
}
