const Enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');
const chai = require('chai');
Enzyme.configure({ adapter: new Adapter() });

var jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { document } = (new JSDOM('', {
	  url: "https://example.org/"
	})).window;
global.document = document;

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
