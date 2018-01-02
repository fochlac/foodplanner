import React from 'react';
import { expect } from 'chai';
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
  it('should render all elements containing default values while not signed up yet', () => {
    const wrapper = setup({}).wrapper;

    expect(wrapper.find('.warning.title.anon')).to.have.lengthOf(0);
    expect(wrapper.find('.warning.signedUp')).to.have.lengthOf(0);
    expect(wrapper.find('#SignUpDialog_name').length).to.equal(0);
    expect(wrapper.find('.signupName')).to.have.lengthOf(1);
    expect(wrapper.find('.signupName').text()).to.equal('testname');
    expect(wrapper.find('.editName.edit')).to.have.lengthOf(1);
    expect(wrapper.find('.editName.cancel')).to.have.lengthOf(0);
    expect(wrapper.find('#SignUpDialog_comment')).to.have.lengthOf(1);
    expect(wrapper.find('.estimated_price span').text()).to.include('3.00');
  });

  it('should render all warnings if neccessary', () => {
    const wrapper = setup({userId: false, name: false}).wrapper;
    expect(wrapper.find('.warning.title.anon')).to.have.lengthOf(1);
    expect(wrapper.find('.warning.signedUp')).to.have.lengthOf(0);
    expect(wrapper.find('#SignUpDialog_name').length).to.equal(1);
  });

  it('should render all warnings if neccessary', () => {
    const wrapper = setup({signedUp: true}).wrapper;

    expect(wrapper.find('.warning.title.anon')).to.have.lengthOf(0);
    expect(wrapper.find('.warning.signedUp')).to.have.lengthOf(1);
  });

  it('should close on cancel button click', () => {
    let dialog_closed = false;
    const wrapper = setup({stub: ((source) => () => dialog_closed = (source === 'close_dialog'))}).wrapper;

    wrapper.find('button.cancel').simulate('click');

    expect(dialog_closed).to.true;
  });

  it('should close on close button click', () => {
    let dialog_closed = false;
    const wrapper = setup({stub: ((source) => () => dialog_closed = (source === 'close_dialog'))}).wrapper;

    wrapper.find('.titlebar span.fa-times').simulate('click');

    expect(dialog_closed).to.true;
  });

  it('should call submit action with the right parameters', () => {
    let output;
    const opts = setup({stub: (source) => (data) => output={source, data}}),
        wrapper = opts.wrapper,
        TESTCOMMENT = 'testcomment';

    wrapper.find('#SignUpDialog_comment').simulate('change', {target: {value: TESTCOMMENT}})

    wrapper.find('.submit').simulate('click');

    expect(output.data).to.deep.equal({
      name: opts.user.name,
      userId: opts.user.id,
      comment: TESTCOMMENT,
      meal: opts.meal.id,
      options: [],
      signup: null
    });

    expect(output.source).to.equal('meal_signup');
  });

  it('should call edit action with the right parameters and input comment', () => {
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

    expect(wrapper.find('#SignUpDialog_comment').prop('defaultValue')).to.equal(TESTCOMMENT);
    wrapper.find('#SignUpDialog_comment').simulate('change', {target: {value: TESTCOMMENT2}})

    wrapper.find('.submit').simulate('click');

    expect(output.data).to.deep.equal({
      name: opts.user.name,
      userId: opts.user.id,
      comment: TESTCOMMENT2,
      meal: opts.meal.id,
      options: [],
      signup: 1
    });

    expect(output.source).to.equal('meal_edit');
  });

});