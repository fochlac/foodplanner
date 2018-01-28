import React from 'react';
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
  test('should render all elements', () => {
    const wrapper = shallow(<Dashboard {...options} />);

    expect(wrapper.find('.dashboard')).toHaveLength(1);
    expect(wrapper.find('.offlineBar')).toHaveLength(1);
    expect(wrapper.find('.filters')).toHaveLength(1);
    expect(wrapper.find('.filterList')).toHaveLength(1);
    expect(wrapper.find('.filterList')).toHaveLength(1);
    expect(wrapper.find(Meal)).toHaveLength(1);

    wrapper.setProps({app: {offline:false}});
    wrapper.find('.filterList li').at(1).simulate('click');

    expect(wrapper.find('.offlineBar')).toHaveLength(0);
    expect(wrapper.find(Meal)).toHaveLength(2);
  });
});