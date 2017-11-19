const users = (state = [], action) => {
    switch (action.type) {
        case 'SELECT_MAIL':
        case 'INITIAL_USER':
        	let newData = Object.assign({}, action.mail, {mailId: action.mail.id});
        	delete newData.id;

            return Object.assign({}, state, newData);

        default:
            return state
    }
}

export default users;