import React from 'react';
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
  test('should render all elements', () => {
    const wrapper = shallow(<DefaultPage {...options} ><div className="test"></div></DefaultPage>);

    expect(wrapper.find(Topbar)).toHaveLength(1);
    expect(wrapper.find(BusyScreen)).toHaveLength(1);
    expect(wrapper.find(Error)).toHaveLength(1);
    expect(wrapper.find(DialogController)).toHaveLength(1);
    expect(wrapper.find('.footer')).toHaveLength(1);
    expect(wrapper.find('.impressum')).toHaveLength(1);
    expect(wrapper.find('.test')).toHaveLength(1);
    wrapper.find('.impressum').simulate('click');
    expect(output).toBe('show_impressum');
  });
});