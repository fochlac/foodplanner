import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import MealOption from 'UI/CreateMealDialog/MealOption.jsx';

describe('CreateMealDialog - MealOption', () => {
  it('should render delete link, optionname input, optiontype selector, all enabled', () => {
    let set_option_output = {};

    const INDEX = 1,
        OPTION = {
          name: 'testoption',
          type: 'toggle'
        },
        EDITABLE = true,
        wrapper = shallow(<MealOption index={INDEX} option={OPTION} editable={EDITABLE} setOption={opt => set_option_output=opt}/>);

    expect(wrapper.find('.delLink').length).to.equal(1);
    expect(wrapper.find('#SignUpDialog_optionname_' + INDEX).length).to.equal(1);
    expect(wrapper.find('#SignUpDialog_optiontype_' + INDEX).length).to.equal(1);
    expect(wrapper.find('#SignUpDialog_optiontype_' + INDEX + ' option').length).to.equal(3);

    expect(wrapper.find('#SignUpDialog_optionname_' + INDEX).prop('disabled')).to.be.false;
    expect(wrapper.find('#SignUpDialog_optiontype_' + INDEX).prop('disabled')).to.be.false;
  });

  it('should disable optionname input, optiontype selector when editable = false', () => {
    let set_option_output = {};

    const INDEX = 1,
        OPTION = {
          name: 'testoption',
          type: 'toggle'
        },
        EDITABLE = false,
        wrapper = shallow(<MealOption index={INDEX} option={OPTION} editable={EDITABLE} setOption={opt => set_option_output=opt}/>);

    expect(wrapper.find('.delLink').length).to.equal(0);
    expect(wrapper.find('#SignUpDialog_optionname_' + INDEX).prop('disabled')).to.be.true;
    expect(wrapper.find('#SignUpDialog_optiontype_' + INDEX).prop('disabled')).to.be.true;
  });

  it('should remove its option object on delete link click', () => {
    let set_option_output,
        delete_option_output;

    const INDEX = 1,
        OPTION = {
          name: 'testoption',
          type: 'toggle'
        },
        EDITABLE = true,
        wrapper = shallow(<MealOption index={INDEX} option={OPTION} editable={EDITABLE} setOption={opt => set_option_output=opt} deleteOption={id => delete_option_output=id}/>);

    wrapper.find('.delLink').simulate('click');
    expect(delete_option_output).to.equal(INDEX);
  });

  it('should write the current name to input and select current type', () => {
    let set_option_output = {};

    const INDEX = 1,
        OPTION = {
          name: 'testoption',
          type: 'toggle'
        },
        EDITABLE = true,
        wrapper = shallow(<MealOption index={INDEX} option={OPTION} editable={EDITABLE} setOption={opt => set_option_output=opt} />);

    expect(wrapper.find('#SignUpDialog_optionname_' + INDEX).prop('defaultValue')).to.equal(OPTION.name);
    expect(wrapper.find('#SignUpDialog_optiontype_' + INDEX).prop('defaultValue')).to.equal(OPTION.type);
  });

  it('should output a new option object on name change', () => {
    let set_option_output = {};

    const INDEX = 1,
        OPTION = {
          name: 'testoption',
          type: 'toggle'
        },
        EDITABLE = true,
        NEW_NAME = 'test123',
        wrapper = shallow(<MealOption index={INDEX} option={OPTION} editable={EDITABLE} setOption={opt => set_option_output=opt} />);

    wrapper.find('#SignUpDialog_optionname_' + INDEX).simulate('change', {target: {value: NEW_NAME}});

    expect(set_option_output.name).to.equal(NEW_NAME);
  });

  it('should output a new option object on type change to count and display the valuecloud and an optionvalue input with button', () => {
    let set_option_output = {};

    const INDEX = 1,
        OPTION = {
          name: 'testoption',
          type: 'toggle',
          values: []
        },
        EDITABLE = true,
        NEW_TYPE = 'count',
        wrapper = shallow(<MealOption index={INDEX} option={OPTION} editable={EDITABLE} setOption={opt => {set_option_output=opt; wrapper.setProps({option: opt})}} />);

    wrapper.find('#SignUpDialog_optiontype_' + INDEX).simulate('change', {target: {value: NEW_TYPE}});

    expect(set_option_output.type).to.equal(NEW_TYPE);
    expect(wrapper.find('#SignUpDialog_optionvalue_' + INDEX).length).to.equal(1);
    expect(wrapper.find('.addButton').length).to.equal(1);
    expect(wrapper.find('.valueCloud').length).to.equal(1);
  });

  it('should output a new option object on type change to select and display the valuecloud and an optionvalue input with button', () => {
    let set_option_output = {};

    const INDEX = 1,
        OPTION = {
          name: 'testoption',
          type: 'toggle',
          values: []
        },
        EDITABLE = true,
        NEW_TYPE = 'select',
      	wrapper = shallow(<MealOption index={INDEX} option={OPTION} editable={EDITABLE} setOption={opt => {set_option_output=opt; wrapper.setProps({option: opt})}} />);

    wrapper.find('#SignUpDialog_optiontype_' + INDEX).simulate('change', {target: {value: NEW_TYPE}});

    expect(set_option_output.type).to.equal(NEW_TYPE);
    expect(wrapper.find('#SignUpDialog_optionvalue_' + INDEX).length).to.equal(1);
    expect(wrapper.find('.addButton').length).to.equal(1);
    expect(wrapper.find('.valueCloud').length).to.equal(1);
  });

  it('should render delete link, optionname input, optiontype selector, option value input, add option button, all enabled if type is count', () => {
    let set_option_output;

    const INDEX = 1,
        OPTION = {
          name: '',
          type: 'count',
          values: []
        },
        EDITABLE = true,
        wrapper = shallow(<MealOption index={INDEX} option={OPTION} editable={EDITABLE} setOption={opt => set_option_output=opt}/>);

    expect(wrapper.find('.delLink').length).to.equal(1);
    expect(wrapper.find('#SignUpDialog_optionname_' + INDEX).length).to.equal(1);
    expect(wrapper.find('#SignUpDialog_optiontype_' + INDEX).length).to.equal(1);
    expect(wrapper.find('#SignUpDialog_optiontype_' + INDEX + ' option').length).to.equal(3);
    expect(wrapper.find('#SignUpDialog_optionvalue_' + INDEX).length).to.equal(1);
    expect(wrapper.find('.addButton').length).to.equal(1);
    expect(wrapper.find('.valueCloud').length).to.equal(1);

    expect(wrapper.find('#SignUpDialog_optionname_' + INDEX).prop('disabled')).to.be.false;
    expect(wrapper.find('#SignUpDialog_optiontype_' + INDEX).prop('disabled')).to.be.false;
    expect(wrapper.find('#SignUpDialog_optionvalue_' + INDEX).prop('disabled')).to.be.false;
    expect(wrapper.find('.addButton').prop('disabled')).to.be.false;
    expect(wrapper.find('.valueCloud li').length).to.equal(0);
    expect(wrapper.find('#SignUpDialog_optionname_' + INDEX).prop('defaultValue')).to.equal(OPTION.name);
    expect(wrapper.find('#SignUpDialog_optiontype_' + INDEX).prop('defaultValue')).to.equal(OPTION.type);
  });

  it('should render delete link, optionname input, optiontype selector, option value input, add option button, all enabled if type is select', () => {
    let set_option_output;

    const INDEX = 1,
        OPTION = {
          name: '',
          type: 'select',
          values: []
        },
        EDITABLE = true,
        wrapper = shallow(<MealOption index={INDEX} option={OPTION} editable={EDITABLE} setOption={opt => set_option_output=opt}/>);

    expect(wrapper.find('.delLink').length).to.equal(1);
    expect(wrapper.find('#SignUpDialog_optionname_' + INDEX).length).to.equal(1);
    expect(wrapper.find('#SignUpDialog_optiontype_' + INDEX).length).to.equal(1);
    expect(wrapper.find('#SignUpDialog_optiontype_' + INDEX + ' option').length).to.equal(3);
    expect(wrapper.find('#SignUpDialog_optionvalue_' + INDEX).length).to.equal(1);
    expect(wrapper.find('.addButton').length).to.equal(1);
    expect(wrapper.find('.valueCloud').length).to.equal(1);

    expect(wrapper.find('#SignUpDialog_optionname_' + INDEX).prop('disabled')).to.be.false;
    expect(wrapper.find('#SignUpDialog_optiontype_' + INDEX).prop('disabled')).to.be.false;
    expect(wrapper.find('#SignUpDialog_optionvalue_' + INDEX).prop('disabled')).to.be.false;
    expect(wrapper.find('.addButton').prop('disabled')).to.be.false;
    expect(wrapper.find('.valueCloud li').length).to.equal(0);
    expect(wrapper.find('#SignUpDialog_optionname_' + INDEX).prop('defaultValue')).to.equal(OPTION.name);
    expect(wrapper.find('#SignUpDialog_optiontype_' + INDEX).prop('defaultValue')).to.equal(OPTION.type);
  });
});

describe('CreateMealDialog - MealOption - optioncloud', () => {
  const INDEX = 1,
        VALUE1 = 'test1',
        VALUE2 = 'test2',
        OPTION_NAME = '',
        OPTION_TYPE = 'count',
        setup = (output, EDITABLE = true) => {
          const OPTION = {
                name: OPTION_NAME,
                type: OPTION_TYPE,
                values: [{name: VALUE1}, {name: VALUE2}]
              },
              wrapper = shallow(<MealOption index={INDEX} option={OPTION} editable={EDITABLE} setOption={opt => {output.option=opt; wrapper.setProps({option: opt})}} />);

          return wrapper;
        }

  it('should render option values', () => {
    let set_option_output = {};
    const wrapper = setup(set_option_output);

    expect(wrapper.find('.valueCloud li span.fa-times').length).to.equal(2);

    expect(wrapper.find('.valueCloud').childAt(0).text()).to.equal(VALUE1 + ' ');
    expect(wrapper.find('.valueCloud').childAt(1).text()).to.equal(VALUE2 + ' ');
  });

  it('should not render delete buttons on values if editable = false', () => {
    let set_option_output = {};
    const wrapper = setup(set_option_output, false);

    expect(wrapper.find('#SignUpDialog_optionvalue_' + INDEX).prop('disabled')).to.be.true;
    expect(wrapper.find('.addButton').prop('disabled')).to.be.true;
    expect(wrapper.find('.valueCloud li span.fa-times').length).to.equal(0);
  });

  it('should output a new option object on add value', () => {
    let set_option_output = {};
    const wrapper = setup(set_option_output),
        NEW_NAME = 'test3';

    wrapper.find('#SignUpDialog_optionvalue_' + INDEX).simulate('change', {target: {value: NEW_NAME}});

    expect(wrapper.find('#SignUpDialog_optionvalue_' + INDEX).prop('value')).to.equal(NEW_NAME);

    wrapper.find('.addButton').simulate('click');
    expect(wrapper.find('#SignUpDialog_optionvalue_' + INDEX).prop('value')).to.equal('');
    expect(set_option_output.option.values.length).to.equal(3);
    expect(set_option_output.option.values[2].name).to.equal(NEW_NAME);

    expect(wrapper.find('.valueCloud li').length).to.equal(3);
    expect(wrapper.find('.valueCloud li span.fa-times').length).to.equal(3);

    expect(wrapper.find('.valueCloud').childAt(0).text()).to.equal(VALUE1 + ' ');
    expect(wrapper.find('.valueCloud').childAt(1).text()).to.equal(VALUE2 + ' ');
    expect(wrapper.find('.valueCloud').childAt(2).text()).to.equal(NEW_NAME + ' ');
  });

  it('should not update on empty or existing value', () => {
    let set_option_output = {};
    const wrapper = setup(set_option_output);

    wrapper.find('#SignUpDialog_optionvalue_' + INDEX).simulate('change', {target: {value: ''}});
    wrapper.find('.addButton').simulate('click');
    expect(wrapper.find('.valueCloud li').length).to.equal(2);

    wrapper.find('#SignUpDialog_optionvalue_' + INDEX).simulate('change', {target: {value: VALUE1}});
    wrapper.find('.addButton').simulate('click');
    expect(wrapper.find('.valueCloud li').length).to.equal(2);
    expect(wrapper.find('#SignUpDialog_optionvalue_' + INDEX).prop('value')).to.equal(VALUE1);
  });

  it('should remove values on delete button click', () => {
    let set_option_output = {};
    const wrapper = setup(set_option_output);

    wrapper.find('.valueCloud').childAt(0).find('.fa-times').simulate('click');
    expect(wrapper.find('.valueCloud li').length).to.equal(1);
    expect(wrapper.find('.valueCloud').childAt(0).text()).to.equal(VALUE2 + ' ');
    expect(set_option_output.option.values.length).to.equal(1);
    expect(set_option_output.option.values[0].name).to.equal(VALUE2);
  });
});