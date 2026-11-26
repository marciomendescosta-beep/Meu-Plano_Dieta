
/* Service Worker — Meu Plano Márcio */

const CACHE_NAME = 'meu-plano-marcio-v1';

// Instalação
self.addEventListener('install', event => {
  self.skipWaiting();
});

// Ativação
self.addEventListener('activate', event => {
  event.waitUntil(
    self.clients.claim()
  );
});

// Receber notificações push
self.addEventListener('push', event => {
  let data = {
    title: 'Meu Plano — Márcio',
    body: 'Está na hora de cuidar da sua saúde!'
  };

  if (event.data) {
    try {
      data = {
        ...data,
        ...event.data.json()
      };
    } catch (e) {
      data.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      badge: undefined,
      tag: 'meu-plano-notificacao',
      renotify: true
    })
  );
});

// Ao tocar na notificação, abrir o aplicativo
self.addEventListener('notificationclick', event => {
  event.notification.close();

  event.waitUntil(
    (async () => {
      const url = new URL('./', self.registration.scope).href;

      const abas = await self.clients.matchAll({
        type: 'window',
        includeUncontrolled: true
      });

      for (const aba of abas) {
        if ('focus' in aba) {
          await aba.focus();
          return;
        }
      }

      if (self.clients.openWindow) {
        await self.clients.openWindow(url);
      }
    })()
  );
});
