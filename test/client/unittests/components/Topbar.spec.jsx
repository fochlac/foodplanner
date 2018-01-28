import React from 'react';
import { shallow, mount } from 'enzyme';
import Topbar from 'UI/Topbar/Topbar.jsx';

let output;

const actions = {
		create_settings_dialog: () => output = 'create_settings_dialog',
    create_meal_dialog: () => output = 'create_meal_dialog',
		start_print: () => output = 'start_print',
		sign_out: () => output = 'sign_out'
	}



describe('Topbar', () => {
  test('should render all elements', () => {
    const wrapper = shallow(<Topbar user={{id: 1}} app={{hiddenBusy: true, dialog: ''}} {...actions} />);

    expect(wrapper.find('.topbar')).toHaveLength(1);
    expect(wrapper.find('h3')).toHaveLength(1);
    expect(wrapper.find('.quicklinks')).toHaveLength(1);
    expect(wrapper.find('.quicklinks > li')).toHaveLength(5);
    expect(wrapper.find('.quicklinks .fa-refresh')).toHaveLength(1);
    expect(wrapper.find('.quicklinks .fa-print')).toHaveLength(1);
    expect(wrapper.find('.quicklinks .fa-cog')).toHaveLength(1);
    expect(wrapper.find('.quicklinks .fa-plus')).toHaveLength(1);
    expect(wrapper.find('.quicklinks .fa-sign-out')).toHaveLength(1);
  });

  test('should not render busy if not busy', () => {
    const wrapper = shallow(<Topbar user={{id: 1}} app={{hiddenBusy: false, dialog: ''}} {...actions} />);

    expect(wrapper.find('.quicklinks > li')).toHaveLength(4);
    expect(wrapper.find('.quicklinks .fa-refresh')).toHaveLength(0);
  });

  test(
    'should not render busy or  create meal or signout if not busy and not signed in',
    () => {
      const wrapper = shallow(<Topbar user={{}} app={{hiddenBusy: false, dialog: ''}} {...actions} />);

      expect(wrapper.find('.topbar')).toHaveLength(1);
      expect(wrapper.find('h3')).toHaveLength(1);
      expect(wrapper.find('.quicklinks')).toHaveLength(1);
      expect(wrapper.find('.quicklinks > li')).toHaveLength(2);
      expect(wrapper.find('.quicklinks .fa-refresh')).toHaveLength(0);
      expect(wrapper.find('.quicklinks .fa-print')).toHaveLength(1);
      expect(wrapper.find('.quicklinks .fa-cog')).toHaveLength(1);
      expect(wrapper.find('.quicklinks .fa-plus')).toHaveLength(0);
      expect(wrapper.find('.quicklinks .fa-sign-out')).toHaveLength(0);
    }
  );


  test('should call correct actions', () => {
    const wrapper = shallow(<Topbar user={{id: 1}} app={{hiddenBusy: false, dialog: ''}} {...actions} />);
    const quicklinks = wrapper.find('.quicklinks');

    quicklinks.childAt(0).simulate('click');
    expect(output).toBe('start_print');
    quicklinks.childAt(1).simulate('click');
    expect(output).toBe('create_settings_dialog');
    quicklinks.childAt(2).simulate('click');
    expect(output).toBe('create_meal_dialog');
    quicklinks.childAt(3).simulate('click');
    expect(output).toBe('sign_out');
  });
});