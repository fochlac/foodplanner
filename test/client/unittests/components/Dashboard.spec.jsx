import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import Dashboard from 'PAGES/Dashboard/Dashboard.jsx';
import Meal from 'UI/Meal.js';

let output;

const options = {
    meals: [{id: 1}],
	oldMeals: [{id: 3}, {id: 2}],
    app: {offline: true}
}

describe('Dashboard', () => {
  it('should render all elements', () => {
    const wrapper = shallow(<Dashboard {...options} />);

    expect(wrapper.find('.dashboard')).to.have.lengthOf(1);
    expect(wrapper.find('.offlineBar')).to.have.lengthOf(1);
    expect(wrapper.find('.filters')).to.have.lengthOf(1);
    expect(wrapper.find('.filterList')).to.have.lengthOf(1);
    expect(wrapper.find('.filterList')).to.have.lengthOf(1);
    expect(wrapper.find(Meal)).to.have.lengthOf(1);

    wrapper.setProps({app: {offline:false}});
    wrapper.find('.filterList li').at(1).simulate('click');

    expect(wrapper.find('.offlineBar')).to.have.lengthOf(0);
    expect(wrapper.find(Meal)).to.have.lengthOf(2);
  });
});