/*global Response, Blob, clients, self, caches, Request, Headers, console, fetch, navigator, setInterval, clearInterval, clearTimeout, setTimeout, indexedDB */

'use strict'
const serverUrl = location.origin
let version = '33',
  dbVersion = '2',
  assets = global.serviceWorkerOption.assets.map(asset => serverUrl + '/static' + asset),
  offline = new Response(new Blob(), { status: 279 }),
  staticContent = [...assets, '/manifest.json'],
  requestStack = [],
  stackTimer,
  flushInProgress,
  pushEventStack = [],
  pushTimeout,
  staticRegex = staticContent.length ? new RegExp(staticContent.map(str => str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')).join('$|') + '$') : undefined

// handle push messages
function handle_push(event) {
  let msg = event.data.json()

  // wait use waitUntil to prevent service worker from unloading while it processes the message
  event.waitUntil(
    initDb('food', 'userData')
      .then(db => {
        return db.get('user')
      })
      .then(user => {
        // show notification, send post-message for refresh, do whatever
        if (msg.type === 'creationNotice' && user.creationNotice_notification === 1) {
          return self.registration.showNotification('Neues Angebot vorhanden!', {
            body: formatDateTime(msg.data.time) + ': ' + msg.data.name,
            icon: msg.data.image ? serverUrl + msg.data.image : '',
            requireInteraction: true,
          })
        } else if (msg.type === 'deadlineReminder' && user.deadlineReminder_notification === 1) {
          return self.registration.showNotification('Letzte Anmeldemöglichkeit!', {
            body: formatDateTime(msg.data.time) + ': ' + msg.data.name + '\nAnmeldung bis: ' + formatDateTime(msg.data.deadline),
            icon: msg.data.image ? serverUrl + msg.data.image : '',
            requireInteraction: true,
          })
        }
      }),
  )
}

function triggerOfflineWarning(state) {
  clients.matchAll().then(clientList => {
    clientList.forEach(client => {
      if (client.url.includes(serverUrl)) {
        client.postMessage({
          message: 'offline',
          payload: { state },
        })
      }
    })
  })
}

function handle_click(event) {
  self.registration.getNotifications().then(list => list.forEach(notification => notification.close()))

  event.waitUntil(
    clients
      .matchAll()
      .then(function(clientList) {
        let exists = clientList.some(client => {
          if (client.url.indexOf(serverUrl) !== -1 && 'focus' in client) {
            return client.focus()
          }
        })
        if (!exists && clients.openWindow) {
          return clients.openWindow(serverUrl)
        }
      })
      .catch(err => console.warn(err)),
  )
}

function handle_fetch(event) {
  if (
    event.request.url.includes('food-dev') ||
    event.request.url.includes('localhost') ||
    // Ensure that chrome-extension:// requests don't trigger the default route.
    event.request.url.indexOf('http') !== 0
  ) {
    return
  }

  if (staticRegex && staticRegex.test(event.request.url)) {
    event.respondWith(
      caches
        .open(version)
        .then(cache => {
          return cache.match(event.request.clone())
        })
        .then(res => {
          if (res) {
            return res
          } else {
            cacheStatic()
            return fetch(event.request).catch(err => console.warn(err))
          }
        })
        .catch(err => console.warn(err)),
    )
  } else if (event.request.url.indexOf('/static/') !== -1) {
    event.respondWith(
      caches
        .open(version)
        .then(cache => cache.match(event.request))
        .then(res => {
          if (res) {
            return res
          } else {
            let req = event.request

            return Promise.all([fetch(req.clone()), caches.open(version)]).then(results => {
              let res = results[0],
                cache = results[1]

              cache.put(req.clone(), res.clone())
              return res
            })
          }
        })
        .catch(err => console.warn(err)),
    )
  } else if (event.request.method === 'GET') {
    let req = event.request.clone()
    event.respondWith(
      Promise.all([fetch(event.request), caches.open(version)])
        .then(result => {
          result[1].put(req.clone(), result[0].clone())
          return result[0]
        })
        .catch(() => {
          triggerOfflineWarning(true)
          return caches
            .open(version)
            .then(cache => {
              return cache.match(req)
            })
            .then(res => {
              if (res) {
                return res
              } else {
                return offline.clone()
              }
            })
            .catch(err => console.warn(err))
        }),
    )
  }
}

function cacheStatic() {
  return caches
    .keys()
    .then(keys => Promise.all(keys.map(key => caches.delete(key))))
    .catch(err => console.log('error deleting cache', err))
    .then(() => caches.open(version))
    .then(function(cache) {
      return cache.addAll(staticContent)
    })
    .catch(err => console.warn(err))
}

function initDb(DBName, storageName) {
  let request = dbVersion ? indexedDB.open(DBName, dbVersion) : indexedDB.open(DBName),
    db

  return new Promise((resolve, reject) => {
    request.onupgradeneeded = function() {
      var db = this.result
      if (!db.objectStoreNames.contains(storageName)) {
        db.createObjectStore(storageName, {
          keyPath: 'key',
        })
      }
    }

    request.onerror = reject

    request.onsuccess = function() {
      db = this.result

      db.delete = id => {
        return new Promise((resolve, reject) => {
          var store = db.transaction([storageName], 'readwrite').objectStore(storageName),
            request = store.delete(id)

          request.onsuccess = evt => resolve(evt)
          request.onerror = evt => reject(evt)
        })
      }

      db.deleteAll = () => {
        return new Promise((resolve, reject) => {
          var store = db.transaction([storageName], 'readwrite').objectStore(storageName),
            request = store.openCursor()

          request.onsuccess = evt => {
            let cursor = evt.target.result
            if (cursor) {
              cursor.delete()
              cursor.continue()
            } else {
              resolve(evt)
            }
          }

          request.onerror = evt => reject(evt)
        })
      }

      db.get = id => {
        return new Promise((resolve, reject) => {
          var store = db.transaction([storageName], 'readonly').objectStore(storageName),
            request = store.get(id)

          request.onsuccess = evt => resolve(evt.target.result ? evt.target.result.data : {})
          request.onerror = evt => reject(evt)
        })
      }

      db.getIndex = () => {
        return new Promise((resolve, reject) => {
          var store = db.transaction([storageName], 'readonly').objectStore(storageName),
            request = store.getAllKeys()

          request.onsuccess = evt => resolve(evt.target.result ? evt.target.result : [])
          request.onerror = evt => reject(evt)
        })
      }

      db.set = function(id, data) {
        return new Promise((resolve, reject) => {
          var store = db.transaction([storageName], 'readwrite').objectStore(storageName),
            request = store.put({ key: id, data: data })

          request.onsuccess = evt => resolve(evt)
          request.onerror = evt => reject(evt)
        })
      }

      if (db.objectStoreNames.contains(storageName)) {
        resolve(db)
      } else {
        resolve(initDb(DBName, storageName, db.dbVersion + 1))
      }
    }
  })
}

self.addEventListener('notificationclick', handle_click)
// register event listener for web-push / gcm
self.addEventListener('push', handle_push)
self.addEventListener('fetch', handle_fetch)
self.addEventListener('install', event => {
  event.waitUntil(cacheStatic())
  self.skipWaiting()
})

function fill(val, n) {
  return ('0'.repeat(n) + val).slice(-n)
}

function formatDateTime(date) {
  const src = new Date(date)

  return `${src.getDate()}.${src.getMonth() + 1}.${src
    .getFullYear()
    .toString()
    .slice(2, 4)} - ${fill(src.getHours(), 2)}:${fill(src.getMinutes(), 2)}`
}
