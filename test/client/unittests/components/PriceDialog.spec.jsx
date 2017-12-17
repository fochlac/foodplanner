import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import PriceDialog from 'UI/PriceDialog/PriceDialog.jsx';
import Price from 'UI/PriceDialog/Price.jsx';
import Payment from 'UI/PriceDialog/Payment.jsx';

describe('PriceDialog', () => {
  it('should render all elements', () => {
    const wrapper = shallow(<PriceDialog meal={{locked: false}} />);

    expect(wrapper.find('.titlebar').length).to.equal(1, 'titlebar missing');
    expect(wrapper.find('.titlebar span.fa-times').length).to.equal(1, 'close button missing');
    expect(wrapper.find('.body').length).to.equal(1, 'body missing');
    expect(wrapper.find(Price).length).to.equal(1, 'Price missing');
    expect(wrapper.find('.foot button').length).to.equal(3, 'button missing');
    expect(wrapper.find('.foot').length).to.equal(1, 'foot missing');
  });

  it('should render all elements with locked meal', () => {
    const wrapper = shallow(<PriceDialog meal={{locked: true}} toggle_paid={() => null} />);

    expect(wrapper.find('.titlebar').length).to.equal(1, 'titlebar missing');
    expect(wrapper.find('.titlebar span.fa-times').length).to.equal(1, 'close button missing');
    expect(wrapper.find('.body').length).to.equal(1, 'body missing');
    expect(wrapper.find(Payment).length).to.equal(1, 'Pament missing');
    expect(wrapper.find('.foot button').length).to.equal(1, 'button missing');
    expect(wrapper.find('.foot').length).to.equal(1, 'foot missing');
  });

  it('should close on close button click', () => {
    let dialog_closed = false;

    const wrapper = shallow(<PriceDialog meal={{locked: false}} close_dialog={() => dialog_closed=true}/>);
    wrapper.find('.titlebar span.fa-times').simulate('click');

    expect(dialog_closed).to.true;
  });

  it('should close on cancel button click', () => {
    let dialog_closed = false;

    const wrapper = shallow(<PriceDialog meal={{locked: false}} close_dialog={() => dialog_closed=true}/>);
    wrapper.find('.foot button.cancel').simulate('click');

    expect(dialog_closed).to.true;
  });

  it('should save on submit button click', (done) => {
    let submit_value = '';

    const wrapper = shallow(<PriceDialog meal={{locked: false, id: 'test'}} submit_prices={(data, id) => {
      expect(id).to.equal('test');
      expect(data[0]).to.equal('test123');
      expect(data[1]).to.equal('test345');
      done();
    }}/>);
    wrapper.setState({options: {test: 'test123', test2: 'test345'}}, () => {
      wrapper.find('.foot button.submit').simulate('click');
    });
  });

  it('should start payment on finalize button click', (done) => {
    let submit_value = '';

    const wrapper = shallow(<PriceDialog meal={{locked: false, id: 'test'}} start_payment={(data, id) => {
      expect(id).to.equal('test');
      expect(data[0]).to.equal('test123');
      expect(data[1]).to.equal('test345');
      done();
    }}/>);
    wrapper.setState({options: {test: 'test123', test2: 'test345'}}, () => {
      wrapper.find('.foot button.finalize').simulate('click');
    });
  });
});