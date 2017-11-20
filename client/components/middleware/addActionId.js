let counter = 1;

export const addActionId = store => next => action => {
    if (!action.actionId) {
        action.actionId = counter++;
    }
    next(action);
}