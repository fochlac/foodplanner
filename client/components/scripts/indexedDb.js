const version = 2;

export const initDb = (DBName, storageName) => {
    let request = version ? indexedDB.open(DBName, version) : indexedDB.open(DBName),
        db;

    return new Promise((resolve, reject) => {
        request.onupgradeneeded = function() {
            var db = this.result;
            if (!db.objectStoreNames.contains(storageName)) {
                db.createObjectStore(storageName, {
                    keyPath: 'key'
                });
            }
        };

        request.onerror = reject;

        request.onsuccess = function() {
            db = this.result;

            db.set = function(id, data) {
                return new Promise( (resolve, reject) => {
                    var store = db.transaction([storageName], 'readwrite').objectStore(storageName),
                        request = store.put({key: id, data: data});

                    request.onsuccess = evt => resolve(evt);
                    request.onerror = evt => reject(evt);
                });
            };

            if (db.objectStoreNames.contains(storageName)) {
                resolve(db);
            } else {
                resolve(initDb(DBName, storageName, db.version + 1));
            }

        };
    });
};