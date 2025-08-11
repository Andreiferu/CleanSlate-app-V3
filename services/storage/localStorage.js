class LocalStorageService {
  constructor() {
    this.prefix = 'cleanslate_v3_';
  }

  setItem(key, value) {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(this.prefix + key, serializedValue);
      return true;
    } catch (error) {
      console.error('LocalStorage setItem error:', error);
      return false;
    }
  }

  getItem(key) {
    try {
      const item = localStorage.getItem(this.prefix + key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('LocalStorage getItem error:', error);
      return null;
    }
  }

  removeItem(key) {
    try {
      localStorage.removeItem(this.prefix + key);
      return true;
    } catch (error) {
      console.error('LocalStorage removeItem error:', error);
      return false;
    }
  }

  saveAppState(state) {
    return this.setItem('appState', {
      user: state.user,
      subscriptions: state.subscriptions,
      emails: state.emails,
      lastUpdated: new Date().toISOString()
    });
  }

  getAppState() {
    return this.getItem('appState');
  }
}

export const localStorageService = new LocalStorageService();
