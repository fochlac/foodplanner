export const generateHash = (source) => {
    return window.crypto.subtle.importKey(
            "raw",
            new TextEncoder().encode(source),
            {"name": "PBKDF2"},
            false,
            ["deriveKey"]
        ).then(baseKey => {
            return window.crypto.subtle.deriveKey(
                    {
                        "name": "PBKDF2",
                        "salt": new TextEncoder().encode('mySecret123'),
                        "iterations": 100,
                        "hash": "SHA-256"
                    },
                    baseKey,
                    {"name": "AES-CBC", "length": 128},
                    true,
                    ["encrypt", "decrypt"]
                );
        }).then(aesKey => {
            return window.crypto.subtle.exportKey("raw", aesKey);
        }).then(rawKey => {
            return btoa(new Uint8Array(rawKey).reduce((data, byte) => data + String.fromCharCode(byte), '')).replace('==', '');
        });
}

export const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4),
        base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/'),
        rawData = window.atob(base64);

  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
};
