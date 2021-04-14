//IMPORTS
importScripts('/js/sw-utils.js');

var STATIC_CACHE = 'statics-v1';
var DYNAMIC_CACHE = 'dynamic-v1';
var INMUTABLE_CACHE = 'inmutable-v1';
const CACHE_CONTAINING_ERROR_MESSAGES = 'errores-cache=v1';

var APP_SHELL = [
    '/',
    'index.html',
    'css/styles.css',
    'img/favicon.png',
    './img/1.png',
    './img/2.png',
    './img/3.png',
    './img/4.png',
    './img/5.png',
    './img/6.png',
    './img/facebook.png',
    './img/instagram.png',
    './img/twitter.png',
    './img/favicon-1024.png',
    './img/favicon-512.png',
    './img/favicon-384.png',
    './img/favicon-256.png',
    './img/favicon-192.png',
    './img/favicon-128.png',
    './img/favicon-96.png',
    './img/favicon-64.png',
    './img/favicon-32.png',
    './img/favicon-16.png',
    'main.js',
    'js/sw-utils.js'
];


//INSTALAR EL SW
var APP_SHELL_INMUTABLE = [
    'https://code.jquery.com/jquery-3.6.0.min.js'
];

self.addEventListener('install', e => {

    var cacheStatics = caches.open(STATIC_CACHE).then(cache =>
        cache.addAll(APP_SHELL)
    );

    var cacheInmutable = caches.open(INMUTABLE_CACHE).then(cache =>
        cache.addAll(APP_SHELL_INMUTABLE)
    );

    e.waitUntil(Promise.all([cacheStatics, cacheInmutable]));

});

//BORRAR CACHE VIEJO Y ACTIVAR SW
self.addEventListener('activate', e => {

    var respuesta = caches.keys().then(keys => {

        keys.forEach(key => {

            if (key !== STATIC_CACHE && key.includes('static')) {
                return caches.delete(key);
            }
        });
    });
    e.waitUntil(respuesta);
});


self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;     // if valid response is found in cache return it
        } else {
          return fetch(event.request)     //fetch from internet
            .then(function(res) {
              return caches.open(DYNAMIC_CACHE)
                .then(function(cache) {
                  cache.put(event.request.url, res.clone());    //save the response for future
                  return res;   // return the fetched data
                })
            })
            .catch(function(err) {       // fallback mechanism
              return caches.open(CACHE_CONTAINING_ERROR_MESSAGES)
                .then(function(cache) {
                  return cache.match('/offline.html');
                });
            });
        }
      })
  );
});
// self.addEventListener('fetch', function(e) {
//
//     var respuesta = caches.match(e.request).then(function(resp) {
//
//         if (resp) {
//             return resp;
//         } else {
//             return fetch(e.request).then(function(newres) {
//
//                 return ActualizaCacheDinamico(DYNAMIC_CACHE, e.request, newres);
//             });
//         }
//     });
//
//     e.respondWith(respuesta);
//
// });
