import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import InfoBubble from 'UI/InfoBubble/InfoBubble.jsx';

describe('InfoBubble', () => {
  it('should render an element and child elements', () => {
    const wrapper = shallow(<InfoBubble ><div className="test"></div></InfoBubble>);

    expect(wrapper.find('.InfoBubble')).to.have.lengthOf(1);
    expect(wrapper.find('.InfoBubbleContent')).to.have.lengthOf(1);
    expect(wrapper.find('.InfoBubbleContent .test')).to.have.lengthOf(1);
    expect(wrapper.find('.InfoBubbleTriangle')).to.have.lengthOf(1);
  });

  it('should add correct styling and class', () => {
    const wrapper = shallow(<InfoBubble arrow="right" symbol="test" style={{top: '10px', left: '10px'}} ></InfoBubble>);
    const bubbleContainer = wrapper.find('.InfoBubbleContent').get(0).props.style;

    expect(wrapper.find('.InfoBubbleTriangle.right')).to.have.lengthOf(1);
    expect(wrapper.find('.InfoBubble.test')).to.have.lengthOf(1);
    expect(bubbleContainer).to.have.property('top', '10px');
    expect(bubbleContainer).to.have.property('left', '10px');
  });
});
