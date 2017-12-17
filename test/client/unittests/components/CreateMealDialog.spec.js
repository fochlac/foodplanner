import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import { formatDate, formatTime, round } from 'SCRIPTS/date.js';
import Dialog from 'UI/Dialog.js';
import ImageUploader from 'UI/ImageUploader/ImageUploader.jsx';
import MealOption from 'UI/CreateMealDialog/MealOption.jsx';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import CreateMealDialog from 'UI/CreateMealDialog/CreateMealDialog.jsx';

describe('CreateMealDialog', () => {
  it('should render all elements', () => {
    const TEST_USER = {id: 1, name: 'test'},
        TEST_APP = {dialog: {}},
        TEST_MEALS = [],
        wrapper = shallow(<CreateMealDialog user={TEST_USER} app={TEST_APP} meal={{}} meals={TEST_MEALS}/>);

    expect(wrapper.find('.titlebar').length).to.equal(1);
    expect(wrapper.find('.titlebar span.fa-times').length).to.equal(1);
    expect(wrapper.find('.body').length).to.equal(1);
    expect(wrapper.find('.foot').length).to.equal(1);
    expect(wrapper.find('.foot button').length).to.equal(2);

    expect(wrapper.find(Dialog), 'dialog not found').to.have.lengthOf(1);
    expect(wrapper.find(ImageUploader), 'image uploader not found').to.have.lengthOf(1);
    expect(wrapper.find(DayPickerInput), 'daypicker not found').to.have.lengthOf(2);

    expect(wrapper.find('#SignUpDialog_name'), 'name input not found').to.have.lengthOf(1);
    expect(wrapper.find('#SignUpDialog_description'), 'description input not found').to.have.lengthOf(1);
    expect(wrapper.find('#SignUpDialog_signupLimit'), 'singup limit input not found').to.have.lengthOf(1);
    expect(wrapper.find('.addOption'), 'add option link not found').to.have.lengthOf(1);
    expect(wrapper.find('.deadline .timePicker'), 'deadline hour select input not found').to.have.lengthOf(1);
    expect(wrapper.find('.time .timePicker'), 'time hour select not found').to.have.lengthOf(1);
  });

  it('should render meal options on add option link click', () => {
    const TEST_USER = {id: 1, name: 'test'},
        TEST_APP = {dialog: {}},
        TEST_MEALS = [],
        wrapper = shallow(<CreateMealDialog user={TEST_USER} app={TEST_APP} meal={{}} meals={TEST_MEALS}/>);
    wrapper.find('.addOption').simulate('click');

    expect(wrapper.find(MealOption), 'meal option not found').to.have.lengthOf(1);
  });

  it('should display templates and render them on selection', () => {
    const TEST_USER = {id: 1, name: 'test'},
        TEST_APP = {dialog: {}},
        TEST_MEALS = [{options: ['', ''], name: 'test', id: 0}, {options: ['', '', '', ''], name: 'test2', id: 1}],
        wrapper = shallow(<CreateMealDialog user={TEST_USER} app={TEST_APP} meal={{}} meals={TEST_MEALS}/>);
    

    expect(wrapper.find('.templateSelector'), 'template selector not found').to.have.lengthOf(1);
    expect(wrapper.find('.templateSelector option'), 'template selector options not found').to.have.lengthOf(3);
    expect(wrapper.find('.templateSelector option').at(1).prop('value'), 'template selector options not found').to.equal(0);
    expect(wrapper.find('.templateSelector option').last().prop('value'), 'template selector options not found').to.equal(1);

    wrapper.find('.templateSelector').simulate('change', {target: {value: 0}});

    expect(wrapper.find(MealOption), 'meal option not found').to.have.lengthOf(2); 
  });

  it('should close on cancel button click', () => {
    let dialog_closed = false;

    const TEST_USER = {id: 1, name: 'test'},
        TEST_APP = {dialog: {}},
        TEST_MEALS = [],
        wrapper = shallow(<CreateMealDialog user={TEST_USER} app={TEST_APP} meals={TEST_MEALS} meal={{}} close_dialog={() => dialog_closed=true}/>);

    wrapper.find('button.cancel').simulate('click');

    expect(dialog_closed).to.true;
  });

  it('should close on close button click', () => {
    let dialog_closed = false;

    const TEST_USER = {id: 1, name: 'test'},
        TEST_APP = {dialog: {}},
        TEST_MEALS = [],
        wrapper = shallow(<CreateMealDialog user={TEST_USER} app={TEST_APP} meals={TEST_MEALS} meal={{}} close_dialog={() => dialog_closed=true}/>);

    wrapper.find('.titlebar span.fa-times').simulate('click');

    expect(dialog_closed).to.true;
  });

  it('should output correct data on submit button click', () => {
    let create_meal = false;

    const TEST_USER = {id: 1, name: 'test'},
        TEST_APP = {dialog: {}},
        TEST_MEALS = [],
        TEST_MEAL = {
          name: 'testmeal',
          creator: TEST_USER.name,
          creatorId: TEST_USER.id,
          image: '',
          description: 'testdescription',
          signupLimit: 3,
          deadline: Date.now() + 10000000,
          time: Date.now() + 20000000,
          options: JSON.stringify([])
        },
        wrapper = shallow(<CreateMealDialog user={TEST_USER} app={TEST_APP} meals={TEST_MEALS} meal={{}} create_meal={output => create_meal=output}/>);

    history.pushState({}, 'test', '/mahlzeit');
    wrapper.find('#SignUpDialog_name').simulate('change', {target: {value: TEST_MEAL.name}})
    wrapper.find('#SignUpDialog_description').simulate('change', {target: {value: TEST_MEAL.description}})
    wrapper.find('#SignUpDialog_signupLimit').simulate('change', {target: {value: TEST_MEAL.signupLimit}})
    wrapper.setState({
      timeObject: new Date(TEST_MEAL.time),
      deadlineObject: new Date(TEST_MEAL.deadline)
    });

    wrapper.find('button.submit').simulate('click');

    expect(create_meal.get()).to.deep.equal(TEST_MEAL);
  });

  it('should render all elements with preset values', () => {
    const TEST_USER = {id: 1, name: 'test'},
        TEST_APP = {dialog: {}},
        TEST_MEALS = [],
        TEST_MEAL = {
          id: 1,
          name: 'testmeal',
          creator: TEST_USER.name,
          creatorId: TEST_USER.id,
          image: '',
          description: 'testdescription',
          signupLimit: 3,
          signups: [],
          deadline: Date.now() + 10000000,
          time: Date.now() + 20000000,
          options: [{}, {}]
        },
        deadline = new Date(TEST_MEAL.deadline),
        time = new Date(TEST_MEAL.time),
        wrapper = shallow(<CreateMealDialog user={TEST_USER} app={TEST_APP} meal={TEST_MEAL} edit={true} meals={TEST_MEALS}/>);

    expect(wrapper.find(MealOption), 'mealoption not found').to.have.lengthOf(2);

    expect(wrapper.find('#SignUpDialog_name').prop('defaultValue'), 'name input not set correctly').to.equal(TEST_MEAL.name);
    expect(wrapper.find('#SignUpDialog_description').prop('defaultValue'), 'description input not set correctly').to.equal(TEST_MEAL.description);
    expect(wrapper.find('#SignUpDialog_signupLimit').prop('defaultValue'), 'singup limit input not set correctly').to.equal(TEST_MEAL.signupLimit);
    expect(wrapper.find('.deadline .timePicker').prop('defaultValue'), 'deadline hour select input not set correctly').to.equal(('00' + ((deadline.getMinutes() > 45) ? deadline.getHours() + 1 :  deadline.getHours())).slice(-2) + ':' + ((deadline.getMinutes() < 15 || deadline.getMinutes() > 45) ? '00' : '30'));
    expect(wrapper.find('.time .timePicker').prop('defaultValue'), 'time hour select not set correctly').to.equal(('00' + ((time.getMinutes() > 45) ? time.getHours() + 1 :  time.getHours())).slice(-2) + ':' + ((time.getMinutes() < 15 || time.getMinutes() > 45) ? '00' : '30'));
    expect(wrapper.find('.templateSelector'), 'template selector not found').to.have.lengthOf(0);
    expect(wrapper.find('.addOption'), 'add option link not found').to.have.lengthOf(1);
  });

  it('should render add option and template selector with preset values without options', () => {
    const TEST_USER = {id: 1, name: 'test'},
        TEST_APP = {dialog: {}},
        TEST_MEALS = [{options: ['', ''], name: 'test', id: 0}, {options: ['', '', '', ''], name: 'test2', id: 1}],
        TEST_MEAL = {
          id: 1,
          name: 'testmeal',
          creator: TEST_USER.name,
          creatorId: TEST_USER.id,
          image: '',
          description: 'testdescription',
          signupLimit: 3,
          signups: [],
          deadline: Date.now() + 10000000,
          time: Date.now() + 20000000,
          options: []
        },
        deadline = new Date(TEST_MEAL.deadline),
        time = new Date(TEST_MEAL.time),
        wrapper = shallow(<CreateMealDialog user={TEST_USER} app={TEST_APP} meal={TEST_MEAL} edit={true} meals={TEST_MEALS}/>);

    expect(wrapper.find('.addOption'), 'add option link not found').to.have.lengthOf(1);
    expect(wrapper.find('.templateSelector'), 'template selector not found').to.have.lengthOf(1);
  });

  it('should not render add option and template selector with preset values without options with signups', () => {
    const TEST_USER = {id: 1, name: 'test'},
        TEST_APP = {dialog: {}},
        TEST_MEALS = [{options: ['', ''], name: 'test', id: 0}, {options: ['', '', '', ''], name: 'test2', id: 1}],
        TEST_MEAL = {
          id: 1,
          name: 'testmeal',
          creator: TEST_USER.name,
          creatorId: TEST_USER.id,
          image: '',
          description: 'testdescription',
          signupLimit: 3,
          signups: [{}],
          deadline: Date.now() + 10000000,
          time: Date.now() + 20000000,
          options: []
        },
        deadline = new Date(TEST_MEAL.deadline),
        time = new Date(TEST_MEAL.time),
        wrapper = shallow(<CreateMealDialog user={TEST_USER} app={TEST_APP} meal={TEST_MEAL} edit={true} meals={TEST_MEALS}/>);

    expect(wrapper.find('.addOption'), 'add option link not found').to.have.lengthOf(0);
    expect(wrapper.find('.templateSelector'), 'template selector not found').to.have.lengthOf(0);
  });
});