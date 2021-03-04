import {
  trimValidator,
  lowercaseValidator,
  uppercaseValidator,
  minLengthValidator,
  maxLengthValidator,
  emailValidator,
  urlValidator,
  matchValidator
} from './../../src/validators/string';
import { getConfig } from './../../src/config/runtime';

const testData = {
  a: 'a',
  b: 'abc',
  c: 'abc',
  d: 'ab cdef',
  e: 'john@gmail.com',
  f: '//www.github.com/',
  g: 'https://www.github.com/'
};

describe('string validators', () => {
  const config = getConfig();
  const propertyName = 'a';

  test('trim validator', () => {
    expect(
      jest.fn(() => {
        trimValidator({
          property: ' lorem ipsum',
          config,
          data: testData,
          propertyName
        });
      })
    ).toThrowError();

    expect(
      jest.fn(() => {
        trimValidator({
          property: 'lorem ipsum ',
          config,
          data: testData,
          propertyName
        });
      })
    ).toThrowError();

    expect(
      jest.fn(() => {
        trimValidator({
          property: 'lorem ipsum',
          config,
          data: testData,
          propertyName
        });
      })
    ).not.toThrowError();
  });

  test('lowercase validator', () => {
    expect(
      jest.fn(() => {
        lowercaseValidator({
          property: 'LOREM IPSUM',
          config,
          data: testData,
          propertyName
        });
      })
    ).toThrowError();

    expect(
      jest.fn(() => {
        lowercaseValidator({
          property: 'loRem ipsUm',
          config,
          data: testData,
          propertyName
        });
      })
    ).toThrowError();

    expect(
      jest.fn(() => {
        lowercaseValidator({
          property: 'lorem ipsum',
          config,
          data: testData,
          propertyName
        });
      })
    ).not.toThrowError();
  });

  test('upercase validator', () => {
    expect(
      jest.fn(() => {
        uppercaseValidator({
          property: 'lorem ipsum',
          config,
          data: testData,
          propertyName
        });
      })
    ).toThrowError();

    expect(
      jest.fn(() => {
        uppercaseValidator({
          property: 'LorEm ipsuM',
          config,
          data: testData,
          propertyName
        });
      })
    ).toThrowError();

    expect(
      jest.fn(() => {
        uppercaseValidator({
          property: 'LOREM IPSUM',
          config,
          data: testData,
          propertyName
        });
      })
    ).not.toThrowError();
  });

  test('minLength validator', () => {
    expect(
      jest.fn(() => {
        minLengthValidator({
          property: 'lorem',
          threshold: 10,
          config,
          data: testData,
          propertyName
        });
      })
    ).toThrowError();

    expect(
      jest.fn(() => {
        minLengthValidator({
          property: 'lorem ipsum',
          threshold: 11,
          config,
          data: testData,
          propertyName
        });
      })
    ).not.toThrowError();

    expect(
      jest.fn(() => {
        minLengthValidator({
          property: 'lorem ipsum',
          threshold: 6,
          config,
          data: testData,
          propertyName
        });
      })
    ).not.toThrowError();
  });

  test('maxLength validator', () => {
    expect(
      jest.fn(() => {
        maxLengthValidator({
          property: 'lorem',
          threshold: 4,
          config,
          data: testData,
          propertyName
        });
      })
    ).toThrowError();

    expect(
      jest.fn(() => {
        maxLengthValidator({
          property: 'lorem ipsum',
          threshold: 11,
          config,
          data: testData,
          propertyName
        });
      })
    ).not.toThrowError();

    expect(
      jest.fn(() => {
        maxLengthValidator({
          property: 'lorem ipsum',
          threshold: 16,
          config,
          data: testData,
          propertyName
        });
      })
    ).not.toThrowError();
  });

  test('email validator', () => {
    expect(
      jest.fn(() => {
        emailValidator({
          property: 'lorem',
          config,
          data: testData,
          propertyName
        });
      })
    ).toThrowError();

    expect(
      jest.fn(() => {
        emailValidator({
          property: 'lorem@dawdaw',
          config,
          data: testData,
          propertyName
        });
      })
    ).toThrowError();

    expect(
      jest.fn(() => {
        emailValidator({
          property: 'john@gmail.com',
          config,
          data: testData,
          propertyName
        });
      })
    ).not.toThrowError();
  });

  test('url validator', () => {
    expect(
      jest.fn(() => {
        urlValidator({
          property: 'lorem',
          config,
          data: testData,
          propertyName
        });
      })
    ).toThrowError();

    expect(
      jest.fn(() => {
        urlValidator({
          property: 'example.ru',
          config,
          data: testData,
          propertyName
        });
      })
    ).toThrowError();

    expect(
      jest.fn(() => {
        urlValidator({
          property: 'https://google.com',
          config,
          data: testData,
          propertyName
        });
      })
    ).not.toThrowError();

    expect(
      jest.fn(() => {
        urlValidator({
          property: '//www.github.com/',
          config,
          data: testData,
          propertyName
        });
      })
    ).not.toThrowError();
  });

  test('match validator', () => {
    expect(
      jest.fn(() => {
        matchValidator({
          property: 'lorem',
          regexp: /^lorem ipsum$/,
          config,
          data: testData,
          propertyName
        });
      })
    ).toThrowError();

    expect(
      jest.fn(() => {
        matchValidator({
          property: 'lorem ipsum',
          regexp: /^lorem ipsum$/,
          config,
          data: testData,
          propertyName
        });
      })
    ).not.toThrowError();
  });
});
