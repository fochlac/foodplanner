export const logMiddleware = store => next => action => {
  console.log(JSON.stringify(action))
  next(action)
}
