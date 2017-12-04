const users = (state = {}, action) => {
    switch (action.type) {
        case 'INITIAL_USER':
            return Object.assign({}, state, action.data);
        case 'SAVE_SETTINGS':
            if(action.status === "complete") {
                return Object.assign({}, state, action.locally);
            }
            return state;
        case 'SIGNOUT':
        	return {};
        default:
            return state
    }
}

export default users;