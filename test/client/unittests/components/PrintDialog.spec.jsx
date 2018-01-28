import React from 'react';
import { shallow, mount } from 'enzyme';
import PrintDialog from 'UI/PrintDialog/PrintDialog.jsx';

const meals = [
  {
    id: 0,
    name: 'asda',
    time: Date.now() - 3600000 * 28,
  },
  {
    id: 1,
    name: 'asda',
    time: Date.now() + 3600000 * 28,
  },
  {
    id: 2,
    name: 'asda',
    time: Date.now() + 3600000 * 29,
  },
];

describe('PrintDialog', () => {
  test('should render all elements', () => {
    const wrapper = shallow(<PrintDialog meals={meals} close_dialog={() => dialog_closed=true}/>);

    expect(wrapper.find('.titlebar').length).toBe(1);
    expect(wrapper.find('.titlebar span.fa-times').length).toBe(1);
    expect(wrapper.find('.body').length).toBe(1);
    expect(wrapper.find('.body tbody').length).toBe(1);
    expect(wrapper.find('.body tbody > tr').length).toBe(2);
    expect(wrapper.find('.foot button').length).toBe(2);
    expect(wrapper.find('.foot').length).toBe(1);
  });

  test('should close on close button click', () => {
    let dialog_closed = false;

    const wrapper = shallow(<PrintDialog  meals={meals} close_dialog={() => dialog_closed=true}/>);
    wrapper.find('.titlebar span.fa-times').simulate('click');

    expect(dialog_closed).toBe(true);
  });

  test('should close on cancel button click', () => {
    let dialog_closed = false;

    const wrapper = shallow(<PrintDialog  meals={meals} close_dialog={() => dialog_closed=true}/>);
    wrapper.find('.foot button.cancel').simulate('click');

    expect(dialog_closed).toBe(true);
  });

  test('should set print on submit button click', (done) => {
    let dialog_closed = false;
    let meal_set_print = '';
    window.print = () => {
      expect(dialog_closed).toBe(true);
      done();
    }
    const wrapper = shallow(<PrintDialog  meals={meals} close_dialog={() => dialog_closed=true} meal_set_print={(data) => {
      expect(data).toContain(2);
    }}/>);

    wrapper.find('.body tbody input').at(1).simulate('change');
    wrapper.find('.foot button').at(1).simulate('click');
    wrapper.unmount();
  });
});