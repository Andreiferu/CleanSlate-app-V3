class APIError extends Error {
  constructor(message, status, response) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.response = response;
  }
}

class BaseAPIService {
  constructor(baseURL = '/api') {
    this.baseURL = baseURL;
    this.retryAttempts = 3;
    this.retryDelay = 1000;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    return this.retryRequest(url, config);
  }

  async retryRequest(url, config, attempt = 1) {
    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new APIError(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          errorData
        );
      }

      return await response.json();
    } catch (error) {
      if (attempt < this.retryAttempts && this.shouldRetry(error)) {
        console.warn(`Request failed, retrying in ${this.retryDelay}ms... (${attempt}/${this.retryAttempts})`);
        await this.delay(this.retryDelay);
        return this.retryRequest(url, config, attempt + 1);
      }
      
      throw error;
    }
  }

  shouldRetry(error) {
    // Retry pe network errors sau 5xx server errors
    return !error.status || error.status >= 500;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export { BaseAPIService, APIError };
