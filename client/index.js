import React from 'react';
import ReactDOM from 'react-dom';
import { store } from 'COMPONENTS/store.js'
import { Provider } from 'react-redux'
import Controller from 'COMPONENTS/Controller.jsx';
require("font-awesome-webpack");
require.context('./static/', true, /.*/);

ReactDOM.render(
    <Provider store={store}>
        <Controller />
    </Provider>,
    document.getElementById('root')
);