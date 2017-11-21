import { set_offline } from '../actions.js';

let offlineActions = {};

export const offlineData = store => next => action => {
    if (action.api && action.api.method.toLowerCase() === 'get') {
        if (action.timeDiff > 10000) {
            if (!offlineActions[action.type]) {
                if (!Object.keys(offlineActions).length) {
                    store.dispatch(set_offline(true));
                }
                offlineActions[action.type] = 'offline';
            }
            action.offline = true;
        } else if (Object.keys(offlineActions).length && offlineActions[action.type]) {
            delete offlineActions[action.type];
            if (!Object.keys(offlineActions).length) {
                store.dispatch(set_offline(false));
            }
        }
    }

    next(action);
}