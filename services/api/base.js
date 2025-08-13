const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

// Custom API Error class
export class APIError extends Error {
  constructor(message, status, statusText, response = null) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.statusText = statusText;
    this.response = response;
  }
}

// Base API Service class
export class BaseAPIService {
  constructor(baseURL = '/api') {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json'
    };
    this.retryAttempts = 3;
    this.retryDelay = 1000; // 1 second
  }

  async request(path, options = {}) {
    const url = `${BASE_URL}${this.baseURL}${path}`;
    
    const config = {
      headers: {
        ...this.defaultHeaders,
        ...(options.headers || {})
      },
      ...options
    };

    return this.requestWithRetry(url, config);
  }

  async requestWithRetry(url, config, attempt = 1) {
    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await this.parseErrorResponse(response);
        
        // Don't retry client errors (4xx)
        if (response.status >= 400 && response.status < 500) {
          throw new APIError(
            errorData.message || `HTTP ${response.status} ${response.statusText}`,
            response.status,
            response.statusText,
            errorData
          );
        }
        
        // Retry server errors (5xx) if we have attempts left
        if (response.status >= 500 && attempt < this.retryAttempts) {
          console.warn(`API request failed (attempt ${attempt}/${this.retryAttempts}), retrying...`);
          await this.delay(this.retryDelay * attempt);
          return this.requestWithRetry(url, config, attempt + 1);
        }
        
        throw new APIError(
          errorData.message || `HTTP ${response.status} ${response.statusText}`,
          response.status,
          response.statusText,
          errorData
        );
      }

      return this.parseSuccessResponse(response);
    } catch (error) {
      // Handle network errors
      if (!(error instanceof APIError) && attempt < this.retryAttempts) {
        console.warn(`Network error (attempt ${attempt}/${this.retryAttempts}), retrying...`, error.message);
        await this.delay(this.retryDelay * attempt);
        return this.requestWithRetry(url, config, attempt + 1);
      }
      
      throw error;
    }
  }

  async parseErrorResponse(response) {
    try {
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        return await response.json();
      }
      return { message: await response.text() };
    } catch {
      return { message: `HTTP ${response.status} ${response.statusText}` };
    }
  }

  async parseSuccessResponse(response) {
    const contentType = response.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      return response.json();
    }
    
    return response.text();
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // HTTP method helpers
  async get(path, options = {}) {
    return this.request(path, { ...options, method: 'GET' });
  }

  async post(path, data, options = {}) {
    return this.request(path, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async put(path, data, options = {}) {
    return this.request(path, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async patch(path, data, options = {}) {
    return this.request(path, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }

  async delete(path, options = {}) {
    return this.request(path, { ...options, method: 'DELETE' });
  }
}

// Legacy API object for backward compatibility
async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    const error = new Error(`HTTP ${res.status} ${res.statusText} ${text ? `- ${text}` : ''}`);
    error.status = res.status;
    throw error;
  }
  
  const contentType = res.headers.get('content-type') || '';
  return contentType.includes('application/json') ? res.json() : res.text();
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
  del: (path) => request(path, { method: 'DELETE' }),
};

export default api;
