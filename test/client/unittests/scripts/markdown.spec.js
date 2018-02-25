import { replaceLinks } from 'UTILS/markdown.js'
import React from 'react';
import { shallow, mount } from 'enzyme';

describe('replaceLinks', () => {
  test('should create link elements from markdown links', () => {
    const wrapper = shallow(<div>{replaceLinks('test123 asdas [test123](http://test.de/)')}</div>)
    const link = wrapper.find('a')

    expect(link).toHaveLength(1)
    expect(link.prop('href')).toBe('http://test.de/')
    expect(link.text()).toBe('test123')
  })
})
