// services/nordigen/auth.js
import { BaseAPIService } from '../api/base.js';

class NordigenAuthService extends BaseAPIService {
  constructor() {
    super('');
    this.baseURL = 'https://bankaccountdata.gocardless.com/api/v2';
    this.accessToken = null;
    this.refreshToken = null;
    this.tokenExpiry = null;
    
    // Credentials - acestea ar trebui să fie în variabile de mediu
    this.secretId = process.env.NEXT_PUBLIC_NORDIGEN_SECRET_ID;
    this.secretKey = process.env.NORDIGEN_SECRET_KEY;
  }

  async getAccessToken() {
    // Verifică dacă avem un token valid
    if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
      return this.accessToken;
    }

    // Obține un nou token
    try {
      const response = await fetch(`${this.baseURL}/token/new/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          secret_id: this.secretId,
          secret_key: this.secretKey
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to get access token: ${response.statusText}`);
      }

      const data = await response.json();
      
      this.accessToken = data.access;
      this.refreshToken = data.refresh;
      // Token-ul expiră în 24 ore
      this.tokenExpiry = new Date(Date.now() + (data.access_expires || 86400) * 1000);

      console.log('✅ Nordigen access token obtained');
      return this.accessToken;
    } catch (error) {
      console.error('❌ Failed to get Nordigen access token:', error);
      throw error;
    }
  }

  async refreshAccessToken() {
    if (!this.refreshToken) {
      return this.getAccessToken();
    }

    try {
      const response = await fetch(`${this.baseURL}/token/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh: this.refreshToken
        })
      });

      if (!response.ok) {
        // Dacă refresh-ul eșuează, obține un token nou
        return this.getAccessToken();
      }

      const data = await response.json();
      this.accessToken = data.access;
      this.tokenExpiry = new Date(Date.now() + (data.access_expires || 86400) * 1000);

      return this.accessToken;
    } catch (error) {
      console.error('Failed to refresh token, getting new one:', error);
      return this.getAccessToken();
    }
  }
}

// Singleton instance
let authService = null;

export function getNordigenAuth() {
  if (!authService) {
    authService = new NordigenAuthService();
  }
  return authService;
}

// Helper pentru request-uri autentificate
export async function nordigenRequest(endpoint, options = {}) {
  const auth = getNordigenAuth();
  const token = await auth.getAccessToken();
  
  const url = endpoint.startsWith('http') 
    ? endpoint 
    : `https://bankaccountdata.gocardless.com/api/v2/${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || error.message || `HTTP ${response.status}`);
  }

  return response.json();
}
