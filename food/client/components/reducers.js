import { combineReducers } from 'redux';
import user from './reducers/user.js';
import meals from './reducers/meals.js';
import signups from './reducers/signups.js';
import users from './reducers/users.js';
import app from './reducers/app.js';

const reducers = combineReducers({
    user,
    meals,
    signups,
    users,
    app
});

export default reducers;