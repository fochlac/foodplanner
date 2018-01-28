import React from 'react';
import { shallow, mount } from 'enzyme';
import ImpressumDialog from 'UI/ImpressumDialog/ImpressumDialog.jsx';

describe('ImpressumDialog', () => {
  test('should render all elements', () => {
    const wrapper = shallow(<ImpressumDialog close_dialog={() => dialog_closed=true}/>);

    expect(wrapper.find('.titlebar').length).toBe(1);
    expect(wrapper.find('.titlebar span.fa-times').length).toBe(1);
    expect(wrapper.find('.body').length).toBe(1);
    expect(wrapper.find('.foot').length).toBe(1);
  });

  test('should close on close button click', () => {
    let dialog_closed = false;

    const wrapper = shallow(<ImpressumDialog action="test" test={() => action_called=true} message="" noCancel={false} close_dialog={() => dialog_closed=true}/>);

    wrapper.find('.titlebar span.fa-times').simulate('click');

    expect(dialog_closed).toBe(true);
  });
});