import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import BusyScreen from '~/ui/BusyScreen/BusyScreen.jsx';

describe('BusyScreen', () => {
  it('should render an element', () => {
    const wrapper = shallow(<BusyScreen show={true} />);

    expect(wrapper.find('#sphere').length).to.equal(1);
    expect(wrapper.find('.disc').length).to.equal(3);
  });

  it('should not render an element', () => {
    const wrapper = shallow(<BusyScreen show={false} />);

    expect(wrapper.find('div').length).to.equal(0);
  });
});