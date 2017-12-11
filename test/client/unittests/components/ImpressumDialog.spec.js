import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import ImpressumDialog from 'UI/ImpressumDialog/ImpressumDialog.jsx';

describe('ImpressumDialog', () => {
  it('should render all elements', () => {
    const wrapper = shallow(<ImpressumDialog close_dialog={() => dialog_closed=true}/>);

    expect(wrapper.find('.titlebar').length).to.equal(1);
    expect(wrapper.find('.titlebar span.fa-times').length).to.equal(1);
    expect(wrapper.find('.body').length).to.equal(1);
    expect(wrapper.find('.foot').length).to.equal(1);
  });

  it('should close on close button click', () => {
    let dialog_closed = false;

    const wrapper = shallow(<ImpressumDialog action="test" test={() => action_called=true} message="" noCancel={false} close_dialog={() => dialog_closed=true}/>);

    wrapper.find('.titlebar span.fa-times').simulate('click');

    expect(dialog_closed).to.true;
  });
});