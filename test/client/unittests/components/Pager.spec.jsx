import React from 'react';
import { shallow, mount } from 'enzyme';
import Pager from 'UI/Pager/Pager.jsx';

const generateChildren = (count) => {
  return Array.from(Array(count).keys()).map(val => <div key={val} className={"child child-" + val}></div>)
}

describe('Pager', () => {
  test('should render an element and child elements', () => {
    const wrapper = shallow(<Pager top={true} bottom={true} size={3} wrapper={content => <div className="contentWrapper">{content}</div>}>{generateChildren(30)}</Pager>);

    expect(wrapper.find('.pagedList')).toHaveLength(1);
    expect(wrapper.find('.pagedContent')).toHaveLength(1);
    expect(wrapper.find('.pager')).toHaveLength(2);
    expect(wrapper.find('.sizeArea')).toHaveLength(2);
    expect(wrapper.find('.sizeArea').at(0).text()).toBe('Anzahl: 3');
    expect(wrapper.find('.sizeArea').at(1).text()).toBe('Anzahl: 3');
    expect(wrapper.find('.contentWrapper')).toHaveLength(1);
    expect(wrapper.find('.child')).toHaveLength(3);
    expect(wrapper.find('.child-0')).toHaveLength(1);
    expect(wrapper.find('.child-1')).toHaveLength(1);
    expect(wrapper.find('.child-2')).toHaveLength(1);
    expect(wrapper.find('.pagerList')).toHaveLength(2);
    expect(wrapper.find('.pagerList').at(0).find('span > span')).toHaveLength(7);
    expect(wrapper.find('.pagerList').at(1).find('span > span')).toHaveLength(7);
  });

  test('should change page on page click', () => {
    const wrapper = shallow(<Pager top={true} bottom={true} size={3} wrapper={content => <div className="contentWrapper">{content}</div>}>{generateChildren(30)}</Pager>);

    expect(wrapper.find('.pagerList').at(0).find('span > span')).toHaveLength(7);
    expect(wrapper.find('.pagerList').at(1).find('span > span')).toHaveLength(7);
    expect(wrapper.find('.pagerList').at(1).find('span > span').at(0).hasClass('activePage')).toBe(true);
    wrapper.find('.pagerList').at(1).find('span > span').at(5).simulate('click');
    expect(wrapper.find('.child-3')).toHaveLength(1);
    expect(wrapper.find('.child-4')).toHaveLength(1);
    expect(wrapper.find('.child-5')).toHaveLength(1);
    expect(wrapper.find('.pagerList').at(0).find('span > span')).toHaveLength(9);
    expect(wrapper.find('.pagerList').at(1).find('span > span')).toHaveLength(9);
    expect(wrapper.find('.pagerList').at(1).find('span > span').at(3).hasClass('activePage')).toBe(true);
    wrapper.find('.pagerList').at(1).find('span > span').at(4).simulate('click');
    expect(wrapper.find('.child-6')).toHaveLength(1);
    expect(wrapper.find('.child-7')).toHaveLength(1);
    expect(wrapper.find('.child-8')).toHaveLength(1);
    wrapper.find('.pagerList').at(1).find('span > span').at(0).simulate('click');
    expect(wrapper.find('.child-0')).toHaveLength(1);
    expect(wrapper.find('.child-1')).toHaveLength(1);
    expect(wrapper.find('.child-2')).toHaveLength(1);
    expect(wrapper.find('.pagerList').at(0).find('span > span')).toHaveLength(7);
    expect(wrapper.find('.pagerList').at(1).find('span > span')).toHaveLength(7);
    wrapper.find('.pagerList').at(1).find('span > span').at(4).simulate('click');
    expect(wrapper.find('.child-12')).toHaveLength(1);
    expect(wrapper.find('.child-13')).toHaveLength(1);
    expect(wrapper.find('.child-14')).toHaveLength(1);
    expect(wrapper.find('.pagerList').at(0).find('span > span')).toHaveLength(9);
    expect(wrapper.find('.pagerList').at(1).find('span > span')).toHaveLength(9);
    expect(wrapper.find('.pagerList').at(1).find('span > span').at(4).hasClass('activePage')).toBe(true);
    wrapper.find('.pagerList').at(1).find('span > span').at(1).simulate('click');
    expect(wrapper.find('.child-9')).toHaveLength(1);
    expect(wrapper.find('.child-10')).toHaveLength(1);
    expect(wrapper.find('.child-11')).toHaveLength(1);
    expect(wrapper.find('.pagerList').at(1).find('span > span').at(4).hasClass('activePage')).toBe(true);
    wrapper.find('.pagerList').at(1).find('span > span').at(8).simulate('click');
    expect(wrapper.find('.pagerList').at(0).find('span > span')).toHaveLength(7);
    expect(wrapper.find('.pagerList').at(1).find('span > span')).toHaveLength(7);
    expect(wrapper.find('.child-27')).toHaveLength(1);
    expect(wrapper.find('.child-28')).toHaveLength(1);
    expect(wrapper.find('.child-29')).toHaveLength(1);
    expect(wrapper.find('.pagerList').at(1).find('span > span').at(6).hasClass('activePage')).toBe(true);
  });


  test('should not render when inactive', () => {
    const wrapper = shallow(<Pager size={3} inactive={true} wrapper={content => <div className="contentWrapper">{content}</div>}>{generateChildren(30)}</Pager>);

    expect(wrapper.find('.pagedList')).toHaveLength(0);
    expect(wrapper.find('.pagedContent')).toHaveLength(0);
    expect(wrapper.find('.pager')).toHaveLength(0);
    expect(wrapper.find('.contentWrapper')).toHaveLength(1);
    expect(wrapper.find('.child')).toHaveLength(30);
    expect(wrapper.find('.child-0')).toHaveLength(1);
    expect(wrapper.find('.child-11')).toHaveLength(1);
    expect(wrapper.find('.child-22')).toHaveLength(1);
    expect(wrapper.find('.child-29')).toHaveLength(1);
  });


  test('should render top pager according to property', () => {
    const wrapper = shallow(<Pager size={3} top={true} wrapper={content => <div className="contentWrapper">{content}</div>}>{generateChildren(3)}</Pager>);

    expect(wrapper.find('.pagedList > div').at(0).hasClass('pager')).toBe(true);
  });


  test('should render bottom pager according to property', () => {
    const wrapper = shallow(<Pager size={3} bottom={true} wrapper={content => <div className="contentWrapper">{content}</div>}>{generateChildren(3)}</Pager>);

    expect(wrapper.find('.pagedList > div').at(1).hasClass('pager')).toBe(true);
  });
});
