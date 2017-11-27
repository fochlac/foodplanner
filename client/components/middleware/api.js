export const apiMiddleware = store => next => action => {
    if (action.api && action.status !== 'complete') {
        const originalAction = Object.assign({}, action),
            o = action.api;

        next(originalAction);
        let headers = {}
        switch(o.headers) {
            case 'formdata':
                headers = {
                  'Accept': 'application/json'
                }
                break;
            default:
                headers = {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                }
        }

        let opt = {
            credentials: 'same-origin',
            method: o.method,
            headers

        };

        if (o.body) {
            switch(o.headers) {
                case 'formdata':
                    opt.body = o.body;
                    break;
                case 'json':
                default:
                    opt.body = JSON.stringify(o.body);
            }
        }

        fetch(o.url, opt)
        .then(res => {
            action.timeDiff = Date.now() - +res.headers.get('timestamp');
            if (res.status >= 400) {
                return res.json().then(data => Promise.reject(data));
            }
            return res.json();
        })
        .then(data => {
            action.status = 'complete';
            action.data = data;
            if (action.type === 'SAVE_SETTINGS') {
                action.locally.mailId = data.id;
            }
            store.dispatch(action);
            if (action.enqueue) {
                store.dispatch(action.enqueue);
            }
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