import { initDb } from '../scripts/indexedDb.js';

export const localDb = store => next => action => {
    if (action.locally && !action.api || action.locally && action.status === 'complete') {
        initDb('food', 'userData')
            .then(db => db.set('user', action.locally))
            .catch(console.log)
            .then(() => next(action));
    } else {
        next(action);
    }
}