import { mount, shallow } from 'enzyme'

import React from 'react'
import sinon from 'sinon'
import LandingPage from 'PAGES/LandingPage/LandingPage.jsx'
import AddressBlock from 'RAW/AddressBlock.jsx'
import InputRow from 'RAW/InputRow.jsx'

const defaultInstance = {
  subdomain: 'testdomain',
  root: 'testroot',
  id: 1,
  icon: 'fa-test',
  title: 'testtitle',
}

const defaultApp = {
  subdomain: undefined,
  hiddenBusy: false,
  busyList: [],
}

function createShallow({
  user = { id: 1, instance: 1 },
  app = defaultApp,
  instance = defaultInstance,
  sign_out = sinon.spy(),
  start_sign_in = sinon.spy(),
  checkDomain = sinon.spy(),
  createInstance = sinon.spy(),
}) {
  const props = { user, sign_out, instance, start_sign_in, checkDomain, createInstance, app }

  return { component: shallow(<LandingPage {...props} />), props }
}

describe('LandingPage', () => {
  test('should render get domain view if uses proxy', () => {
    const { component, props } = createShallow({ instance: { ...defaultInstance, usesProxy: true } })

    expect(component.find('.domainFinder')).toHaveLength(1)
    expect(component.find('.fa-spin.fa-spinner')).toHaveLength(0)
    expect(component.find('.domainFinder button')).toHaveLength(1)
    expect(component.find('.domainFinder button').prop('disabled')).toBeTruthy()
  })

  test('should render busy for domain view if checking for domain', () => {
    const { component, props } = createShallow({ instance: { ...defaultInstance, usesProxy: true }, app: { hiddenBusy: true, busyList: ['domainCheck'] } })

    expect(component.find('.fa-spin.fa-spinner')).toHaveLength(1)
  })

  test('should render sign out if user', () => {
    const { component, props } = createShallow({})

    expect(component.find('.fa-sign-out')).toHaveLength(1)
  })

  test('should render sign in if no user', () => {
    const { component, props } = createShallow({ user: {} })

    expect(component.find('.fa-sign-out')).toHaveLength(0)
    expect(component.find('.fa-sign-in')).toHaveLength(1)
  })

  test('should call correct actions on domain input change', () => {
    const { component, props } = createShallow({ instance: { ...defaultInstance, usesProxy: true } })

    sinon.stub(window, 'setTimeout').callsArg(0)
    sinon.stub(window, 'clearTimeout')

    expect(component.find('.domainInput input')).toHaveLength(1)
    component.find('.domainInput input').simulate('change', { target: { value: 'test.*`123' } })

    expect(window.clearTimeout.calledOnce).toBeTruthy()
    expect(props.checkDomain.notCalled).toBeTruthy()


    component.find('.domainInput input').simulate('change', { target: { value: 'test123' } })

    expect(window.clearTimeout.calledTwice).toBeTruthy()
    expect(window.setTimeout.calledOnce).toBeTruthy()
    expect(props.checkDomain.calledOnce).toBeTruthy()

    component.setProps({ app: { ...defaultApp, subdomain: { isValid: true, name: 'test123' } } })
    component.update()

    expect(component.find('.domainFinder button').prop('disabled')).toBeFalsy()

    component.find('.domainFinder button').simulate('click')
    expect(component.find('.domainFinder')).toHaveLength(0)
    expect(component.find('button')).toHaveLength(2)
    expect(component.find(InputRow)).toHaveLength(5)

    component.find('.cancel').simulate('click')
    expect(component.find('.domainFinder')).toHaveLength(1)
  })

  test('should display register page without proxy', () => {
    const { component, props } = createShallow({})

    expect(component.find(InputRow)).toHaveLength(6)
    expect(component.find(AddressBlock)).toHaveLength(1)
    expect(component.find('button')).toHaveLength(1)
    expect(component.find('button').prop('disabled')).toBeTruthy()
    expect(component.find('.domainFinder')).toHaveLength(0)
  })

  test('should handle input data', () => {
    const { component, props } = createShallow({})
    component.find('button').simulate('click')
    expect(props.createInstance.notCalled).toBeTruthy()

    component.find(InputRow).forEach(input => input.prop('onChange')(input.prop('autoComplete') === 'email' ? 'test@test.de' : 'test123', true))
    component.find(AddressBlock).prop('onChange')('{"test": "test123"}', true)

    component.update()

    expect(component.find('button').prop('disabled')).toBeFalsy()

    window.crypto = {
      subtle: {
        importKey: () => ({
          then: () => ({
            then: () => ({
              then: () => ({
                then: cb => {
                  cb('ALeLYLKK1Wtl/1TQlW/oEA')
                  return { catch: () => null }
                },
              }),
            }),
          }),
        }),
      },
    }
    window.TextEncoder = function() {
      return { encode: () => null }
    }

    component.find('button').simulate('click')

    expect(props.createInstance.calledOnce).toBeTruthy()

    expect(props.createInstance.lastCall.args[0]).toMatchObject({
      name: 'test123',
      mail: 'test@test.de',
      hash: 'ALeLYLKK1Wtl/1TQlW/oEA',
      subdomain: 'test123',
      company: 'test123',
      address: '"{\\"test\\": \\"test123\\"}"',
    })
  })
})
