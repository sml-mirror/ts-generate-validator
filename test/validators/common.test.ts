import { ValidationError, ValidationException } from './../../src/codegen/utils/error';
import { equalValidator, equalToValidator } from './../../src/validators/common';
import { requiredOneOfValidator, typeValidator, ValidationType } from '../../src';
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
  const nullPropertyName = 'd';
  const equalPropertyName = 'e';
  const notEqualPropertyName = 'b';

  // requiredOneOfValidator
  test('requiredOneOfValidator validator', () => {
    expect(
      jest.fn(() => {
        requiredOneOfValidator({
          property: testData.c,
          fields: ['c', 'd', 'm', 'l', 'z'],
          config,
          data: testData,
          propertyName
        });
      })
    ).toThrowError();

    expect(
      jest.fn(() => {
        requiredOneOfValidator({
          property: testData.c,
          fields: ['c', 'c', 'd', 'd'],
          config,
          data: testData,
          propertyName
        });
      })
    ).toThrowError();

    expect(
      jest.fn(() => {
        requiredOneOfValidator({
          property: testData.a,
          fields: ['a', 'b', 'e'],
          config,
          data: testData,
          propertyName
        });
      })
    ).not.toThrowError();
  });

  test('type validator', () => {
    expect(
      jest.fn(() => {
        typeValidator({
          property: testData[nullPropertyName],
          type: ValidationType.null,
          config,
          data: testData,
          propertyName: nullPropertyName
        });
      })
    ).not.toThrowError();

    expect(
      jest.fn(() => {
        typeValidator({
          property: testData[propertyName],
          type: ValidationType.null,
          config,
          data: testData,
          propertyName: propertyName
        });
      })
    ).toThrowError();

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

    expect(
      jest.fn(() => {
        typeValidator({
          property: ['a', 'b', 'c'],
          type: ValidationType.array,
          typeDescription: {
            type: ValidationType.number
          },
          config,
          data: { test: ['a', 'b', 'c'] },
          propertyName: 'test'
        });
      })
    ).toThrowError();

    expect(
      jest.fn(() => {
        typeValidator({
          property: ['a', 'b', 'c'],
          type: ValidationType.array,
          typeDescription: {
            type: ValidationType.string
          },
          config,
          data: { test: ['a', 'b', 'c'] },
          propertyName: 'test'
        });
      })
    ).not.toThrowError();

    expect(
      jest.fn(() => {
        typeValidator({
          property: 'a',
          type: ValidationType.union,
          typeDescription: [
            {
              type: ValidationType.boolean
            },
            {
              type: ValidationType.number
            }
          ],
          config,
          data: { test: 'a' },
          propertyName: 'test'
        });
      })
    ).toThrowError();

    expect(
      jest.fn(() => {
        typeValidator({
          property: 5,
          type: ValidationType.union,
          typeDescription: [
            {
              type: ValidationType.string
            },
            {
              type: ValidationType.number
            }
          ],
          config,
          data: { test: 5 },
          propertyName: 'test'
        });
      })
    ).not.toThrowError();

    // Validation error at union type containing one complex
    // type must return details instead of common message
    expect(
      jest.fn(() => {
        typeValidator({
          property: null,
          type: ValidationType.union,
          typeDescription: [
            {
              type: ValidationType.string
            },
            {
              type: ValidationType.number
            },
            {
              type: ValidationType.nested,
              typeDescription: () => {
                throw new ValidationException([
                  new ValidationError('test1', 'test'),
                  new ValidationError('test2', 'test')
                ]);
              }
            }
          ],
          config,
          data: { test: null },
          propertyName: 'test'
        });
      })
    ).toThrowError(
      new ValidationException([new ValidationError('test1', 'test'), new ValidationError('test2', 'test')])
    );
    expect(
      jest.fn(() => {
        typeValidator({
          property: [null],
          type: ValidationType.union,
          typeDescription: [
            {
              type: ValidationType.string
            },
            {
              type: ValidationType.number
            },
            {
              type: ValidationType.array,
              typeDescription: {
                type: ValidationType.nested,
                typeDescription: () => {
                  throw new ValidationException([
                    new ValidationError('test1', 'test'),
                    new ValidationError('test2', 'test')
                  ]);
                }
              }
            }
          ],
          config,
          data: { testComplexArrayInsideUnion: [null] },
          propertyName: 'testComplexArrayInsideUnion'
        });
      })
    ).toThrowError(
      new ValidationException([new ValidationError('test1', 'test'), new ValidationError('test2', 'test')])
    );
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
          property: [testData[propertyName]],
          value: [testData[notEqualPropertyName]],
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

    expect(
      jest.fn(() => {
        equalValidator({
          property: undefined,
          value: 25,
          config,
          optional: true,
          data: { a: undefined },
          propertyName: 'a'
        });
        return true;
      })
    ).not.toThrowError();

    expect(
      jest.fn(() => {
        equalValidator({
          property: [testData[propertyName]],
          value: [testData[propertyName]],
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
          property: [24],
          targetPropertyName: 'abc',
          config,
          data: { abc: ['24'] },
          propertyName
        });
      })
    ).toThrowError();

    expect(
      jest.fn(() => {
        equalToValidator({
          property: undefined,
          targetPropertyName: 'abc',
          config,
          optional: true,
          data: { a: undefined, abc: 25 },
          propertyName: 'a'
        });
      })
    ).toThrowError();

    expect(
      jest.fn(() => {
        equalToValidator({
          property: undefined,
          targetPropertyName: 'abc',
          config,
          allowUndefined: true,
          data: { a: undefined, abc: 25 },
          propertyName: 'a'
        });
      })
    ).not.toThrowError();

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

    expect(
      jest.fn(() => {
        equalToValidator({
          property: [24],
          targetPropertyName: 'abc',
          config,
          data: { abc: [24] },
          propertyName
        });
      })
    ).not.toThrowError();
  });
});
