import React from 'react';
import { shallow, mount } from 'enzyme';
import SignUpDialog from 'UI/SignUpDialog/SignUpDialog.jsx';

const setup = ({stub = () => () => undefined, edit = false, signedUp = false, userId = 1, name = 'testname', signup}) => {
      const user = {
        id: userId,
        mail: 'test@test.de',
        name
      },
      meal = {
        name: 'testmeal',
        price: 3,
        options: []
      },
      OPTS = {
        user,
        edit,
        signedUp,
        meal,
        signup: edit ? signup : undefined,
        meal_signup: stub('meal_signup'),
        meal_edit: stub('meal_edit'),
        close_dialog: stub('close_dialog')
      },
      wrapper = shallow(<SignUpDialog {...OPTS} />);

  return {wrapper, user, meal, edit, signedUp, signup};
}

describe('SignUpDialog', () => {
  test(
    'should render all elements containing default values while not signed up yet',
    () => {
      const wrapper = setup({}).wrapper;

      expect(wrapper.find('.warning.title.anon')).toHaveLength(0);
      expect(wrapper.find('.warning.signedUp')).toHaveLength(0);
      expect(wrapper.find('#SignUpDialog_name').length).toBe(0);
      expect(wrapper.find('.signupName')).toHaveLength(1);
      expect(wrapper.find('.signupName').text()).toBe('testname');
      expect(wrapper.find('.editName.edit')).toHaveLength(1);
      expect(wrapper.find('.editName.cancel')).toHaveLength(0);
      expect(wrapper.find('#SignUpDialog_comment')).toHaveLength(1);
      expect(wrapper.find('.estimated_price span').text()).toContain('3.00');
    }
  );

  test('should render all warnings if neccessary', () => {
    const wrapper = setup({userId: false, name: false}).wrapper;
    expect(wrapper.find('.warning.title.anon')).toHaveLength(1);
    expect(wrapper.find('.warning.signedUp')).toHaveLength(0);
    expect(wrapper.find('#SignUpDialog_name').length).toBe(1);
  });

  test('should render all warnings if neccessary', () => {
    const wrapper = setup({signedUp: true}).wrapper;

    expect(wrapper.find('.warning.title.anon')).toHaveLength(0);
    expect(wrapper.find('.warning.signedUp')).toHaveLength(1);
  });

  test('should close on cancel button click', () => {
    let dialog_closed = false;
    const wrapper = setup({stub: ((source) => () => dialog_closed = (source === 'close_dialog'))}).wrapper;

    wrapper.find('button.cancel').simulate('click');

    expect(dialog_closed).toBe(true);
  });

  test('should close on close button click', () => {
    let dialog_closed = false;
    const wrapper = setup({stub: ((source) => () => dialog_closed = (source === 'close_dialog'))}).wrapper;

    wrapper.find('.titlebar span.fa-times').simulate('click');

    expect(dialog_closed).toBe(true);
  });

  test('should call submit action with the right parameters', () => {
    let output;
    const opts = setup({stub: (source) => (data) => output={source, data}}),
        wrapper = opts.wrapper,
        TESTCOMMENT = 'testcomment';

    wrapper.find('#SignUpDialog_comment').simulate('change', {target: {value: TESTCOMMENT}})

    wrapper.find('.submit').simulate('click');

    expect(output.data).toEqual({
      name: opts.user.name,
      userId: opts.user.id,
      comment: TESTCOMMENT,
      meal: opts.meal.id,
      options: [],
      signup: null
    });

    expect(output.source).toBe('meal_signup');
  });

  test(
    'should call edit action with the right parameters and input comment',
    () => {
      let output;
      const TESTCOMMENT = 'testcomment',
          TESTCOMMENT2 = 'testcomm1231ent32',
          signup = {
            name: 'testname',
            userId: 1,
            comment: TESTCOMMENT,
            options: [],
            id: 1
          },
          opts = setup({edit: true, signup, stub: (source) => (data) => output={source, data}}),
          wrapper = opts.wrapper;

      expect(wrapper.find('#SignUpDialog_comment').prop('defaultValue')).toBe(TESTCOMMENT);
      wrapper.find('#SignUpDialog_comment').simulate('change', {target: {value: TESTCOMMENT2}})

      wrapper.find('.submit').simulate('click');

      expect(output.data).toEqual({
        name: opts.user.name,
        userId: opts.user.id,
        comment: TESTCOMMENT2,
        meal: opts.meal.id,
        options: [],
        signup: 1
      });

      expect(output.source).toBe('meal_edit');
    }
  );

});