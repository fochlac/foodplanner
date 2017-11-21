import { set_busy } from '../actions.js';

let runningActions = {};

export const handleAssync = store => next => action => {
    if (action.status === 'initialized') {
        if (!Object.keys(runningActions).length) {
            store.dispatch(set_busy(true));
        }
        runningActions[action.actionId] = 'running';
    } else if (action.status === 'complete' || action.status === 'failure') {
        delete runningActions[action.actionId];
        if (!Object.keys(runningActions).length) {
            store.dispatch(set_busy(false));
        }
    }
    next(action);
}