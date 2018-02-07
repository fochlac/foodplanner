import runtime from 'SW/runtime';
import {urlBase64ToUint8Array} from './crypto.js';

// get GCM subscription details
export const getSubscription = () => {
    let swRegistration;

    // if service worker installed
    navigator.serviceWorker.ready
        .then((registration) => {
            swRegistration = registration;
            // try to get subscription
            return registration.pushManager.getSubscription();
        })
        .then((subscription) => {
            // if no subscription was provided yet, try to get registration with public VAPID-key
            return (subscription) ? subscription : swRegistration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array('BLaOlvhqet3tC5e6oIliQr5NF2Sqn8VHq9VjzR9ItF9AnHFgYaB3dN38rTuYC6tKSRxzzTFmMia6kJ_J2auGLCU')
            });
        })
        .catch(err => console.warn('registerServiceWorker error', err));
};

export const initServiceWorker = () => {
    if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost')) {
        let registration;

        return runtime.register()
            .then(reg => {
                registration = reg;
                return reg.pushManager.getSubscription();
            }).then((subscription) => {
                return (subscription) ? subscription : registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array('BLaOlvhqet3tC5e6oIliQr5NF2Sqn8VHq9VjzR9ItF9AnHFgYaB3dN38rTuYC6tKSRxzzTFmMia6kJ_J2auGLCU')
                });
            })
            .catch(err => console.warn('serviceWorker error', err));
    } else {
        return Promise.reject();
    }
};

export const getNotificationPermission = () => {
    return new Promise((resolve, reject) => {
        if (!("Notification" in window)) {
            reject();
        } else if (Notification.permission === "granted") {
            resolve();
        } else if (Notification.permission !== 'denied' || Notification.permission === "default") {
            Notification.requestPermission(function (permission) {
                if (permission === "granted") {
                    resolve();
                } else {
                    reject();
                }
            });
        } else {
            reject();
        }
    });
}