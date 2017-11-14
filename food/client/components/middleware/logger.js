export const logMiddleware = store => next => action => {
    console.log(action);
    next(action);
}