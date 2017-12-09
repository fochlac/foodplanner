import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import EmailInput from 'UI/EmailInput/EmailInput.jsx';

describe('EmailInput', () => {
  it('should render an input', () => {
    const TEST_ID = 'testid123',
    	wrapper = shallow(<EmailInput id={TEST_ID} app={{hiddenBusy: false}}/>);

    expect(wrapper.find('input').length).to.equal(1);
    expect(wrapper.find('input').is('#' + TEST_ID)).to.be.true;
    expect(wrapper.find('span.fa-spinner.invisible').length).to.equal(1);
  });

  it('should display the spinner when app.hiddenBusy is true', () => {
    const wrapper = shallow(<EmailInput id="test" app={{hiddenBusy: true}} />);

    expect(wrapper.find('input').length).to.equal(1);
    expect(wrapper.find('span.fa-spinner').length).to.equal(1);
    expect(wrapper.find('span.fa-spinner').hasClass('invisible')).to.be.false;

  });

  it('should trigger check mail function at 5. character', () => {
    let check_mail_value = 0;
    const wrapper = shallow(<EmailInput id="test" app={{hiddenBusy: true}} check_mail={(value) => {check_mail_value = value.length}} />);

    wrapper.find('input').simulate('change', {target: {value: 'test'}});

    expect(check_mail_value).to.equal(0);
    wrapper.find('input').simulate('change', {target: {value: 'test123'}});

    expect(check_mail_value).to.equal(7);
  });
});