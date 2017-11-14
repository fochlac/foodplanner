import { formDataFromObject } from 'UTILS/formData.js'

describe('formDataFromObject', () => {
  test('should create a FormData containing all values of the provided object', () => {
    let obj = {
        test1: 'testa',
        test2: 'testb',
        test3: 'testc',
      },
      formData = formDataFromObject(obj)

    expect(formData.get()).toEqual(obj)
  })
})
