import React from 'react';
import { shallow, mount } from 'enzyme';
import EmailInput from 'CONNECTED/EmailInput/EmailInput.jsx';

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

  test('should render mail in input', (done) => {
    let check_mail_value = 0,
        output;

    document.body.innerHTML = '<div><input type="text" id="test" /></div>';
    document.getElementById('test').focus = () => output = 'focus_called'
    const wrapper = shallow(<EmailInput app={{hiddenBusy: false}} selector="#test" check_mail={(value) => {check_mail_value = value.length}} />);

    wrapper.find('input').simulate('change', {target: {value: 'test'}});

    expect(check_mail_value).toBe(0);
    wrapper.find('input').simulate('change', {target: {value: 'test12'}});
    expect(check_mail_value).toBe(6);

    wrapper.find('input').simulate('change', {target: {value: 'test123'}});
    expect(check_mail_value).toBe(6);

    setTimeout(() => {
      expect(check_mail_value).toBe(7);

      setTimeout(() => {
        wrapper.setProps({app: {hiddenBusy: false, mailSuggestion: {mail: 'test@test.de'}}});
        setTimeout(() => {
          wrapper.update();
          expect(wrapper.find('input').prop('value')).toBe('test@test.de');
          expect(output).toBe('focus_called');
          done();
        }, 200);
      }, 400);
    }, 400);


  });
});