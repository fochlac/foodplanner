import React from 'react';
import { expect } from 'chai';
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
  it('should render all elements', () => {
    const wrapper = shallow(<Topbar user={{id: 1}} app={{hiddenBusy: true, dialog: ''}} {...actions} />);

    expect(wrapper.find('.topbar')).to.have.lengthOf(1);
    expect(wrapper.find('h3')).to.have.lengthOf(1);
    expect(wrapper.find('.quicklinks')).to.have.lengthOf(1);
    expect(wrapper.find('.quicklinks > li')).to.have.lengthOf(5);
    expect(wrapper.find('.quicklinks .fa-refresh')).to.have.lengthOf(1);
    expect(wrapper.find('.quicklinks .fa-print')).to.have.lengthOf(1);
    expect(wrapper.find('.quicklinks .fa-cog')).to.have.lengthOf(1);
    expect(wrapper.find('.quicklinks .fa-plus')).to.have.lengthOf(1);
    expect(wrapper.find('.quicklinks .fa-sign-out')).to.have.lengthOf(1);
  });

  it('should not render busy if not busy', () => {
    const wrapper = shallow(<Topbar user={{id: 1}} app={{hiddenBusy: false, dialog: ''}} {...actions} />);

    expect(wrapper.find('.quicklinks > li')).to.have.lengthOf(4);
    expect(wrapper.find('.quicklinks .fa-refresh')).to.have.lengthOf(0);
  });

  it('should not render busy or  create meal or signout if not busy and not signed in', () => {
    const wrapper = shallow(<Topbar user={{}} app={{hiddenBusy: false, dialog: ''}} {...actions} />);

    expect(wrapper.find('.topbar')).to.have.lengthOf(1);
    expect(wrapper.find('h3')).to.have.lengthOf(1);
    expect(wrapper.find('.quicklinks')).to.have.lengthOf(1);
    expect(wrapper.find('.quicklinks > li')).to.have.lengthOf(2);
    expect(wrapper.find('.quicklinks .fa-refresh')).to.have.lengthOf(0);
    expect(wrapper.find('.quicklinks .fa-print')).to.have.lengthOf(1);
    expect(wrapper.find('.quicklinks .fa-cog')).to.have.lengthOf(1);
    expect(wrapper.find('.quicklinks .fa-plus')).to.have.lengthOf(0);
    expect(wrapper.find('.quicklinks .fa-sign-out')).to.have.lengthOf(0);
  });


  it('should call correct actions', () => {
    const wrapper = shallow(<Topbar user={{id: 1}} app={{hiddenBusy: false, dialog: ''}} {...actions} />);
    const quicklinks = wrapper.find('.quicklinks');

    quicklinks.childAt(0).simulate('click');
    expect(output).to.equal('start_print');
    quicklinks.childAt(1).simulate('click');
    expect(output).to.equal('create_settings_dialog');
    quicklinks.childAt(2).simulate('click');
    expect(output).to.equal('create_meal_dialog');
    quicklinks.childAt(3).simulate('click');
    expect(output).to.equal('sign_out');
  });
});