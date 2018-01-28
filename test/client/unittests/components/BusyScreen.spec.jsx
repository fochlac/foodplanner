import React from 'react';
import { shallow, mount } from 'enzyme';
import BusyScreen from 'UI/BusyScreen/BusyScreen.jsx';

describe('BusyScreen', () => {
  test('should render an element', () => {
    const wrapper = shallow(<BusyScreen show={true} />);

    expect(wrapper.find('.loadingCircle')).toHaveLength(1);
    expect(wrapper.find('.loadingCircleContent')).toHaveLength(1);
  });

  test('should not render an element', () => {
    const wrapper = shallow(<BusyScreen show={false} />);

    expect(wrapper.find('div').length).toBe(0);
  });
});
