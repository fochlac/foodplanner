import React from 'react';
import { expect } from 'chai';
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
  it('should render all elements', () => {
    const wrapper = shallow(<PrintDialog meals={meals} close_dialog={() => dialog_closed=true}/>);

    expect(wrapper.find('.titlebar').length).to.equal(1, 'titlebar missing');
    expect(wrapper.find('.titlebar span.fa-times').length).to.equal(1, 'close button missing');
    expect(wrapper.find('.body').length).to.equal(1, 'body missing');
    expect(wrapper.find('.body tbody').length).to.equal(1, 'tablebody missing');
    expect(wrapper.find('.body tbody > tr').length).to.equal(2, 'meals missing');
    expect(wrapper.find('.foot button').length).to.equal(2, 'button missing');
    expect(wrapper.find('.foot').length).to.equal(1, 'foot missing');
  });

  it('should close on close button click', () => {
    let dialog_closed = false;

    const wrapper = shallow(<PrintDialog  meals={meals} close_dialog={() => dialog_closed=true}/>);
    wrapper.find('.titlebar span.fa-times').simulate('click');

    expect(dialog_closed).to.true;
  });

  it('should close on cancel button click', () => {
    let dialog_closed = false;

    const wrapper = shallow(<PrintDialog  meals={meals} close_dialog={() => dialog_closed=true}/>);
    wrapper.find('.foot button.cancel').simulate('click');

    expect(dialog_closed).to.true;
  });

  it('should set print on submit button click', (done) => {
    let dialog_closed = false;
    let meal_set_print = '';
    window.print = () => {
      expect(dialog_closed).to.be.true;
      done();
    }
    const wrapper = shallow(<PrintDialog  meals={meals} close_dialog={() => dialog_closed=true} meal_set_print={(data) => {
      expect(data).to.include(2);
    }}/>);

    wrapper.find('.body tbody input').at(1).simulate('change');
    wrapper.find('.foot button').at(1).simulate('click');
    wrapper.unmount();
  });
});