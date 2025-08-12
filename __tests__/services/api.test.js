import { BaseAPIService, APIError } from '../../services/api/base';
import { subscriptionsService } from '../../services/api/subscriptions';

// Mock fetch
global.fetch = jest.fn();

describe('BaseAPIService', () => {
  let apiService;

  beforeEach(() => {
    apiService = new BaseAPIService();
    fetch.mockClear();
  });

  describe('successful requests', () => {
    test('should make successful GET request', async () => {
      const mockData = { id: 1, name: 'Test' };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData
      });

      const result = await apiService.request('/test');
      
      expect(fetch).toHaveBeenCalledWith('/api/test', {
        headers: { 'Content-Type': 'application/json' }
      });
      expect(result).toEqual(mockData);
    });

    test('should make successful POST request with body', async () => {
      const mockData = { success: true };
      const postData = { name: 'Test' };
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData
      });

      const result = await apiService.request('/test', {
        method: 'POST',
        body: JSON.stringify(postData)
      });
      
      expect(fetch).toHaveBeenCalledWith('/api/test', {
        method: 'POST',
        body: JSON.stringify(postData),
        headers: { 'Content-Type': 'application/json' }
      });
      expect(result).toEqual(mockData);
    });
  });

  describe('error handling', () => {
    test('should throw APIError for 404', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({ message: 'Resource not found' })
      });

      await expect(apiService.request('/nonexistent')).rejects.toThrow(APIError);
      await expect(apiService.request('/nonexistent')).rejects.toThrow('Resource not found');
    });

    test('should retry on 500 error', async () => {
      fetch
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error',
          json: async () => ({ message: 'Server error' })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true })
        });

      const result = await apiService.request('/test');
      
      expect(fetch).toHaveBeenCalledTimes(2);
      expect(result).toEqual({ success: true });
    });

    test('should not retry on 4xx errors', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: async () => ({ message: 'Bad request' })
      });

      await expect(apiService.request('/test')).rejects.toThrow(APIError);
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    test('should handle network errors with retry', async () => {
      fetch
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true })
        });

      const result = await apiService.request('/test');
      
      expect(fetch).toHaveBeenCalledTimes(2);
      expect(result).toEqual({ success: true });
    });
  });
});

describe('SubscriptionsService', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('should fetch subscriptions successfully', async () => {
    const mockSubscriptions = [
      { id: 1, name: 'Netflix', amount: 15.99 },
      { id: 2, name: 'Spotify', amount: 9.99 }
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockSubscriptions
    });

    const result = await subscriptionsService.getSubscriptions();
    
    expect(fetch).toHaveBeenCalledWith('/api/subscriptions', {
      headers: { 'Content-Type': 'application/json' }
    });
    expect(result).toEqual(mockSubscriptions);
  });

  test('should fallback to default subscriptions on API error', async () => {
    fetch.mockRejectedValueOnce(new Error('API Error'));

    const result = await subscriptionsService.getSubscriptions();
    
    expect(result).toEqual(subscriptionsService.getDefaultSubscriptions());
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty('name');
  });

  test('should update subscription successfully', async () => {
    const mockResponse = { success: true };
    const updates = { status: 'cancelled' };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const result = await subscriptionsService.updateSubscription(1, updates);
    
    expect(fetch).toHaveBeenCalledWith('/api/subscriptions/1', {
      method: 'PATCH',
      body: JSON.stringify(updates),
      headers: { 'Content-Type': 'application/json' }
    });
    expect(result).toEqual(mockResponse);
  });

  test('should handle subscription update error', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: async () => ({ message: 'Server error' })
    });

    await expect(subscriptionsService.updateSubscription(1, {})).rejects.toThrow(APIError);
  });
});
