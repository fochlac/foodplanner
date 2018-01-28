import React from 'react';
import { shallow, mount } from 'enzyme';
import ConfirmationDialog from 'UI/ConfirmationDialog/ConfirmationDialog.jsx';

describe('ConfirmationDialog', () => {
  test('should render all elements', () => {
    const TEST_TITLE = 'testid123',
      TEST_TEXT = 'test test test test test',
      wrapper = shallow(<ConfirmationDialog action="test" test={() => action_called=true} title={TEST_TITLE} message={TEST_TEXT} noCancel={false} close_dialog={() => dialog_closed=true}/>);

    expect(wrapper.find('.titlebar').length).toBe(1);
    expect(wrapper.find('.titlebar span.fa-times').length).toBe(1);
    expect(wrapper.find('.body').length).toBe(1);
    expect(wrapper.find('.foot').length).toBe(1);
    expect(wrapper.find('.foot button').length).toBe(2);

    expect(wrapper.find('.titlebar h3').text()).toBe(TEST_TITLE);
    expect(wrapper.find('.body p').text()).toBe(TEST_TEXT);
  });

  test('should not render cancel if noCancel=true', () => {
    const TEST_TITLE = 'testid123',
    	TEST_TEXT = 'test test test test test',
    	wrapper = shallow(<ConfirmationDialog action="test" test={() => action_called=true} title={TEST_TITLE} message={TEST_TEXT} noCancel={true} close_dialog={() => dialog_closed=true}/>);

    expect(wrapper.find('.foot button').length).toBe(1);
  });

  test('should close on cancel button click', () => {
    let dialog_closed = false;

    const wrapper = shallow(<ConfirmationDialog action="test" test={() => action_called=true} message="" noCancel={false} close_dialog={() => dialog_closed=true}/>);

    wrapper.find('button.cancel').simulate('click');

    expect(dialog_closed).toBe(true);
  });

  test('should close on close button click', () => {
    let dialog_closed = false;

    const wrapper = shallow(<ConfirmationDialog action="test" test={() => action_called=true} message="" noCancel={false} close_dialog={() => dialog_closed=true}/>);

    wrapper.find('.titlebar span.fa-times').simulate('click');

    expect(dialog_closed).toBe(true);
  });

  test('should call action on submit button click', () => {
    let action_called = false;

    const PARAMS = "params",
          wrapper = shallow(<ConfirmationDialog action="test" parameter={[PARAMS]} test={(params) => action_called=params} message="" noCancel={false} />);

    wrapper.find('button.submit').simulate('click');

    expect(action_called).toBe(PARAMS);
  });
});