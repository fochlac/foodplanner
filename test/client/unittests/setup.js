const Enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');
const chai = require('chai');
Enzyme.configure({ adapter: new Adapter() });

var jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { document } = (new JSDOM('', {
	  url: "https://example.org/",
	})).window;
global.document = Object.assign({}, document);

var exposedProperties = ['window', 'navigator', 'document', 'location'];
global.window = document.defaultView;
Object.keys(document.defaultView).forEach((property) => {
    if (typeof global[property] === 'undefined') {
        exposedProperties.push(property);
        global[property] = document.defaultView[property];
    }
});

global.navigator = {
    userAgent: 'node.js'
};
global.location = {
    origin: 'http://testsite.de/',
    href: 'http://testsite.de/'
};
global.FormData = function() {
	this.obj = {};

	this.append = (key, val) => {
		this.obj[key] = val;
	}

	this.get = () => this.obj;
}
global.URL = {
	createObjectURL: () => 'data:image/jpeg;base64,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'
}
global.document.createElement = (type, preventLoop) => {
	global.unboundElement = document.createElement('type');
	return global.unboundElement;
}