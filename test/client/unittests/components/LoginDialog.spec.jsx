import { mount, shallow } from 'enzyme';

import Dialog from 'UI/Dialog.js';
import LoginDialog from 'UI/LoginDialog/LoginDialog.jsx';
import React from 'react';

let output;
const user = {
  id: 1,
  name: 'test',
  admin: true,
  balance: 10,

},
  user2 = {
    id: 1,
    name: 'test',
    admin: false,
    balance: undefined,

  },
  actions = {
    sign_in: (data) => output = { data, type: 'sign_in' },
    register: (data) => output = { data, type: 'register' }
  }

describe('LoginDialog', () => {
  test(
    'should render a unregistered frame and switch between register / signin',
    () => {
      const wrapper = shallow(<LoginDialog user={{}} {...actions} />);

      expect(wrapper.find(Dialog)).toHaveLength(1);
      expect(wrapper.find('.registerLink')).toHaveLength(1);
      expect(wrapper.find('.titlebar')).toHaveLength(1);
      expect(wrapper.find('.titlebar h3')).toHaveLength(1);
      expect(wrapper.find('.titlebar h3').text()).toBe('Anmelden');
      expect(wrapper.find('.foot button')).toHaveLength(1);
      expect(wrapper.find('.body #LoginDialog_mail')).toHaveLength(1);
      expect(wrapper.find('.body #LoginDialog_pass')).toHaveLength(1);

      wrapper.find('.registerLink').simulate('click');
      expect(wrapper.find('.titlebar h3').text()).toBe('Registrieren');
      expect(wrapper.find('.body #LoginDialog_mail')).toHaveLength(1);
      expect(wrapper.find('.body #LoginDialog_pass')).toHaveLength(1);
      expect(wrapper.find('.body #LoginDialog_pass2')).toHaveLength(0);
      expect(wrapper.find('.body #LoginDialog_name')).toHaveLength(1);
      expect(wrapper.find('.signinLink')).toHaveLength(1);
      expect(wrapper.find('.foot button')).toHaveLength(1);
      expect(wrapper.find('.foot button').prop('disabled')).toBe(true);

      wrapper.find('.signinLink').simulate('click');

      expect(wrapper.find('.registerLink')).toHaveLength(1);
      expect(wrapper.find('.foot button')).toHaveLength(1);
    }
  );

  test('error handling test', () => {
    const wrapper = shallow(<LoginDialog user={{}} {...actions} />);
    expect(wrapper.find('.foot button').prop('disabled')).toBe(true);
    wrapper.find('.registerLink').simulate('click');
    expect(wrapper.find('.titlebar h3').text()).toBe('Registrieren');
    expect(wrapper.find('.body #LoginDialog_mail')).toHaveLength(1);
    expect(wrapper.find('.body #LoginDialog_pass')).toHaveLength(1);
    expect(wrapper.find('.body #LoginDialog_pass2')).toHaveLength(0);
    expect(wrapper.find('.body #LoginDialog_name')).toHaveLength(1);
    expect(wrapper.find('.signinLink')).toHaveLength(1);
    expect(wrapper.find('.foot button')).toHaveLength(1);
    expect(wrapper.find('.foot button').prop('disabled')).toBe(true);
    wrapper.find('.body #LoginDialog_pass').simulate('change', { target: { value: 'test' } })
    expect(wrapper.find('.body #LoginDialog_pass2')).toHaveLength(1);
    wrapper.find('.body #LoginDialog_pass').simulate('change', { target: { value: '' } })
    expect(wrapper.find('.body #LoginDialog_pass2')).toHaveLength(0);
    expect(wrapper.find('.body #LoginDialog_mail.invalid')).toHaveLength(0);
    wrapper.find('.body #LoginDialog_mail').simulate('change', { target: { value: 'asd' } })
    expect(wrapper.find('.body #LoginDialog_mail.invalid')).toHaveLength(1);
    wrapper.find('.body #LoginDialog_mail').simulate('change', { target: { value: 'asd@asd.de' } })
    expect(wrapper.find('.body #LoginDialog_mail.invalid')).toHaveLength(0);
    expect(wrapper.find('.body #LoginDialog_name.invalid')).toHaveLength(0);
    wrapper.find('.body #LoginDialog_name').simulate('change', { target: { value: 'a' } })
    expect(wrapper.find('.body #LoginDialog_name.invalid')).toHaveLength(1);
    wrapper.find('.body #LoginDialog_name').simulate('change', { target: { value: 'asd' } })
    expect(wrapper.find('.foot button').prop('disabled')).toBe(false);
    expect(wrapper.find('.body #LoginDialog_name.invalid')).toHaveLength(0);
    expect(wrapper.find('.body #LoginDialog_pass.invalid')).toHaveLength(0);
    wrapper.find('.body #LoginDialog_pass').simulate('change', { target: { value: 'asd' } })
    expect(wrapper.find('.foot button').prop('disabled')).toBe(true);
    expect(wrapper.find('.body #LoginDialog_pass2.invalid')).toHaveLength(0);
    wrapper.find('.body #LoginDialog_pass2').simulate('change', { target: { value: 'asd2' } })
    expect(wrapper.find('.foot button').prop('disabled')).toBe(true);
    expect(wrapper.find('.body #LoginDialog_pass2.invalid')).toHaveLength(1);
    expect(wrapper.find('.body #LoginDialog_pass.invalid')).toHaveLength(1);
    wrapper.find('.body #LoginDialog_pass2').simulate('change', { target: { value: 'asd' } })
    expect(wrapper.find('.foot button').prop('disabled')).toBe(false);
    expect(wrapper.find('.body #LoginDialog_pass.invalid')).toHaveLength(0);
    expect(wrapper.find('.body #LoginDialog_pass2.invalid')).toHaveLength(0);

    wrapper.find('.signinLink').simulate('click');
    expect(wrapper.find('.body #LoginDialog_mail')).toHaveLength(1);
    expect(wrapper.find('.body #LoginDialog_mail').prop('value')).toEqual('asd@asd.de');
    expect(wrapper.find('.body #LoginDialog_pass')).toHaveLength(1);
    expect(wrapper.find('.body #LoginDialog_pass').prop('value')).toEqual('');
    expect(wrapper.find('.foot button').prop('disabled')).toBe(false);

    wrapper.find('.registerLink').simulate('click');
    expect(wrapper.find('.body #LoginDialog_mail')).toHaveLength(1);
    expect(wrapper.find('.body #LoginDialog_pass')).toHaveLength(1);
    expect(wrapper.find('.body #LoginDialog_pass2')).toHaveLength(0);
    expect(wrapper.find('.body #LoginDialog_name')).toHaveLength(1);
    expect(wrapper.find('.foot button').prop('disabled')).toBe(false);
    expect(wrapper.find('.body #LoginDialog_name').prop('value')).toEqual('asd');
    expect(wrapper.find('.body #LoginDialog_mail').prop('value')).toEqual('asd@asd.de');
    expect(wrapper.find('.body #LoginDialog_pass').prop('value')).toEqual('');
  });

  test('should output correct data on login / register', () => {
    const wrapper = shallow(<LoginDialog user={{}} {...actions} />);

    window.crypto = {
      subtle: {
        importKey: () => ({
          then: () => ({
            then: () => ({
              then: () => ({
                then: cb => {
                  cb("ALeLYLKK1Wtl/1TQlW/oEA");
                  return { catch: () => null }
                }
              })
            })
          })
        }),
      }
    }
    window.TextEncoder = function () { return { encode: () => null } };

    wrapper.find('.body #LoginDialog_mail').simulate('change', { target: { value: 'asd@asd.de' } })
    wrapper.find('.body #LoginDialog_pass').simulate('change', { target: { value: 'asd' } })

    wrapper.find('.foot button').simulate('click');

    expect(output.data).toEqual({ mail: 'asd@asd.de', hash: "ALeLYLKK1Wtl/1TQlW/oEA" });
    expect(output.type).toBe('sign_in');

    wrapper.find('.registerLink').simulate('click');
    wrapper.find('.body #LoginDialog_mail').simulate('change', { target: { value: 'asd@asd.de' } })
    wrapper.find('.body #LoginDialog_name').simulate('change', { target: { value: 'asd' } })
    wrapper.find('.body #LoginDialog_pass').simulate('change', { target: { value: 'asd' } })
    wrapper.find('.body #LoginDialog_pass2').simulate('change', { target: { value: 'asd' } })
    expect(wrapper.find('.foot button').prop('disabled')).toBe(false);
    wrapper.find('.foot button').simulate('click');

    expect(output.type).toBe('register');
    expect(output.data).toEqual({
      hash: "ALeLYLKK1Wtl/1TQlW/oEA",
      mail: "asd@asd.de",
      name: "asd"
    });
  });
});
