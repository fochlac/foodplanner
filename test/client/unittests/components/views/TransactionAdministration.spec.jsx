import { mount, shallow } from 'enzyme'

import Pager from 'RAW/Pager.jsx'
import React from 'react'
import TransactionAdministration from 'PAGES/AdministrationPage/TransactionAdministration.jsx'
import { formatDate } from 'UTILS/date.js'

const testdata = [
  { id: 1, amount: 100, source: 'admin', target: 'testuser2', reason: 'Private Transaction', time: 1522274631808 },
  { id: 2, amount: 100, source: 'admin', target: 'testuser1', reason: 'Private Transaction', time: 1522274633058 },
  { id: 3, amount: 12.1, source: 'admin', target: 'testuser2', reason: 'testmeal', time: 1522274642389 },
  { id: 4, amount: 2.7, source: 'testuser1', target: 'testuser2', reason: 'testmeal', time: 1522274642446 },
]

describe('TransactionAdministration', () => {
  test('should correctly render data', () => {
    const wrapper = shallow(<TransactionAdministration transactions={testdata} />)
    expect(wrapper.find('tr')).toHaveLength(4)
    expect(
      wrapper
        .find('tr')
        .at(0)
        .find('td'),
    ).toHaveLength(5)

    testdata.sort((a, b) => b.time - a.time).forEach((row, index) => {
      expect(
        wrapper
          .find('tr')
          .at(index)
          .find('td')
          .at(0)
          .text(),
      ).toContain(formatDate(row.time))
      expect(
        wrapper
          .find('tr')
          .at(index)
          .find('td')
          .at(1)
          .text(),
      ).toContain(row.reason)
      expect(
        wrapper
          .find('tr')
          .at(index)
          .find('td')
          .at(2)
          .text(),
      ).toContain(row.target)
      expect(
        wrapper
          .find('tr')
          .at(index)
          .find('td')
          .at(3)
          .text(),
      ).toContain(row.source)
      expect(
        wrapper
          .find('tr')
          .at(index)
          .find('td')
          .at(4)
          .text(),
      ).toContain(row.amount)
    })

    const outer = shallow(wrapper.find(Pager).prop('wrapper')())

    expect(outer.find('th')).toHaveLength(5)
  })

  test('should correctly render empty state', () => {
    const wrapper = shallow(<TransactionAdministration />)

    expect(wrapper.find('.emptyMessage')).toHaveLength(1)
  })
})
