require("babel-polyfill");
const jsdom = require('./jsdom.js');

const Enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');
const chai = require('chai');
Enzyme.configure({ adapter: new Adapter() });

jsdom();