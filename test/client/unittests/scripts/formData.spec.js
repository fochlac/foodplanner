import { formDataFromObject } from 'SCRIPTS/formData.js';
import { expect } from 'chai';


describe('formDataFromObject', () => {
  it('should create a FormData containing all values of the provided object', () => {
    let obj = {
          test1: 'testa',
          test2: 'testb',
          test3: 'testc'
        },
        formData = formDataFromObject(obj);

    expect(formData.get()).to.deep.equal(obj);
  });
});