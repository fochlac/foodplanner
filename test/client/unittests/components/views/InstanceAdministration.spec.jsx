import { mount, shallow } from 'enzyme'

import React from 'react'
import sinon from 'sinon'
import InstanceAdministration from 'PAGES/AdministrationPage/InstanceAdministration.jsx'
import AddressBlock from 'RAW/AddressBlock.jsx'
import InputRow from 'RAW/InputRow.jsx'


const instance = {
  id: 2,
  address:
    '{"street":"asdas","number":"1","postal":"1231","city":"asdasd","country":"asdasds"}"}},"actionId":4,"timeDiff":-16792,"data":{"id":1,"name":"testname","company":"testcompany","subdomain":"testsubdomain","address":"{"street":"asdas","number":"1","postal":"1231","city":"asdasd","country":"asdasds"}',
  name: 'testname',
  company: 'testcompany',
}

const saveInstanceData= sinon.spy()

describe('TransactionAdministration', () => {
  test('should correctly render data', () => {
    const wrapper = shallow(<InstanceAdministration instance={instance} saveInstanceData={saveInstanceData} />)

    wrapper.find(InputRow).at(0).prop('onBlur')('change1', true)

    expect(saveInstanceData.lastCall.calledWith(2, { name: 'change1' })).toBeTruthy()

    wrapper.find(InputRow).at(1).prop('onBlur')('change2', true)

    expect(saveInstanceData.lastCall.calledWith(2, { company: 'change2' })).toBeTruthy()

    wrapper
      .find(AddressBlock)
      .prop('onBlur')({test: 'test'}, true)

    expect(saveInstanceData.lastCall.calledWith(2, { address: '{"test":"test"}' })).toBeTruthy()
  })
})
