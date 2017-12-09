import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import ConfirmationDialog from 'UI/ConfirmationDialog/ConfirmationDialog.jsx';

describe('ConfirmationDialog', () => {
  it('should render all elements', () => {
    const TEST_TITLE = 'testid123',
      TEST_TEXT = 'test test test test test',
      wrapper = shallow(<ConfirmationDialog action="test" test={() => action_called=true} title={TEST_TITLE} message={TEST_TEXT} noCancel={false} close_dialog={() => dialog_closed=true}/>);

    expect(wrapper.find('.titlebar').length).to.equal(1);
    expect(wrapper.find('.titlebar span.fa-times').length).to.equal(1);
    expect(wrapper.find('.body').length).to.equal(1);
    expect(wrapper.find('.foot').length).to.equal(1);
    expect(wrapper.find('.foot button').length).to.equal(2);

    expect(wrapper.find('.titlebar h3').text()).to.equal(TEST_TITLE);
    expect(wrapper.find('.body p').text()).to.equal(TEST_TEXT);
  });

  it('should not render cancel if noCancel=true', () => {
    const TEST_TITLE = 'testid123',
    	TEST_TEXT = 'test test test test test',
    	wrapper = shallow(<ConfirmationDialog action="test" test={() => action_called=true} title={TEST_TITLE} message={TEST_TEXT} noCancel={true} close_dialog={() => dialog_closed=true}/>);

    expect(wrapper.find('.foot button').length).to.equal(1);
  });

  it('should close on cancel button click', () => {
    let dialog_closed = false;

    const wrapper = shallow(<ConfirmationDialog action="test" test={() => action_called=true} message="" noCancel={false} close_dialog={() => dialog_closed=true}/>);

    wrapper.find('button.test-cancel').simulate('click');

    expect(dialog_closed).to.true;
  });

  it('should close on close button click', () => {
    let dialog_closed = false;

    const wrapper = shallow(<ConfirmationDialog action="test" test={() => action_called=true} message="" noCancel={false} close_dialog={() => dialog_closed=true}/>);

    wrapper.find('.titlebar span.fa-times').simulate('click');

    expect(dialog_closed).to.true;
  });

  it('should call action on submit button click', () => {
    let action_called = false;

    const PARAMS = "params",
          wrapper = shallow(<ConfirmationDialog action="test" parameter={[PARAMS]} test={(params) => action_called=params} message="" noCancel={false} />);

    wrapper.find('button.test-submit').simulate('click');

    expect(action_called).to.be.equal(PARAMS);
  });
});