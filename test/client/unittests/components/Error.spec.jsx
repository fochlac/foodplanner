import React from 'react';
import { shallow, mount } from 'enzyme';
import Error from 'UI/Error/Error.jsx';

const ERROR_MESSAGE = 'testmessage';
let delete_error_called = false;

describe('Error', () => {
  test(
    'should render an element with an error message and call delete function on click to close button',
    () => {
      const wrapper = shallow(<Error error={ERROR_MESSAGE} delete_error={() => delete_error_called = true} />),
          message = wrapper.find('p'),
          close = wrapper.find('span.fa-times');

      expect(message.length).toBe(1);
      expect(close.length).toBe(1);

      close.simulate('click');

      expect(message.text()).toBe(ERROR_MESSAGE);
      expect(delete_error_called).toBe(true);
    }
  );
});