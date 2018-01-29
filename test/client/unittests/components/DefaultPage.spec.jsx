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
	app: {
        dataversion: 'test'
    },
	show_impressum: () => output = 'show_impressum',
	initial_meals: () => null,
    refresh: (txt) => output = txt
}

describe('DefaultPage', () => {
  test('should render all elements', () => {
    let tmp = window.addEventListener,
        tmp2 = window.removeEventListener;

    window.addEventListener = (type, fn) => output = {type: 'addListener', func: fn};
    window.removeEventListener = () => output = 'removeListener';

    const wrapper = shallow(<DefaultPage {...options} ><div className="test"></div></DefaultPage>);
    expect(output.type).toBe('addListener');
    output.func();
    expect(output).toBe('test');

    expect(wrapper.find(Topbar)).toHaveLength(1);
    expect(wrapper.find(BusyScreen)).toHaveLength(1);
    expect(wrapper.find(Error)).toHaveLength(1);
    expect(wrapper.find(DialogController)).toHaveLength(1);
    expect(wrapper.find('.footer')).toHaveLength(1);
    expect(wrapper.find('.impressum')).toHaveLength(1);
    expect(wrapper.find('.test')).toHaveLength(1);
    wrapper.find('.impressum').simulate('click');
    expect(output).toBe('show_impressum');

    wrapper.unmount();
    expect(output).toBe('removeListener');
    window.addEventListener = tmp;
    window.removeEventListener = tmp2;
  });
});