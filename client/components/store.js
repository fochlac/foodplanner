import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import reducers from './reducers.js';
import { apiMiddleware } from './middleware/api.js';
import { addActionId } from './middleware/addActionId.js';
import { handleAssync } from './middleware/handleAssync.js';
import { logMiddleware } from './middleware/logger.js';
import { localDb } from './middleware/localDb.js';

export function configureStore(initialState = {}) {
  const store = createStore(
    reducers,
    initialState,
    applyMiddleware(thunkMiddleware, addActionId, apiMiddleware, localDb, logMiddleware, handleAssync)
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