import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import Dialog from 'UI/Dialog/Dialog.jsx';

describe('Dialog', () => {
  it('should render all elements', () => {
    const wrapper = shallow(<Dialog close_dialog={() => dialog_closed=true}/>);

    expect(wrapper.find('.dialogBackground').length).to.equal(1);
    expect(wrapper.find('.dialog').length).to.equal(1);
  });

  it('should apply additional class to dialog element', () => {
    const ADDITIONAL_CLASS = 'testclass',
        wrapper = shallow(<Dialog className={ADDITIONAL_CLASS} close_dialog={() => dialog_closed=true}/>);

    expect(wrapper.find('.dialog').hasClass(ADDITIONAL_CLASS)).to.be.true;
  });

  it('should render children within dialog element', () => {
    const CHILD_ELEMENTS = <div className="test123"></div>,
        wrapper = shallow(<Dialog close_dialog={() => dialog_closed=true}>{CHILD_ELEMENTS}</Dialog>);

    expect(wrapper.find('.dialog').find('.test123').length).to.equal(1);
  });

  it('should stay open on dialog click with option enabled', () => {
    let dialog_closed = false;

    const wrapper = shallow(<Dialog closeOnBackdrop={true} close_dialog={() => dialog_closed=true}></Dialog>);

    wrapper.find('.dialog').simulate('click', {target: {classList: {contains: (className => className === 'dialog')}}});
    expect(dialog_closed).to.false;
  });

  it('should close on backdrop click with option enabled', () => {
    let dialog_closed = false;

    const wrapper = shallow(<Dialog closeOnBackdrop={true} close_dialog={() => dialog_closed=true}></Dialog>);

    wrapper.find('.dialogBackground').simulate('click', {target: {classList: {contains: (className => className === 'dialogBackground')}}});
    expect(dialog_closed).to.true;
  });

  it('should stay open on backdrop click with option disabled', () => {
    let dialog_closed = false;

    const wrapper = shallow(<Dialog close_dialog={() => dialog_closed=true}></Dialog>);

    wrapper.find('.dialogBackground').simulate('click', {target: {classList: {contains: (className => className === 'dialogBackground')}}});
    expect(dialog_closed).to.false;
  });
});