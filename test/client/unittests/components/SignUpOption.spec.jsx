import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import SignUpOption from 'UI/SignUpDialog/SignUpOption.jsx';

describe('SignUpDialog - SignUpOption', () => {
  it('should render elements', () => {
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

    expect(wrapper.find('.SignUpOption > label')).to.have.lengthOf(1);
    expect(wrapper.find('.row.yesNo')).to.have.lengthOf(1);
    expect(wrapper.find('.yesNo .row > label')).to.have.lengthOf(2);

    expect(wrapper.find('#SignUpDialog_Option_yes_' + OPTION.id).prop('defaultChecked')).to.equal(undefined);
    expect(wrapper.find('#SignUpDialog_Option_no_' + OPTION.id).prop('defaultChecked')).to.equal(false);
  });

  it('should set show according to value', () => {
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

    expect(wrapper.find('#SignUpDialog_Option_yes_' + OPTION.id).prop('defaultChecked')).to.equal(1);
    expect(wrapper.find('#SignUpDialog_Option_no_' + OPTION.id).prop('defaultChecked')).to.equal(false);
  });

  it('should set show according to value', () => {
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

    expect(wrapper.find('#SignUpDialog_Option_yes_' + OPTION.id).prop('defaultChecked')).to.equal(0);
    expect(wrapper.find('#SignUpDialog_Option_no_' + OPTION.id).prop('defaultChecked')).to.be.true;
  });

  it('should render elements if type is count', () => {
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

    expect(wrapper.find('.SignUpOption .count')).to.have.lengthOf(1);
    expect(wrapper.find('.optionSelect')).to.have.lengthOf(1);
    expect(wrapper.find('.optionSelect > option')).to.have.lengthOf(2);
    wrapper.find('.optionSelect > option').forEach(elem => {
      expect(OPTION.values.map(opt => opt.name).includes(elem.prop('value'))).to.be.true;
    });
    expect(wrapper.find('.row.yesNo')).to.have.lengthOf(0);
  });

  it('should render elements if type is select', () => {
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

    expect(wrapper.find('.SignUpOption .count')).to.have.lengthOf(0);
    expect(wrapper.find('.optionSelect')).to.have.lengthOf(1);
    expect(wrapper.find('.optionSelect > option')).to.have.lengthOf(2);
    wrapper.find('.optionSelect > option').forEach(elem => {
      expect(OPTION.values.map(opt => opt.name).includes(elem.prop('value'))).to.be.true;
    });
    expect(wrapper.find('.row.yesNo')).to.have.lengthOf(0);
  });

  it('should set show according to event', () => {
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
    expect(set_option_output.show).to.equal(1);
    wrapper.find('#SignUpDialog_Option_yes_' + OPTION.id).simulate('change', {target: {value: 0}});
    expect(set_option_output.show).to.equal(0);
  });

  it('should set count according to event', () => {
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
    expect(set_option_output.count).to.equal(5);
    wrapper.find('.count').simulate('change', {target: {value: 10}});
    expect(set_option_output.count).to.equal(10);
  });

  it('should set value according to event', () => {
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
    expect(set_option_output.value).to.equal('test');
    wrapper.find('.optionSelect').simulate('change', {target: {value: 'test2'}});
    expect(set_option_output.value).to.equal('test2');
  });
});
