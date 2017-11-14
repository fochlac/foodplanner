import { combineReducers } from 'redux';
import user from './reducers/user.js';
import meals from './reducers/meals.js';
import signups from './reducers/signups.js';
import app from './reducers/app.js';

const reducers = combineReducers({
    user,
    meals,
    signups,
    app
});

export default reducers;