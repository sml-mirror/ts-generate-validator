import { equalValidator, equalToValidator } from './../../src/validators/common';
import { typeValidator, ValidationType } from '../../src';
import { getConfig } from './../../src/config/runtime';

const testData = {
  a: 24,
  b: 'test',
  c: undefined,
  d: null,
  e: 24,
  f: 5,
  g: {
    a: 1,
    b: 2
  }
};

describe('common validators', () => {
  const config = getConfig();
  const propertyName = 'a';
  const equalPropertyName = 'e';
  const notEqualPropertyName = 'b';

  test('type validator', () => {
    expect(
      jest.fn(() => {
        typeValidator({
          property: testData[propertyName],
          type: ValidationType.unknown,
          config,
          data: testData,
          propertyName
        });
      })
    ).toThrowError();

    expect(
      jest.fn(() => {
        typeValidator({
          property: testData[propertyName],
          type: ValidationType.string,
          config,
          data: testData,
          propertyName
        });
      })
    ).toThrowError();

    expect(
      jest.fn(() => {
        typeValidator({
          property: testData[propertyName],
          type: ValidationType.number,
          config,
          data: testData,
          propertyName
        });
        return true;
      })
    ).not.toThrowError();
  });

  test('equal validator', () => {
    expect(
      jest.fn(() => {
        equalValidator({
          property: testData[propertyName],
          value: testData[notEqualPropertyName],
          config,
          data: testData,
          propertyName
        });
      })
    ).toThrowError();

    expect(
      jest.fn(() => {
        equalValidator({
          property: testData[propertyName],
          value: testData[propertyName],
          config,
          data: testData,
          propertyName
        });
        return true;
      })
    ).not.toThrowError();
  });

  test('equalTo validator', () => {
    expect(
      jest.fn(() => {
        equalToValidator({
          property: testData[propertyName],
          targetPropertyName: notEqualPropertyName,
          config,
          data: testData,
          propertyName
        });
      })
    ).toThrowError();

    expect(
      jest.fn(() => {
        equalToValidator({
          property: testData[propertyName],
          targetPropertyName: equalPropertyName,
          config,
          data: testData,
          propertyName
        });
        return true;
      })
    ).not.toThrowError();
  });
});
