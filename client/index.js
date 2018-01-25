import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { store } from 'COMPONENTS/store.js'
import { Provider } from 'react-redux'
import AppRoot from 'ROOT/AppRoot.jsx';
require("font-awesome-webpack");
require.context('./static/', true, /.*/);

ReactDOM.render(
    <Provider store={store}>
        <AppRoot />
    </Provider>,
    document.getElementById('root')
);