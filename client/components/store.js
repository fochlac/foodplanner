import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import reducers from './reducers.js';
import { apiMiddleware } from './middleware/api.js';
import { addActionId } from './middleware/addActionId.js';
import { handleAssync } from './middleware/handleAssync.js';
import { handleErrors } from './middleware/handleErrors.js';
import { urlHandler } from './middleware/urlHandler.js';
import { logMiddleware } from './middleware/logger.js';
import { localDb } from './middleware/localDb.js';

const defaultStore = window.defaultStore ? window.defaultStore : {
    user: {
        name: ''
    },
    app: {
        dialog: '',
        errors: {}
    },
    meals: [
    ],
    signups: {
    }
};

export function configureStore(initialState = {}) {
  const store = createStore(
    reducers,
    initialState,
    applyMiddleware(thunkMiddleware, addActionId, apiMiddleware, localDb, urlHandler, handleAssync, handleErrors, logMiddleware)
  )
  return store;
};

export const store = configureStore(defaultStore);

