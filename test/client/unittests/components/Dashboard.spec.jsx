import { mount, shallow } from 'enzyme';

import Dashboard from 'PAGES/Dashboard/Dashboard.jsx';
import Meal from 'UI/Meal.js';
import Pager from 'UI/Pager/Pager.jsx';
import React from 'react';
import UserFrame from 'UI/UserFrame.js';

let output;

const options = {
  meals: [{ id: 1, time: Date.now() + 1000000 }, { id: 3, time: Date.now() - 1000000000 }, { id: 2, time: Date.now() - 20000000000 }],
  oldMealIds: [2, 3],
  app: { offline: true },
  login: true,
  load_history: page => output = page
}

describe('Dashboard', () => {
  test('should render all elements', () => {
    const wrapper = shallow(<Dashboard {...options} />);

    expect(wrapper.find('.dashboard')).toHaveLength(1);
    expect(wrapper.find('.offlineBar')).toHaveLength(1);
    expect(wrapper.find('.filters')).toHaveLength(1);
    expect(wrapper.find(Pager)).toHaveLength(1);
    expect(wrapper.find(UserFrame)).toHaveLength(1);
    expect(wrapper.find('.filterList')).toHaveLength(1);
    expect(wrapper.find('.filterList')).toHaveLength(1);
    expect(wrapper.find(Meal)).toHaveLength(1);

    wrapper.setProps({ app: { offline: false }, login: false });
    wrapper.find('.filterList li').at(1).simulate('click');
    expect(wrapper.find(UserFrame)).toHaveLength(0);

    expect(wrapper.find('.offlineBar')).toHaveLength(0);
    expect(wrapper.find(Meal)).toHaveLength(2);
  });
});
