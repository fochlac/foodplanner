import { mount, shallow } from 'enzyme'

import React from 'react'
import { replaceLinks } from 'UTILS/markdown.js'

describe('replaceLinks', () => {
  test('should create link elements from markdown links', () => {
    const wrapper = shallow(<div>{replaceLinks('test123 asdas [test123](http://test.de/)')}</div>)
    const link = wrapper.find('a')

    expect(link).toHaveLength(1)
    expect(link.prop('href')).toBe('http://test.de/')
    expect(link.text()).toBe('test123')
  })
  test('should create link elements from markdown links', () => {
    const wrapper = shallow(<div>{replaceLinks('test123 asdas [test123](http://test.de/) [ ()] [test2](test2) )(')}</div>)
    const link = wrapper.find('a')

    expect(link).toHaveLength(2)
    expect(link.at(0).prop('href')).toBe('http://test.de/')
    expect(link.at(0).text()).toBe('test123')
    expect(link.at(1).prop('href')).toBe('test2')
    expect(link.at(1).text()).toBe('test2')
  })
})
