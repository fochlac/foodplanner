import React from 'react';
import { shallow, mount } from 'enzyme';
import SettingsDialog from 'UI/SettingsDialog/SettingsDialog.jsx';

describe('SettingsDialog', () => {
  test('should render all elements containing default values', () => {
    const user = {
        id: 1,
        mail: 'test@test.de',
        name: 'testname',
        creationNotice: 1,
        creationNotice_notification: 1,
        deadlineReminder: 1,
        deadlineReminder_notification: 1
      },
      wrapper = shallow(<SettingsDialog user={user} close_dialog={() => dialog_closed=true}/>);

    expect(wrapper.find('.mailFrame input').length).toBe(1);
    expect(wrapper.find('.mailFrame input').prop('value')).toBe(user.mail);
    expect(wrapper.find('#SettingsDialog_name').length).toBe(1);
    expect(wrapper.find('#SettingsDialog_name').prop('value')).toBe(user.name);
    expect(wrapper.find('.notificationMatrix').length).toBe(1);
    expect(wrapper.find('.notificationMatrix .notification').length).toBe(4);
    wrapper.find('.notificationMatrix .notification input').forEach(elem => {
      expect(elem.prop('disabled')).toBe(undefined);
      expect(elem.prop('checked')).toBe(1);
    });
  });

  test(
    'should hide mailframe and disable mail notifications without user',
    () => {
      const user = {},
        wrapper = shallow(<SettingsDialog user={user} close_dialog={() => dialog_closed=true}/>);

      expect(wrapper.find('.mailFrame input').length).toBe(0);
      expect(wrapper.find('#SettingsDialog_name').prop('value')).toBe('');
      expect(wrapper.find('.notificationMatrix .notification').length).toBe(4);
      expect(wrapper.find('.notificationMatrix .notification.createdMail input').prop('disabled')).toBe(true);
      expect(wrapper.find('.notificationMatrix .notification.deadlineMail input').prop('disabled')).toBe(true);
    }
  );

  test(
    'should disable notification checkboxes without notification permission',
    () => {
      global.Notification = {};
      global.Notification.permission = 'denied';
      const user = {},
        wrapper = shallow(<SettingsDialog user={user} close_dialog={() => dialog_closed=true}/>);

      expect(wrapper.find('.notificationMatrix .notification.createdNotification input').prop('disabled')).toBe(true);
      expect(wrapper.find('.notificationMatrix .notification.deadlineNotification input').prop('disabled')).toBe(true);
      global.Notification.permission = 'granted';
    }
  );

  test('should send changed values on submit', (done) => {
    let save_settings = false;
    const user = {
        id: 1,
        mail: 'test@test.de',
        name: 'testname',
        creationNotice_mail: 1,
        creationNotice_notification: 1,
        deadlineReminder_mail: 1,
        deadlineReminder_notification: 1
      },
      user2 = {
        id: 1,
        mail: 'test@test.com',
        name: 'test2name',
        creationNotice: 0,
        creationNotice_notification: 0,
        deadlineReminder: 0,
        deadlineReminder_notification: 0
      },
      wrapper = shallow(<SettingsDialog user={user2} save_settings={(state) => save_settings=state}/>);

    wrapper.find('.mailFrame input').simulate('change', {target: {value: user.mail}});
    wrapper.find('#SettingsDialog_name').simulate('change', {target: {value: user.name}});
    wrapper.find('.notificationMatrix .notification input').forEach(elem => {
      elem.simulate('change', {target: {checked: true}});
    });
    wrapper.find('button.submit').simulate('click');
    setTimeout(() => {
      expect(save_settings).toEqual(user);
      done();
    }, 100);
  });


  test('should close on cancel button click', () => {
    let dialog_closed = false;

    const TEST_USER = {id: 1},
      wrapper = shallow(<SettingsDialog user={TEST_USER} save_settings={(output) => save_settings=output} close_dialog={() => dialog_closed=true}/>);

    wrapper.find('button.cancel').simulate('click');

    expect(dialog_closed).toBe(true);
  });

  test('should close on close button click', () => {
    let dialog_closed = false;

    const TEST_USER = {id: 1},
      wrapper = shallow(<SettingsDialog user={TEST_USER} save_settings={(output) => save_settings=output} close_dialog={() => dialog_closed=true}/>);

    wrapper.find('.titlebar span.fa-times').simulate('click');

    expect(dialog_closed).toBe(true);
  });

});