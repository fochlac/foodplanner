export const apiMiddleware = store => next => action => {
    if (action.api) {
        const originalAction = Object.assign({}, action),
            o = action.api;
        next(originalAction);

        let opt = {
            credentials: 'same-origin',
            method: o.method,
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
        };

        if (o.body) {
            opt.body = JSON.stringify(o.body);
        }

        fetch(o.url, opt)
        .then(res => {
            return res.json();
        })
        .then(data => {
            action.api = undefined;
            action.status = 'complete';
            action.data = data;
            store.dispatch(action);
        })
        .catch(err => {
            action.api = undefined;
            action.data = err;
            action.status = 'failure';
            store.dispatch(action);
        });
    } else {
        next(action);
    }
};