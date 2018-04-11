import React from 'react';
import { shallow, mount } from 'enzyme';
import MealOption from 'DIALOG/CreateMealDialog/MealOption.jsx';

describe('CreateMealDialog - MealOption', () => {
  test(
    'should render delete link, optionname input, optiontype selector, all enabled',
    () => {
      let set_option_output = {};

      const INDEX = 1,
          OPTION = {
            name: 'testoption',
            type: 'toggle'
          },
          EDITABLE = true,
          wrapper = shallow(<MealOption index={INDEX} option={OPTION} editable={EDITABLE} setOption={opt => set_option_output=opt}/>);

      expect(wrapper.find('.delLink').length).toBe(1);
      expect(wrapper.find('#SignUpDialog_optionname_' + INDEX).length).toBe(1);
      expect(wrapper.find('#SignUpDialog_optiontype_' + INDEX).length).toBe(1);
      expect(wrapper.find('#SignUpDialog_optiontype_' + INDEX + ' option').length).toBe(3);

      expect(wrapper.find('#SignUpDialog_optionname_' + INDEX).prop('disabled')).toBe(false);
      expect(wrapper.find('#SignUpDialog_optiontype_' + INDEX).prop('disabled')).toBe(false);
    }
  );

  test(
    'should disable optionname input, optiontype selector when editable = false',
    () => {
      let set_option_output = {};

      const INDEX = 1,
          OPTION = {
            name: 'testoption',
            type: 'toggle'
          },
          EDITABLE = false,
          wrapper = shallow(<MealOption index={INDEX} option={OPTION} editable={EDITABLE} setOption={opt => set_option_output=opt}/>);

      expect(wrapper.find('.delLink').length).toBe(0);
      expect(wrapper.find('#SignUpDialog_optionname_' + INDEX).prop('disabled')).toBe(true);
      expect(wrapper.find('#SignUpDialog_optiontype_' + INDEX).prop('disabled')).toBe(true);
    }
  );

  test('should remove its option object on delete link click', () => {
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
    expect(delete_option_output).toBe(INDEX);
  });

  test('should write the current name to input and select current type', () => {
    let set_option_output = {};

    const INDEX = 1,
        OPTION = {
          name: 'testoption',
          type: 'toggle'
        },
        EDITABLE = true,
        wrapper = shallow(<MealOption index={INDEX} option={OPTION} editable={EDITABLE} setOption={opt => set_option_output=opt} />);

    expect(wrapper.find('#SignUpDialog_optionname_' + INDEX).prop('defaultValue')).toBe(OPTION.name);
    expect(wrapper.find('#SignUpDialog_optiontype_' + INDEX).prop('defaultValue')).toBe(OPTION.type);
  });

  test('should output a new option object on name change', () => {
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

    expect(set_option_output.name).toBe(NEW_NAME);
  });

  test(
    'should output a new option object on type change to count and display the valuecloud and an optionvalue input with button',
    () => {
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

      expect(set_option_output.type).toBe(NEW_TYPE);
      expect(wrapper.find('#SignUpDialog_optionvalue_' + INDEX).length).toBe(1);
      expect(wrapper.find('.addButton').length).toBe(1);
      expect(wrapper.find('.valueCloud').length).toBe(1);
    }
  );

  test(
    'should output a new option object on type change to select and display the valuecloud and an optionvalue input with button',
    () => {
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

      expect(set_option_output.type).toBe(NEW_TYPE);
      expect(wrapper.find('#SignUpDialog_optionvalue_' + INDEX).length).toBe(1);
      expect(wrapper.find('.addButton').length).toBe(1);
      expect(wrapper.find('.valueCloud').length).toBe(1);
    }
  );

  test(
    'should render delete link, optionname input, optiontype selector, option value input, add option button, all enabled if type is count',
    () => {
      let set_option_output;

      const INDEX = 1,
          OPTION = {
            name: '',
            type: 'count',
            values: []
          },
          EDITABLE = true,
          wrapper = shallow(<MealOption index={INDEX} option={OPTION} editable={EDITABLE} setOption={opt => set_option_output=opt}/>);

      expect(wrapper.find('.delLink').length).toBe(1);
      expect(wrapper.find('#SignUpDialog_optionname_' + INDEX).length).toBe(1);
      expect(wrapper.find('#SignUpDialog_optiontype_' + INDEX).length).toBe(1);
      expect(wrapper.find('#SignUpDialog_optiontype_' + INDEX + ' option').length).toBe(3);
      expect(wrapper.find('#SignUpDialog_optionvalue_' + INDEX).length).toBe(1);
      expect(wrapper.find('.addButton').length).toBe(1);
      expect(wrapper.find('.valueCloud').length).toBe(1);

      expect(wrapper.find('#SignUpDialog_optionname_' + INDEX).prop('disabled')).toBe(false);
      expect(wrapper.find('#SignUpDialog_optiontype_' + INDEX).prop('disabled')).toBe(false);
      expect(wrapper.find('#SignUpDialog_optionvalue_' + INDEX).prop('disabled')).toBe(false);
      expect(wrapper.find('.addButton').prop('disabled')).toBe(false);
      expect(wrapper.find('.valueCloud li').length).toBe(0);
      expect(wrapper.find('#SignUpDialog_optionname_' + INDEX).prop('defaultValue')).toBe(OPTION.name);
      expect(wrapper.find('#SignUpDialog_optiontype_' + INDEX).prop('defaultValue')).toBe(OPTION.type);
    }
  );

  test(
    'should render delete link, optionname input, optiontype selector, option value input, add option button, all enabled if type is select',
    () => {
      let set_option_output;

      const INDEX = 1,
          OPTION = {
            name: '',
            type: 'select',
            values: []
          },
          EDITABLE = true,
          wrapper = shallow(<MealOption index={INDEX} option={OPTION} editable={EDITABLE} setOption={opt => set_option_output=opt}/>);

      expect(wrapper.find('.delLink').length).toBe(1);
      expect(wrapper.find('#SignUpDialog_optionname_' + INDEX).length).toBe(1);
      expect(wrapper.find('#SignUpDialog_optiontype_' + INDEX).length).toBe(1);
      expect(wrapper.find('#SignUpDialog_optiontype_' + INDEX + ' option').length).toBe(3);
      expect(wrapper.find('#SignUpDialog_optionvalue_' + INDEX).length).toBe(1);
      expect(wrapper.find('.addButton').length).toBe(1);
      expect(wrapper.find('.valueCloud').length).toBe(1);

      expect(wrapper.find('#SignUpDialog_optionname_' + INDEX).prop('disabled')).toBe(false);
      expect(wrapper.find('#SignUpDialog_optiontype_' + INDEX).prop('disabled')).toBe(false);
      expect(wrapper.find('#SignUpDialog_optionvalue_' + INDEX).prop('disabled')).toBe(false);
      expect(wrapper.find('.addButton').prop('disabled')).toBe(false);
      expect(wrapper.find('.valueCloud li').length).toBe(0);
      expect(wrapper.find('#SignUpDialog_optionname_' + INDEX).prop('defaultValue')).toBe(OPTION.name);
      expect(wrapper.find('#SignUpDialog_optiontype_' + INDEX).prop('defaultValue')).toBe(OPTION.type);
    }
  );
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

  test('should render option values', () => {
    let set_option_output = {};
    const wrapper = setup(set_option_output);

    expect(wrapper.find('.valueCloud li span.fa-times').length).toBe(2);

    expect(wrapper.find('.valueCloud').childAt(0).text()).toBe(VALUE1 + ' ');
    expect(wrapper.find('.valueCloud').childAt(1).text()).toBe(VALUE2 + ' ');
  });

  test('should not render delete buttons on values if editable = false', () => {
    let set_option_output = {};
    const wrapper = setup(set_option_output, false);

    expect(wrapper.find('#SignUpDialog_optionvalue_' + INDEX).prop('disabled')).toBe(true);
    expect(wrapper.find('.addButton').prop('disabled')).toBe(true);
    expect(wrapper.find('.valueCloud li span.fa-times').length).toBe(0);
  });

  test('should output a new option object on add value', () => {
    let set_option_output = {};
    const wrapper = setup(set_option_output),
        NEW_NAME = 'test3';

    wrapper.find('#SignUpDialog_optionvalue_' + INDEX).simulate('change', {target: {value: NEW_NAME}});

    expect(wrapper.find('#SignUpDialog_optionvalue_' + INDEX).prop('value')).toBe(NEW_NAME);

    wrapper.find('.addButton').simulate('click');
    expect(wrapper.find('#SignUpDialog_optionvalue_' + INDEX).prop('value')).toBe('');
    expect(set_option_output.option.values.length).toBe(3);
    expect(set_option_output.option.values[2].name).toBe(NEW_NAME);

    expect(wrapper.find('.valueCloud li').length).toBe(3);
    expect(wrapper.find('.valueCloud li span.fa-times').length).toBe(3);

    expect(wrapper.find('.valueCloud').childAt(0).text()).toBe(VALUE1 + ' ');
    expect(wrapper.find('.valueCloud').childAt(1).text()).toBe(VALUE2 + ' ');
    expect(wrapper.find('.valueCloud').childAt(2).text()).toBe(NEW_NAME + ' ');
  });

  test('should not update on empty or existing value', () => {
    let set_option_output = {};
    const wrapper = setup(set_option_output);

    wrapper.find('#SignUpDialog_optionvalue_' + INDEX).simulate('change', {target: {value: ''}});
    wrapper.find('.addButton').simulate('click');
    expect(wrapper.find('.valueCloud li').length).toBe(2);

    wrapper.find('#SignUpDialog_optionvalue_' + INDEX).simulate('change', {target: {value: VALUE1}});
    wrapper.find('.addButton').simulate('click');
    expect(wrapper.find('.valueCloud li').length).toBe(2);
    expect(wrapper.find('#SignUpDialog_optionvalue_' + INDEX).prop('value')).toBe(VALUE1);
  });

  test('should remove values on delete button click', () => {
    let set_option_output = {};
    const wrapper = setup(set_option_output);

    wrapper.find('.valueCloud').childAt(0).find('.fa-times').simulate('click');
    expect(wrapper.find('.valueCloud li').length).toBe(1);
    expect(wrapper.find('.valueCloud').childAt(0).text()).toBe(VALUE2 + ' ');
    expect(set_option_output.option.values.length).toBe(1);
    expect(set_option_output.option.values[0].name).toBe(VALUE2);
  });
});