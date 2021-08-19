import {
  minValidator,
  maxValidator,
  negativeValidator,
  positiveValidator,
  integerValidator,
  floatValidator,
  lessThanValidator,
  moreThanValidator,
  bigIntValidator,
  notBigIntValidator
} from './../../src/validators/number';
import { getConfig } from './../../src/config/runtime';

const testData = {
  a: 24,
  b: 24,
  c: 0,
  d: -4,
  e: 1.2456,
  f: 5,
  g: 106
};

describe('number validators', () => {
  const config = getConfig();
  const propertyName = 'a';
  const equalPropertyName = 'b';
  const nullPropertyName = 'c';
  const negativePropertyName = 'd';
  const floatPropertyName = 'e';
  const lessThanPropertyName = 'f';
  const moreThanPropertyName = 'g';

  test('min validator', () => {
    expect(
      jest.fn(() => {
        minValidator({
          property: testData[propertyName],
          threshold: 30,
          config,
          data: testData,
          propertyName
        });
      })
    ).toThrowError();

    expect(
      jest.fn(() => {
        minValidator({
          property: [testData[propertyName]],
          threshold: 30,
          config,
          data: testData,
          propertyName
        });
      })
    ).toThrowError();

    expect(
      jest.fn(() => {
        minValidator({
          property: testData[propertyName],
          threshold: 24,
          config,
          data: testData,
          propertyName
        });
      })
    ).not.toThrowError();

    expect(
      jest.fn(() => {
        minValidator({
          property: undefined,
          threshold: 24,
          config,
          optional: true,
          data: { a: undefined },
          propertyName: 'a'
        });
      })
    ).not.toThrowError();

    expect(
      jest.fn(() => {
        minValidator({
          property: [testData[propertyName]],
          threshold: 24,
          config,
          data: testData,
          propertyName
        });
      })
    ).not.toThrowError();

    expect(
      jest.fn(() => {
        minValidator({
          property: testData[propertyName],
          threshold: 22,
          config,
          data: testData,
          propertyName
        });
      })
    ).not.toThrowError();

    expect(
      jest.fn(() => {
        minValidator({
          property: [testData[propertyName]],
          threshold: 22,
          config,
          data: testData,
          propertyName
        });
      })
    ).not.toThrowError();
  });

  test('max validator', () => {
    expect(
      jest.fn(() => {
        maxValidator({
          property: testData[propertyName],
          threshold: 22,
          config,
          data: testData,
          propertyName
        });
      })
    ).toThrowError();

    expect(
      jest.fn(() => {
        maxValidator({
          property: [testData[propertyName]],
          threshold: 22,
          config,
          data: testData,
          propertyName
        });
      })
    ).toThrowError();

    expect(
      jest.fn(() => {
        maxValidator({
          property: testData[propertyName],
          threshold: 24,
          config,
          data: testData,
          propertyName
        });
      })
    ).not.toThrowError();

    expect(
      jest.fn(() => {
        maxValidator({
          property: undefined,
          threshold: 24,
          config,
          optional: true,
          data: { a: undefined },
          propertyName: 'a'
        });
      })
    ).not.toThrowError();

    expect(
      jest.fn(() => {
        maxValidator({
          property: [testData[propertyName]],
          threshold: 24,
          config,
          data: testData,
          propertyName
        });
      })
    ).not.toThrowError();

    expect(
      jest.fn(() => {
        maxValidator({
          property: testData[propertyName],
          threshold: 25,
          config,
          data: testData,
          propertyName
        });
      })
    ).not.toThrowError();

    expect(
      jest.fn(() => {
        maxValidator({
          property: [testData[propertyName]],
          threshold: 25,
          config,
          data: testData,
          propertyName
        });
      })
    ).not.toThrowError();
  });

  test('negative validator', () => {
    expect(
      jest.fn(() => {
        negativeValidator({
          property: testData[propertyName],
          config,
          data: testData,
          propertyName
        });
      })
    ).toThrowError();

    expect(
      jest.fn(() => {
        negativeValidator({
          property: [testData[propertyName]],
          config,
          data: testData,
          propertyName
        });
      })
    ).toThrowError();

    expect(
      jest.fn(() => {
        negativeValidator({
          property: testData[nullPropertyName],
          config,
          data: testData,
          propertyName: nullPropertyName
        });
      })
    ).toThrowError();

    expect(
      jest.fn(() => {
        negativeValidator({
          property: [testData[nullPropertyName]],
          config,
          data: testData,
          propertyName: nullPropertyName
        });
      })
    ).toThrowError();

    expect(
      jest.fn(() => {
        negativeValidator({
          property: testData[negativePropertyName],
          config,
          data: testData,
          propertyName: negativePropertyName
        });
      })
    ).not.toThrowError();

    expect(
      jest.fn(() => {
        negativeValidator({
          property: undefined,
          optional: true,
          config,
          data: { a: undefined },
          propertyName: 'a'
        });
      })
    ).not.toThrowError();

    expect(
      jest.fn(() => {
        negativeValidator({
          property: [testData[negativePropertyName]],
          config,
          data: testData,
          propertyName: negativePropertyName
        });
      })
    ).not.toThrowError();
  });

  test('positive validator', () => {
    expect(
      jest.fn(() => {
        positiveValidator({
          property: testData[negativePropertyName],
          config,
          data: testData,
          propertyName: negativePropertyName
        });
      })
    ).toThrowError();

    expect(
      jest.fn(() => {
        positiveValidator({
          property: [testData[negativePropertyName]],
          config,
          data: testData,
          propertyName: negativePropertyName
        });
      })
    ).toThrowError();

    expect(
      jest.fn(() => {
        positiveValidator({
          property: testData[nullPropertyName],
          config,
          data: testData,
          propertyName: nullPropertyName
        });
      })
    ).not.toThrowError();

    expect(
      jest.fn(() => {
        positiveValidator({
          property: undefined,
          config,
          optional: true,
          data: { a: undefined },
          propertyName: 'a'
        });
      })
    ).not.toThrowError();

    expect(
      jest.fn(() => {
        positiveValidator({
          property: [testData[nullPropertyName]],
          config,
          data: testData,
          propertyName: nullPropertyName
        });
      })
    ).not.toThrowError();

    expect(
      jest.fn(() => {
        positiveValidator({
          property: testData[propertyName],
          config,
          data: testData,
          propertyName: propertyName
        });
      })
    ).not.toThrowError();

    expect(
      jest.fn(() => {
        positiveValidator({
          property: [testData[propertyName]],
          config,
          data: testData,
          propertyName: propertyName
        });
      })
    ).not.toThrowError();
  });

  test('integer validator', () => {
    expect(
      jest.fn(() => {
        integerValidator({
          property: testData[floatPropertyName],
          config,
          data: testData,
          propertyName: floatPropertyName
        });
      })
    ).toThrowError();

    expect(
      jest.fn(() => {
        integerValidator({
          property: [testData[floatPropertyName]],
          config,
          data: testData,
          propertyName: floatPropertyName
        });
      })
    ).toThrowError();

    expect(
      jest.fn(() => {
        integerValidator({
          property: testData[propertyName],
          config,
          data: testData,
          propertyName
        });
      })
    ).not.toThrowError();

    expect(
      jest.fn(() => {
        integerValidator({
          property: undefined,
          optional: true,
          config,
          data: { a: undefined },
          propertyName: 'a'
        });
      })
    ).not.toThrowError();

    expect(
      jest.fn(() => {
        integerValidator({
          property: [testData[propertyName]],
          config,
          data: testData,
          propertyName
        });
      })
    ).not.toThrowError();
  });

  test('float validator', () => {
    expect(
      jest.fn(() => {
        floatValidator({
          property: testData[propertyName],
          config,
          data: testData,
          propertyName
        });
      })
    ).toThrowError();

    expect(
      jest.fn(() => {
        floatValidator({
          property: [testData[propertyName]],
          config,
          data: testData,
          propertyName
        });
      })
    ).toThrowError();

    expect(
      jest.fn(() => {
        floatValidator({
          property: testData[floatPropertyName],
          config,
          data: testData,
          propertyName: floatPropertyName
        });
      })
    ).not.toThrowError();

    expect(
      jest.fn(() => {
        floatValidator({
          property: undefined,
          optional: true,
          config,
          data: { a: undefined },
          propertyName: 'a'
        });
      })
    ).not.toThrowError();

    expect(
      jest.fn(() => {
        floatValidator({
          property: [testData[floatPropertyName]],
          config,
          data: testData,
          propertyName: floatPropertyName
        });
      })
    ).not.toThrowError();
  });

  test('lessThan validator', () => {
    expect(
      jest.fn(() => {
        lessThanValidator({
          property: testData[propertyName],
          targetPropertyName: lessThanPropertyName,
          config,
          data: testData,
          propertyName
        });
      })
    ).toThrowError();

    expect(
      jest.fn(() => {
        lessThanValidator({
          property: [testData[propertyName]],
          targetPropertyName: lessThanPropertyName,
          config,
          data: testData,
          propertyName
        });
      })
    ).toThrowError();

    expect(
      jest.fn(() => {
        lessThanValidator({
          property: testData[propertyName],
          targetPropertyName: equalPropertyName,
          config,
          data: testData,
          propertyName
        });
      })
    ).toThrowError();

    expect(
      jest.fn(() => {
        lessThanValidator({
          property: [testData[propertyName]],
          targetPropertyName: equalPropertyName,
          config,
          data: testData,
          propertyName
        });
      })
    ).toThrowError();

    expect(
      jest.fn(() => {
        lessThanValidator({
          property: testData[propertyName],
          targetPropertyName: moreThanPropertyName,
          config,
          data: testData,
          propertyName
        });
      })
    ).not.toThrowError();

    expect(
      jest.fn(() => {
        lessThanValidator({
          property: undefined,
          targetPropertyName: 'b',
          allowUndefined: true,
          config,
          data: { a: undefined, b: 5 },
          propertyName: 'a'
        });
      })
    ).not.toThrowError();

    expect(
      jest.fn(() => {
        lessThanValidator({
          property: [testData[propertyName]],
          targetPropertyName: moreThanPropertyName,
          config,
          data: testData,
          propertyName
        });
      })
    ).not.toThrowError();
  });

  test('moreThan validator', () => {
    expect(
      jest.fn(() => {
        moreThanValidator({
          property: testData[propertyName],
          targetPropertyName: moreThanPropertyName,
          config,
          data: testData,
          propertyName
        });
      })
    ).toThrowError();

    expect(
      jest.fn(() => {
        moreThanValidator({
          property: [testData[propertyName]],
          targetPropertyName: moreThanPropertyName,
          config,
          data: testData,
          propertyName
        });
      })
    ).toThrowError();

    expect(
      jest.fn(() => {
        moreThanValidator({
          property: testData[propertyName],
          targetPropertyName: equalPropertyName,
          config,
          data: testData,
          propertyName
        });
      })
    ).toThrowError();

    expect(
      jest.fn(() => {
        moreThanValidator({
          property: testData[propertyName],
          targetPropertyName: lessThanPropertyName,
          config,
          data: testData,
          propertyName
        });
      })
    ).not.toThrowError();

    expect(
      jest.fn(() => {
        moreThanValidator({
          property: [testData[propertyName]],
          targetPropertyName: lessThanPropertyName,
          config,
          data: testData,
          propertyName
        });
      })
    ).not.toThrowError();
  });

  test('bigInt validator', () => {
    expect(
      jest.fn(() => {
        bigIntValidator({
          property: 5,
          config,
          data: { a: 5 },
          propertyName: 'a'
        });
      })
    ).toThrowError();

    expect(
      jest.fn(() => {
        bigIntValidator({
          property: '5',
          config,
          data: { a: '5' },
          propertyName: 'a'
        });
      })
    ).toThrowError();

    expect(
      jest.fn(() => {
        bigIntValidator({
          property: BigInt(5),
          config,
          data: { a: BigInt(5) },
          propertyName: 'a'
        });
      })
    ).not.toThrowError();
  });

  test('notBigInt validator', () => {
    expect(
      jest.fn(() => {
        notBigIntValidator({
          property: BigInt(5),
          config,
          data: { a: BigInt(5) },
          propertyName: 'a'
        });
      })
    ).toThrowError();

    expect(
      jest.fn(() => {
        notBigIntValidator({
          property: '5',
          config,
          data: { a: '5' },
          propertyName: 'a'
        });
      })
    ).not.toThrowError();

    expect(
      jest.fn(() => {
        notBigIntValidator({
          property: 5,
          config,
          data: { a: 5 },
          propertyName: 'a'
        });
      })
    ).not.toThrowError();
  });
});
