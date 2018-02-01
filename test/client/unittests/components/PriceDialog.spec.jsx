import React from 'react';
import { shallow, mount } from 'enzyme';
import PriceDialog from 'UI/PriceDialog/PriceDialog.jsx';
import Price from 'UI/PriceDialog/Price.jsx';
import Payment from 'UI/PriceDialog/Payment.jsx';

describe('PriceDialog', () => {
  test('should render all elements', () => {
    const wrapper = shallow(<PriceDialog meal={{locked: false}} />);

    expect(wrapper.find('.titlebar').length).toBe(1);
    expect(wrapper.find('.titlebar span.fa-times').length).toBe(1);
    expect(wrapper.find('.body').length).toBe(1);
    expect(wrapper.find(Price).length).toBe(1);
    expect(wrapper.find('.foot button').length).toBe(3);
    expect(wrapper.find('.foot').length).toBe(1);
  });

  test('should render all elements with locked meal', () => {
    const wrapper = shallow(<PriceDialog meal={{locked: true}} toggle_paid={() => null} />);

    expect(wrapper.find('.titlebar').length).toBe(1);
    expect(wrapper.find('.titlebar span.fa-times').length).toBe(1);
    expect(wrapper.find('.body').length).toBe(1);
    expect(wrapper.find(Payment).length).toBe(1);
    expect(wrapper.find('.foot button').length).toBe(1);
    expect(wrapper.find('.foot').length).toBe(1);
  });

  test('should properly output invalid info', () => {
    const wrapper = shallow(<PriceDialog invalid={true} />);

    expect(wrapper.find('.titlebar').length).toBe(1);
    expect(wrapper.find('.titlebar span.fa-times').length).toBe(1);
    expect(wrapper.find('.body').length).toBe(1);
    expect(wrapper.find('.body p')).toHaveLength(1);
    expect(wrapper.find('.foot button').length).toBe(1);
    expect(wrapper.find('.foot').length).toBe(1);
  });

  test('should close on close button click', () => {
    let dialog_closed = false;

    const wrapper = shallow(<PriceDialog meal={{locked: false}} close_dialog={() => dialog_closed=true}/>);
    wrapper.find('.titlebar span.fa-times').simulate('click');

    expect(dialog_closed).toBe(true);
  });

  test('should close on cancel button click', () => {
    let dialog_closed = false;

    const wrapper = shallow(<PriceDialog meal={{locked: false}} close_dialog={() => dialog_closed=true}/>);
    wrapper.find('.foot button.cancel').simulate('click');

    expect(dialog_closed).toBe(true);
  });

  test('should save on submit button click', (done) => {
    let submit_value = '';

    const wrapper = shallow(<PriceDialog meal={{locked: false, id: 'test'}} submit_prices={(data, id) => {
      expect(id).toBe('test');
      expect(data[0]).toBe('test123');
      expect(data[1]).toBe('test345');
      done();
    }}/>);
    wrapper.setState({options: {test: 'test123', test2: 'test345'}}, () => {
      wrapper.find('.foot button.submit').simulate('click');
    });
  });

  test('should start payment on finalize button click', (done) => {
    let submit_value = '';

    const wrapper = shallow(<PriceDialog meal={{locked: false, id: 'test'}} start_payment={(data, id) => {
      expect(id).toBe('test');
      expect(data[0]).toBe('test123');
      expect(data[1]).toBe('test345');
      done();
    }}/>);
    wrapper.setState({options: {test: 'test123', test2: 'test345'}}, () => {
      wrapper.find('.foot button.finalize').simulate('click');
    });
  });
});