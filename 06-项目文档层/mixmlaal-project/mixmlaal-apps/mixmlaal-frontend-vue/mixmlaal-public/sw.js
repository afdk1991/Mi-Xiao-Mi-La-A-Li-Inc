/**
 * MIXMLAAL Service Worker
 * 版本: 0.0.0.4
 * 说明: 实现Web端离线模式，包括资源缓存和离线数据同步
 */

const CACHE_NAME = 'mixmlaal-v0.0.0.4';
const OFFLINE_URL = '/offline.html';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/static/css/main.css',
  '/static/js/main.js'
];

const API_CACHE_NAME = 'mixmlaal-api-v0.0.0.4';

self.addEventListener('install', event => {
  console.log('Service Worker 安装中...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('缓存静态资源');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  console.log('Service Worker 激活中...');

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => {
            return name.startsWith('mixmlaal-') &&
                   name !== CACHE_NAME &&
                   name !== API_CACHE_NAME;
          })
          .map(name => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') {
    return;
  }

  if (url.origin === location.origin) {
    if (url.pathname.startsWith('/api/')) {
      event.respondWith(handleApiRequest(request));
    } else {
      event.respondWith(handleStaticRequest(request));
    }
  } else {
    event.respondWith(handleExternalRequest(request));
  }
});

async function handleStaticRequest(request) {
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    fetchAndCache(request);
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('静态资源请求失败，返回离线页面');
    const offlineResponse = await caches.match(OFFLINE_URL);
    return offlineResponse;
  }
}

async function handleApiRequest(request) {
  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(API_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log('API请求失败，尝试从缓存获取');
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    return new Response(
      JSON.stringify({
        code: 503,
        message: '服务暂时不可用，请稍后重试',
        data: null
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

async function handleExternalRequest(request) {
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    return new Response(
      JSON.stringify({ error: '网络请求失败' }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

async function fetchAndCache(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
  } catch (error) {
    console.log('更新缓存失败:', error);
  }
}

self.addEventListener('sync', event => {
  console.log('后台同步事件:', event.tag);

  if (event.tag === 'sync-data') {
    event.waitUntil(syncOfflineData());
  }
});

async function syncOfflineData() {
  try {
    const clients = await self.clients.matchAll();

    for (const client of clients) {
      client.postMessage({
        type: 'SYNC_STARTED',
        timestamp: Date.now()
      });
    }

    console.log('离线数据同步完成');
  } catch (error) {
    console.error('同步失败:', error);
    throw error;
  }
}

self.addEventListener('message', event => {
  const { type, data } = event.data;

  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;

    case 'CACHE_STATIC_ASSETS':
      cacheStaticAssets(data.assets);
      break;

    case 'CLEAR_CACHE':
      clearAllCaches();
      break;

    case 'GET_CACHE_STATUS':
      getCacheStatus().then(status => {
        event.source.postMessage({
          type: 'CACHE_STATUS',
          data: status
        });
      });
      break;

    default:
      console.log('未知消息类型:', type);
  }
});

async function cacheStaticAssets(assets) {
  const cache = await caches.open(CACHE_NAME);

  for (const url of assets) {
    try {
      await cache.add(url);
    } catch (error) {
      console.error('缓存资源失败:', url, error);
    }
  }
}

async function clearAllCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames
      .filter(name => name.startsWith('mixmlaal-'))
      .map(name => caches.delete(name))
  );
}

async function getCacheStatus() {
  const cacheNames = await caches.keys();
  const mixmlaalCaches = cacheNames.filter(name => name.startsWith('mixmlaal-'));

  const status = {
    totalCaches: mixmlaalCaches.length,
    caches: []
  };

  for (const name of mixmlaalCaches) {
    const cache = await caches.open(name);
    const keys = await cache.keys();
    status.caches.push({
      name,
      size: keys.length
    });
  }

  return status;
}
