const users = (state = [], action) => {
    switch (action.type) {
        case 'SELECT_MAIL':
            return Object.assign({}, state, action.mail);
        case 'INITIAL_USER':
            return Object.assign({}, state, action.data);
        case 'SAVE_SETTINGS':
        	if(action.status === "complete") {
        		return Object.assign({}, state.user, action.locally);
        	}
        	return state;
        default:
            return state
    }
}

export default users;