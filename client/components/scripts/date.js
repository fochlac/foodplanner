import moment from 'moment';

const second = 1000,
	minute = 60 * second,
	hour = 60 * minute,
	day = 24 * hour,
	week = 7 * day,
	year = 365 * day,
	tage = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];

function fill(val, n) {
    return ('0'.repeat(n) + val).slice(-n);
}

export const formatDate = (date) => {
    const src = new Date((date.toString().length === 10) ? (date * 1000) : date);

    return `${src.getDate()}.${src.getMonth() + 1}.${src.getFullYear().toString().slice(2,4)}`;
}

export const formatTime = (date) => {
    const src = new Date((date.toString().length === 10) ? (date * 1000) : date);

    return `${fill(src.getHours(), 2)}:${fill(src.getMinutes(), 2)}`;
}

export const formatDateTime = (date) => {
    const src = new Date((date.toString().length === 10) ? (date * 1000) : date);

    return `${src.getDate()}.${src.getMonth() + 1}.${src.getFullYear().toString().slice(2,4)} - ${fill(src.getHours(), 2)}:${fill(src.getMinutes(), 2)}`;
}
export const formatTimeShort = (date) => {
    const src = new Date((date.toString().length === 10) ? (date * 1000) : date),
    	diff = Date.now() - ((date.toString().length === 10) ? (date * 1000) : date);

    if (diff < -week) {
        `${src.getDate()}.${src.getMonth() + 1}${(diff < year) ? '' : ('.' + src.getFullYear())} ${fill(src.getHours(), 2)}:${fill(src.getMinutes(), 2)}`;
    } else if (diff < -day) {
        return `${tage[src.getDay()]}, ${src.getHours()}:${src.getMinutes()}`;
    } else if (diff < -hour) {
    	return `in ${-Math.floor(diff / hour)} Stunden`;
    } else if (diff < 0) {
        return `in ${-Math.floor(diff / minute)} Minuten`;
    } else if (diff < hour) {
        return `vor ${Math.floor(diff / minute)} Minuten`;
    } else if (diff < day) {
        return `vor ${Math.floor(diff / hour)} Stunden`;
    } else if (diff < week) {
    	return `${tage[src.getDay()]}, ${src.getHours()}:${src.getMinutes()}`;
    }
    return `${src.getDate()}.${src.getMonth() + 1}${(diff < year) ? '' : ('.' + src.getFullYear())} ${fill(src.getHours(), 2)}:${fill(src.getMinutes(), 2)}`;
}

export const getUnixDate = (date) => {

}

export const round = (date, duration) => {
    return moment(Math.ceil((+date) / (+duration)) * (+duration));
}

