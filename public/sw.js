const CACHE_NAME = 'cleanslate-v3.1.0';
const STATIC_CACHE_NAME = 'cleanslate-static-v3.1.0';
const DYNAMIC_CACHE_NAME = 'cleanslate-dynamic-v3.1.0';

// Strategii de cache diferite pentru diferite tipuri de resurse
const CACHE_STRATEGIES = {
  // Cache permanent pentru resurse statice
  CACHE_FIRST: [
    '/',
    '/manifest.json',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
    '/_next/static/'
  ],
  
  // Network first pentru API-uri
  NETWORK_FIRST: [
    '/api/subscriptions',
    '/api/emails',
    '/api/analytics'
  ],
  
  // Nu pune în cache deloc
  NO_CACHE: [
    '/api/auth',
    '/api/payments',
    '/api/user/sensitive'
  ]
};

// Instalare service worker
self.addEventListener('install', event => {
  console.log('SW: Installing service worker...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then(cache => {
        console.log('SW: Caching static assets');
        return cache.addAll([
          '/',
          '/manifest.json',
          '/icons/icon-192x192.png',
          '/icons/icon-512x512.png'
        ]);
      })
      .then(() => {
        console.log('SW: Installation complete');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('SW: Installation failed:', error);
      })
  );
});

// Activare service worker
self.addEventListener('activate', event => {
  console.log('SW: Activating service worker...');
  
  event.waitUntil(
    Promise.all([
      // Cleanup old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => 
              cacheName.startsWith('cleanslate-') && 
              cacheName !== STATIC_CACHE_NAME && 
              cacheName !== DYNAMIC_CACHE_NAME
            )
            .map(cacheName => {
              console.log('SW: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      }),
      
      // Take control of all clients
      self.clients.claim()
    ]).then(() => {
      console.log('SW: Activation complete');
    })
  );
});

// Fetch interceptor cu strategii inteligente
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests și cross-origin requests
  if (request.method !== 'GET' || !url.origin.includes(self.location.origin)) {
    return;
  }

  // Determină strategia de cache
  const strategy = getCacheStrategy(url.pathname);
  
  switch (strategy) {
    case 'CACHE_FIRST':
      event.respondWith(handleCacheFirst(request));
      break;
    case 'NETWORK_FIRST':
      event.respondWith(handleNetworkFirst(request));
      break;
    case 'NO_CACHE':
      event.respondWith(fetch(request));
      break;
    default:
      event.respondWith(handleStaleWhileRevalidate(request));
  }
});

function getCacheStrategy(pathname) {
  for (const [strategy, patterns] of Object.entries(CACHE_STRATEGIES)) {
    if (patterns.some(pattern => pathname.startsWith(pattern))) {
      return strategy;
    }
  }
  return 'STALE_WHILE_REVALIDATE';
}

async function handleCacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('SW: Cache first failed:', error);
    return new Response('Offline', { 
      status: 503, 
      statusText: 'Service Unavailable' 
    });
  }
}

async function handleNetworkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.warn('SW: Network failed, trying cache:', error);
    
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    return new Response(JSON.stringify({ 
      error: 'Offline', 
      message: 'This feature requires internet connection' 
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleStaleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  // Fetch în background pentru update
  const fetchPromise = fetch(request).then(networkResponse => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(error => {
    console.warn('SW: Background fetch failed:', error);
    return cachedResponse;
  });

  // Returnează cached response imediat dacă există
  return cachedResponse || fetchPromise;
}

// Push notifications handler
self.addEventListener('push', event => {
  if (!event.data) return;

  try {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-192x192.png',
      vibrate: [200, 100, 200],
      data: data.data || {},
      actions: data.actions || []
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  } catch (error) {
    console.error('SW: Push notification error:', error);
  }
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  event.notification.close();

  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});
