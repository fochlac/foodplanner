import React from 'react';
import { shallow, mount } from 'enzyme';
import EmailInput from 'UI/EmailInput/EmailInput.jsx';

describe('EmailInput', () => {
  test('should render an input', () => {
    const TEST_ID = 'testid123',
    	wrapper = shallow(<EmailInput id={TEST_ID} app={{hiddenBusy: false}}/>);

    expect(wrapper.find('input').length).toBe(1);
    expect(wrapper.find('input').is('#' + TEST_ID)).toBe(true);
    expect(wrapper.find('span.fa-spinner.invisible').length).toBe(1);
  });

  test('should display the spinner when app.hiddenBusy is true', () => {
    const wrapper = shallow(<EmailInput id="test" app={{hiddenBusy: true}} />);

    expect(wrapper.find('input').length).toBe(1);
    expect(wrapper.find('span.fa-spinner').length).toBe(1);
    expect(wrapper.find('span.fa-spinner').hasClass('invisible')).toBe(false);

  });

  test('should trigger check mail function at 5. character', () => {
    let check_mail_value = 0;
    const wrapper = shallow(<EmailInput id="test" app={{hiddenBusy: true}} check_mail={(value) => {check_mail_value = value.length}} />);

    wrapper.find('input').simulate('change', {target: {value: 'test'}});

    expect(check_mail_value).toBe(0);
    wrapper.find('input').simulate('change', {target: {value: 'test123'}});

    expect(check_mail_value).toBe(7);
  });
});