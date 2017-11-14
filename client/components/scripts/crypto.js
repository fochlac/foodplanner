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
                        "salt": new TextEncoder().encode(salt),
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