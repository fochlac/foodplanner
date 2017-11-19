import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import reducers from './reducers.js';
import { apiMiddleware } from './middleware/api.js';
import { logMiddleware } from './middleware/logger.js';
import { localDb } from './middleware/localDb.js';

export function configureStore(initialState = {}) {
  const store = createStore(
    reducers,
    initialState,
    applyMiddleware(thunkMiddleware, apiMiddleware, localDb, logMiddleware)
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