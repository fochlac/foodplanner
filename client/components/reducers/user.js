const users = (state = [], action) => {
    switch (action.type) {
        case 'SELECT_MAIL':
        case 'INITIAL_USER':
        	let newData = Object.assign({}, action.mail, {mailId: action.mail.id});
        	delete newData.id;

            return Object.assign({}, state, newData);
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