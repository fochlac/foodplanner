import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import BusyScreen from 'UI/BusyScreen/BusyScreen.jsx';

describe('BusyScreen', () => {
  it('should render an element', () => {
    const wrapper = shallow(<BusyScreen show={true} />);

    expect(wrapper.find('.loadingCircle')).to.have.lengthOf(1);
    expect(wrapper.find('.loadingCircleContent')).to.have.lengthOf(1);
  });

  it('should not render an element', () => {
    const wrapper = shallow(<BusyScreen show={false} />);

    expect(wrapper.find('div').length).to.equal(0);
  });
});
