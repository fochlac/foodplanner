import React from 'react';
import { shallow, mount } from 'enzyme';
import Dialog from 'UI/Dialog/Dialog.jsx';

describe('Dialog', () => {
  test('should render all elements', () => {
    const wrapper = shallow(<Dialog close_dialog={() => dialog_closed=true}/>);

    expect(wrapper.find('.dialogBackground').length).toBe(1);
    expect(wrapper.find('.dialog').length).toBe(1);
  });

  test('should apply additional class to dialog element', () => {
    const ADDITIONAL_CLASS = 'testclass',
        wrapper = shallow(<Dialog className={ADDITIONAL_CLASS} close_dialog={() => dialog_closed=true}/>);

    expect(wrapper.find('.dialog').hasClass(ADDITIONAL_CLASS)).toBe(true);
  });

  test('should render children within dialog element', () => {
    const CHILD_ELEMENTS = <div className="test123"></div>,
        wrapper = shallow(<Dialog close_dialog={() => dialog_closed=true}>{CHILD_ELEMENTS}</Dialog>);

    expect(wrapper.find('.dialog').find('.test123').length).toBe(1);
  });

  test('should stay open on dialog click with option enabled', () => {
    let dialog_closed = false;

    const wrapper = shallow(<Dialog closeOnBackdrop={true} close_dialog={() => dialog_closed=true}></Dialog>);

    wrapper.find('.dialog').simulate('click', {target: {classList: {contains: (className => className === 'dialog')}}});
    expect(dialog_closed).toBe(false);
  });

  test('should close on backdrop click with option enabled', () => {
    let dialog_closed = false;

    const wrapper = shallow(<Dialog closeOnBackdrop={true} close_dialog={() => dialog_closed=true}></Dialog>);

    wrapper.find('.dialogBackground').simulate('click', {target: {classList: {contains: (className => className === 'dialogBackground')}}});
    expect(dialog_closed).toBe(true);
  });

  test('should close on ESC-press', () => {
    let dialog_closed = false,
        eventListener,
        tmp = window.addEventListener;


    window.addEventListener = (evt, fn) => eventListener = fn;

    const wrapper = shallow(<Dialog closeOnBackdrop={true} close_dialog={() => dialog_closed=true}></Dialog>);

    eventListener({keyCode: 27});
    expect(dialog_closed).toBe(true);

    dialog_closed = false;
    document.body.innerHTML = '<input type="text" id="test"/>';
    document.getElementById('test').focus();

    eventListener({keyCode: 27});
    expect(dialog_closed).toBe(false);

    window.addEventListener = tmp;

    tmp = window.removeEventListener;
    window.removeEventListener = (evt, fn) => eventListener = evt;
    wrapper.unmount();
    expect(eventListener).toBe('keyup');
    window.removeEventListener = tmp;
  });

  test('should stay open on backdrop click with option disabled', () => {
    let dialog_closed = false;

    const wrapper = shallow(<Dialog close_dialog={() => dialog_closed=true}></Dialog>);

    wrapper.find('.dialogBackground').simulate('click', {target: {classList: {contains: (className => className === 'dialogBackground')}}});
    expect(dialog_closed).toBe(false);
  });
});