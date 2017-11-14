import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import reducers from './reducers.js';
import { apiMiddleware } from './middleware/api.js';
import { logMiddleware } from './middleware/logger.js';

export function configureStore(initialState = {}) {
  const store = createStore(
    reducers,
    initialState,
    applyMiddleware(thunkMiddleware, apiMiddleware, logMiddleware)
  )
  return store;
};

export const store = configureStore({
    user: {
        name: ''
    },
    app: {
        dialog: 0
    },
    meals: [
    ],
    signups: {
    }
});