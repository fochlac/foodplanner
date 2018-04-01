export const logMiddleware = store => next => action => {
  console.log(JSON.stringify(action, false, 2))
  next(action)
}
