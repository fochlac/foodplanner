import React from 'react';
import { shallow, mount } from 'enzyme';
import InfoBubble from 'RAW/InfoBubble.jsx';

describe('InfoBubble', () => {
  test('should render an element and child elements', () => {
    const wrapper = shallow(<InfoBubble ><div className="test"></div></InfoBubble>);

    expect(wrapper.find('.InfoBubble')).toHaveLength(1);
    expect(wrapper.find('.InfoBubbleContent')).toHaveLength(1);
    expect(wrapper.find('.InfoBubbleContent .test')).toHaveLength(1);
    expect(wrapper.find('.InfoBubbleTriangle')).toHaveLength(1);
  });

  test('should add correct styling and class', () => {
    const wrapper = shallow(<InfoBubble arrow="right" symbol="test" style={{top: '10px', left: '10px'}} ></InfoBubble>);
    const bubbleContainer = wrapper.find('.InfoBubbleContent').get(0).props.style;

    expect(wrapper.find('.InfoBubbleTriangle.right')).toHaveLength(1);
    expect(wrapper.find('.InfoBubble.test')).toHaveLength(1);
    expect(bubbleContainer).toHaveProperty('top');
    expect(bubbleContainer).toHaveProperty('left');
  });
});
