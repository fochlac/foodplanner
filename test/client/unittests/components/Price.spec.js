import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import Price from 'UI/PriceDialog/Price.jsx';

describe('PriceDialog', () => {
  it('should render all elements', () => {
    let output = {}
    const wrapper = shallow(<Price meal={m} price_options={opt => output = opt} />);

    expect(wrapper.find('.body').length).to.equal(1, 'body missing');
  });
});