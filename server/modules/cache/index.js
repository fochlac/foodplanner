let cache = {};


module.exports = {
    invalidateAll: () => {
        Object.keys(cache).forEach(key => cache[key] = {});
    },

    getCache: name => {
        if (!cache[name]) {
            cache[name] = {};
        }

        return {
            get: id => cache[name][id],

            put: (id, content) => cache[name][id] = content,

            delete: id => cache[name][id] = undefined,

            deleteAll: id => cache[name] = {},
        }
    }
}


