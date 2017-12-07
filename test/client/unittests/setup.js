const Enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');
Enzyme.configure({ adapter: new Adapter() });

var jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { document } = (new JSDOM('')).window;
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
    origin: 'testsite',
    href: 'testsite'
};