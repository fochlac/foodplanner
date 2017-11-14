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

let now = Date.now(),
    day = 3600000 * 24,
    tomorrow = now + day,
    tomorrow2 = now + day * 2,
    tomorrow3 = now + day * 3,
    yesterday = now - day;

export const store = configureStore({
    user: {
        login: true,
        id: 0,
        role: 100,
        changing: false
    },
    app: {
        dialog: 0
    },
    meals: [
        {
            id: 0,
            name: 'Mettwoch',
            description: 'Brötchensorten aus dem Netto, Rinder- und Schweinemett.',
            time: 1510743600000,
            deadline: 1510732800000,
            signups: [],
            signupLimit: 0,
            image: '/static/images/mett.jpg',
            options: [{name: '', type: 'select', options: ['Rindermett', 'Schweinemett']}]
        }
    ],
    signups: {
    },
    users: {
        0: {
            id: 0,
            anon: false,
            name: '',
            email: 'f.riedel@epages.com',
        },
        1: {
            id: 1,
            anon: false,
            name: 'Andreas G.',
            email: 'a.grohmann@epages.com',
        }
    }
});