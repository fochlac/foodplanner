import React from 'react';
import ReactDOM from 'react-dom';
import { store } from './components/store.js'
import { Provider } from 'react-redux'
import Controller from './components/Controller.jsx';
require("font-awesome-webpack");
require.context('./static/', true, /.*/);

ReactDOM.render(
    <Provider store={store}>
        <Controller />
    </Provider>,
    document.getElementById('root')
);