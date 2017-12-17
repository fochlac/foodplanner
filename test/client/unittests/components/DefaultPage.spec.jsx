import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import { DefaultPage } from 'ROOT/DefaultPage.jsx';

import Topbar from 'UI/Topbar.js';
import BusyScreen from 'UI/BusyScreen/BusyScreen.jsx';
import Error from 'UI/Error.js';
import DialogController from 'ROOT/DialogController.jsx';
let output;

const options = {
	dialog: '',
	errors: [''],
	app: {},
	show_impressum: () => output = 'show_impressum',
	initial_meals: () => null
}

describe('DefaultPage', () => {
  it('should render all elements', () => {
    const wrapper = shallow(<DefaultPage {...options} ><div className="test"></div></DefaultPage>);

    expect(wrapper.find(Topbar)).to.have.lengthOf(1);
    expect(wrapper.find(BusyScreen)).to.have.lengthOf(1);
    expect(wrapper.find(Error)).to.have.lengthOf(1);
    expect(wrapper.find(DialogController)).to.have.lengthOf(1);
    expect(wrapper.find('.footer')).to.have.lengthOf(1);
    expect(wrapper.find('.impressum')).to.have.lengthOf(1);
    expect(wrapper.find('.test')).to.have.lengthOf(1);
    wrapper.find('.impressum').simulate('click');
    expect(output).to.equal('show_impressum');
  });
});