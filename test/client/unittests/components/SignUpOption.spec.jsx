import React from 'react';
import { shallow, mount } from 'enzyme';
import SignUpOption from 'DIALOG/SignUpDialog/SignUpOption.jsx';

describe('SignUpDialog - SignUpOption', () => {
  test('should render elements', () => {
    let set_option_output = {};

    const OPTION = {
          id: 1,
          name: 'testoption',
          type: 'toggle'
        },
        VALUE = {
          show: undefined
        },
        wrapper = shallow(<SignUpOption option={OPTION} value={VALUE} setOption={opt => set_option_output=opt}/>);

    expect(wrapper.find('.SignUpOption > label')).toHaveLength(1);
    expect(wrapper.find('.row.yesNo')).toHaveLength(1);
    expect(wrapper.find('.yesNo .row > label')).toHaveLength(2);

    expect(wrapper.find('#SignUpDialog_Option_yes_' + OPTION.id).prop('defaultChecked')).toBe(undefined);
    expect(wrapper.find('#SignUpDialog_Option_no_' + OPTION.id).prop('defaultChecked')).toBe(false);
  });

  test('should set show according to value', () => {
    let set_option_output = {};

    const OPTION = {
          id: 1,
          name: 'testoption',
          type: 'toggle'
        },
        VALUE = {
          show: 1
        },
        wrapper = shallow(<SignUpOption option={OPTION} value={VALUE} setOption={opt => set_option_output=opt}/>);

    expect(wrapper.find('#SignUpDialog_Option_yes_' + OPTION.id).prop('defaultChecked')).toBe(1);
    expect(wrapper.find('#SignUpDialog_Option_no_' + OPTION.id).prop('defaultChecked')).toBe(false);
  });

  test('should set show according to value', () => {
    let set_option_output = {};

    const OPTION = {
          id: 1,
          name: 'testoption',
          type: 'toggle'
        },
        VALUE = {
          show: 0
        },
        wrapper = shallow(<SignUpOption option={OPTION} value={VALUE} setOption={opt => set_option_output=opt}/>);

    expect(wrapper.find('#SignUpDialog_Option_yes_' + OPTION.id).prop('defaultChecked')).toBe(0);
    expect(wrapper.find('#SignUpDialog_Option_no_' + OPTION.id).prop('defaultChecked')).toBe(true);
  });

  test('should render elements if type is count', () => {
    let set_option_output = {};

    const OPTION = {
          id: 1,
          name: 'testoption',
          type: 'count',
          values: [{id: 1, name: 'test'}, {id: 2, name: 'test2'}]
        },
        VALUE = {
          id: 1,
          value: null,
          show: undefined
        },
        wrapper = shallow(<SignUpOption option={OPTION} value={VALUE} setOption={opt => set_option_output=opt}/>);

    expect(wrapper.find('.SignUpOption .count')).toHaveLength(1);
    expect(wrapper.find('.optionSelect')).toHaveLength(1);
    expect(wrapper.find('.optionSelect > option')).toHaveLength(2);
    wrapper.find('.optionSelect > option').forEach(elem => {
      expect(OPTION.values.map(opt => opt.name).includes(elem.prop('value'))).toBe(true);
    });
    expect(wrapper.find('.row.yesNo')).toHaveLength(0);
  });

  test('should render elements if type is select', () => {
    let set_option_output = {};

    const OPTION = {
          id: 1,
          name: 'testoption',
          type: 'select',
          values: [{id: 1, name: 'test'}, {id: 2, name: 'test2'}]
        },
        VALUE = {
          id: 1,
          value: null,
          show: undefined
        },
        wrapper = shallow(<SignUpOption option={OPTION} value={VALUE} setOption={opt => set_option_output=opt}/>);

    expect(wrapper.find('.SignUpOption .count')).toHaveLength(0);
    expect(wrapper.find('.optionSelect')).toHaveLength(1);
    expect(wrapper.find('.optionSelect > option')).toHaveLength(2);
    wrapper.find('.optionSelect > option').forEach(elem => {
      expect(OPTION.values.map(opt => opt.name).includes(elem.prop('value'))).toBe(true);
    });
    expect(wrapper.find('.row.yesNo')).toHaveLength(0);
  });

  test('should set show according to event', () => {
    let set_option_output = {};

    const OPTION = {
          id: 1,
          name: 'testoption',
          type: 'toggle'
        },
        VALUE = {
          show: undefined
        },
        wrapper = shallow(<SignUpOption option={OPTION} value={VALUE} setOption={opt => set_option_output=opt}/>);

    wrapper.find('#SignUpDialog_Option_yes_' + OPTION.id).simulate('change', {target: {value: 1}});
    expect(set_option_output.show).toBe(1);
    wrapper.find('#SignUpDialog_Option_yes_' + OPTION.id).simulate('change', {target: {value: 0}});
    expect(set_option_output.show).toBe(0);
  });

  test('should set count according to event', () => {
    let set_option_output = {};

    const OPTION = {
          id: 1,
          name: 'testoption',
          type: 'count',
          values: [{id: 1, name: 'test'}, {id: 2, name: 'test2'}]
        },
        VALUE = {
          id: 1,
          value: null,
          show: undefined
        },
        wrapper = shallow(<SignUpOption option={OPTION} value={VALUE} setOption={opt => set_option_output=opt}/>);

    wrapper.find('.count').simulate('change', {target: {value: 5}});
    expect(set_option_output.count).toBe(5);
    wrapper.find('.count').simulate('change', {target: {value: 10}});
    expect(set_option_output.count).toBe(10);
  });

  test('should set value according to event', () => {
    let set_option_output = {};

    const OPTION = {
          id: 1,
          name: 'testoption',
          type: 'count',
          values: [{id: 1, name: 'test'}, {id: 2, name: 'test2'}]
        },
        VALUE = {
          id: 1,
          value: null,
          show: undefined
        },
        wrapper = shallow(<SignUpOption option={OPTION} value={VALUE} setOption={opt => set_option_output=opt}/>);

    wrapper.find('.optionSelect').simulate('change', {target: {value: 'test'}});
    expect(set_option_output.value).toBe('test');
    wrapper.find('.optionSelect').simulate('change', {target: {value: 'test2'}});
    expect(set_option_output.value).toBe('test2');
  });
});
