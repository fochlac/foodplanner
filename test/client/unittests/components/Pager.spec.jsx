import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import Pager from 'UI/Pager/Pager.jsx';

const generateChildren = (count) => {
  return Array.from(Array(count).keys()).map(val => <div key={val} className={"child child-" + val}></div>)
}

describe('Pager', () => {
  it('should render an element and child elements', () => {
    const wrapper = shallow(<Pager top={true} bottom={true} size={3} wrapper={content => <div className="contentWrapper">{content}</div>}>{generateChildren(30)}</Pager>);

    expect(wrapper.find('.pagedList')).to.have.lengthOf(1);
    expect(wrapper.find('.pagedContent')).to.have.lengthOf(1);
    expect(wrapper.find('.pager')).to.have.lengthOf(2);
    expect(wrapper.find('.sizeArea')).to.have.lengthOf(2);
    expect(wrapper.find('.sizeArea').at(0).text()).to.equal('Anzahl: 3');
    expect(wrapper.find('.sizeArea').at(1).text()).to.equal('Anzahl: 3');
    expect(wrapper.find('.contentWrapper')).to.have.lengthOf(1);
    expect(wrapper.find('.child')).to.have.lengthOf(3);
    expect(wrapper.find('.child-0')).to.have.lengthOf(1);
    expect(wrapper.find('.child-1')).to.have.lengthOf(1);
    expect(wrapper.find('.child-2')).to.have.lengthOf(1);
    expect(wrapper.find('.pagerList')).to.have.lengthOf(2);
    expect(wrapper.find('.pagerList').at(0).find('span > span')).to.have.lengthOf(7);
    expect(wrapper.find('.pagerList').at(1).find('span > span')).to.have.lengthOf(7);
  });

  it('should change page on page click', () => {
    const wrapper = shallow(<Pager top={true} bottom={true} size={3} wrapper={content => <div className="contentWrapper">{content}</div>}>{generateChildren(30)}</Pager>);

    expect(wrapper.find('.pagerList').at(0).find('span > span')).to.have.lengthOf(7);
    expect(wrapper.find('.pagerList').at(1).find('span > span')).to.have.lengthOf(7);
    expect(wrapper.find('.pagerList').at(1).find('span > span').at(0).hasClass('activePage')).to.be.true;
    wrapper.find('.pagerList').at(1).find('span > span').at(5).simulate('click');
    expect(wrapper.find('.child-3')).to.have.lengthOf(1);
    expect(wrapper.find('.child-4')).to.have.lengthOf(1);
    expect(wrapper.find('.child-5')).to.have.lengthOf(1);
    expect(wrapper.find('.pagerList').at(0).find('span > span')).to.have.lengthOf(9);
    expect(wrapper.find('.pagerList').at(1).find('span > span')).to.have.lengthOf(9);
    expect(wrapper.find('.pagerList').at(1).find('span > span').at(3).hasClass('activePage')).to.be.true;
    wrapper.find('.pagerList').at(1).find('span > span').at(4).simulate('click');
    expect(wrapper.find('.child-6')).to.have.lengthOf(1);
    expect(wrapper.find('.child-7')).to.have.lengthOf(1);
    expect(wrapper.find('.child-8')).to.have.lengthOf(1);
    wrapper.find('.pagerList').at(1).find('span > span').at(0).simulate('click');
    expect(wrapper.find('.child-0')).to.have.lengthOf(1);
    expect(wrapper.find('.child-1')).to.have.lengthOf(1);
    expect(wrapper.find('.child-2')).to.have.lengthOf(1);
    expect(wrapper.find('.pagerList').at(0).find('span > span')).to.have.lengthOf(7);
    expect(wrapper.find('.pagerList').at(1).find('span > span')).to.have.lengthOf(7);
    wrapper.find('.pagerList').at(1).find('span > span').at(4).simulate('click');
    expect(wrapper.find('.child-12')).to.have.lengthOf(1);
    expect(wrapper.find('.child-13')).to.have.lengthOf(1);
    expect(wrapper.find('.child-14')).to.have.lengthOf(1);
    expect(wrapper.find('.pagerList').at(0).find('span > span')).to.have.lengthOf(9);
    expect(wrapper.find('.pagerList').at(1).find('span > span')).to.have.lengthOf(9);
    expect(wrapper.find('.pagerList').at(1).find('span > span').at(4).hasClass('activePage')).to.be.true;
    wrapper.find('.pagerList').at(1).find('span > span').at(1).simulate('click');
    expect(wrapper.find('.child-9')).to.have.lengthOf(1);
    expect(wrapper.find('.child-10')).to.have.lengthOf(1);
    expect(wrapper.find('.child-11')).to.have.lengthOf(1);
    expect(wrapper.find('.pagerList').at(1).find('span > span').at(4).hasClass('activePage')).to.be.true;
    wrapper.find('.pagerList').at(1).find('span > span').at(8).simulate('click');
    expect(wrapper.find('.pagerList').at(0).find('span > span')).to.have.lengthOf(7);
    expect(wrapper.find('.pagerList').at(1).find('span > span')).to.have.lengthOf(7);
    expect(wrapper.find('.child-27')).to.have.lengthOf(1);
    expect(wrapper.find('.child-28')).to.have.lengthOf(1);
    expect(wrapper.find('.child-29')).to.have.lengthOf(1);
    expect(wrapper.find('.pagerList').at(1).find('span > span').at(6).hasClass('activePage')).to.be.true;
  });


  it('should not render when inactive', () => {
    const wrapper = shallow(<Pager size={3} inactive={true} wrapper={content => <div className="contentWrapper">{content}</div>}>{generateChildren(30)}</Pager>);

    expect(wrapper.find('.pagedList')).to.have.lengthOf(0);
    expect(wrapper.find('.pagedContent')).to.have.lengthOf(0);
    expect(wrapper.find('.pager')).to.have.lengthOf(0);
    expect(wrapper.find('.contentWrapper')).to.have.lengthOf(1);
    expect(wrapper.find('.child')).to.have.lengthOf(30);
    expect(wrapper.find('.child-0')).to.have.lengthOf(1);
    expect(wrapper.find('.child-11')).to.have.lengthOf(1);
    expect(wrapper.find('.child-22')).to.have.lengthOf(1);
    expect(wrapper.find('.child-29')).to.have.lengthOf(1);
  });


  it('should render top pager according to property', () => {
    const wrapper = shallow(<Pager size={3} top={true} wrapper={content => <div className="contentWrapper">{content}</div>}>{generateChildren(3)}</Pager>);

    expect(wrapper.find('.pagedList > div').at(0).hasClass('pager')).to.be.true;
  });


  it('should render bottom pager according to property', () => {
    const wrapper = shallow(<Pager size={3} bottom={true} wrapper={content => <div className="contentWrapper">{content}</div>}>{generateChildren(3)}</Pager>);

    expect(wrapper.find('.pagedList > div').at(1).hasClass('pager')).to.be.true;
  });
});
