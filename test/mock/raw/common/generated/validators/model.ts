import {
  GeneratedValidation,
  GeneratedValidationPayload,
  UserContext,
  getConfig,
  mergeDeep,
  typeValidator,
  customValidator,
  equalValidator,
  equalToValidator
} from 'ts-generate-validator';

import {
  TypeValidatorWithCustomMessage,
  TypeValidatorOnWrongPropertyType,
  CustomValidatorFailed,
  CutomValidatorSuccess,
  CutomValidatorSuccessAsync,
  IgnoreValidationForNonPrimitiveProperty,
  IgnoreValidationForPrimitiveProperty,
  IgnoreValidationForPrimitivePropertyWithOtherDecorators,
  EqualValidatorWithDefaultMessage,
  EqualValidatorWithCustomMessage,
  EqualValidatorForBoolean,
  EqualToValidatorWithDefaultMessage
} from '../../model';

export const typeValidatorWithCustomMessageValidator: GeneratedValidation = (
  payload: GeneratedValidationPayload<typeof TypeValidatorWithCustomMessage, UserContext>
) => {
  const config = mergeDeep({}, getConfig(), payload.config);

  typeValidator({
    property: payload.data.someProperty,
    propertyName: 'someProperty',
    data: payload.data,
    config,

    customMessage: 'type custom message'
  });
};

export const typeValidatorOnWrongPropertyTypeValidator: GeneratedValidation = (
  payload: GeneratedValidationPayload<typeof TypeValidatorOnWrongPropertyType, UserContext>
) => {
  // eslint-disable-next-line
  const config = mergeDeep({}, getConfig(), payload.config);
};

export const customValidatorFailedValidator: GeneratedValidation = (
  payload: GeneratedValidationPayload<typeof CustomValidatorFailed, UserContext>
) => {
  const config = mergeDeep({}, getConfig(), payload.config);

  typeValidator({
    property: payload.data.someProperty,
    propertyName: 'someProperty',
    data: payload.data,
    config
  });

  customValidator({
    property: payload.data.someProperty,
    propertyName: 'someProperty',
    data: payload.data,
    config,

    customValidationFunction: () => {
      throw new Error('Failed!');
    }
  });
};

export const cutomValidatorSuccessValidator: GeneratedValidation = (
  payload: GeneratedValidationPayload<typeof CutomValidatorSuccess, UserContext>
) => {
  const config = mergeDeep({}, getConfig(), payload.config);

  typeValidator({
    property: payload.data.someProperty,
    propertyName: 'someProperty',
    data: payload.data,
    config
  });

  customValidator({
    property: payload.data.someProperty,
    propertyName: 'someProperty',
    data: payload.data,
    config,

    customValidationFunction: () => undefined
  });
};

export const cutomValidatorSuccessAsyncValidator: GeneratedValidation = async (
  payload: GeneratedValidationPayload<typeof CutomValidatorSuccessAsync, UserContext>
) => {
  const config = mergeDeep({}, getConfig(), payload.config);

  typeValidator({
    property: payload.data.someProperty,
    propertyName: 'someProperty',
    data: payload.data,
    config
  });

  customValidator({
    property: payload.data.someProperty,
    propertyName: 'someProperty',
    data: payload.data,
    config,

    customValidationFunction: async (): Promise<void> => new Promise((resolve) => setTimeout(() => resolve(), 300))
  });
};

export const ignoreValidationForNonPrimitivePropertyValidator: GeneratedValidation = (
  payload: GeneratedValidationPayload<typeof IgnoreValidationForNonPrimitiveProperty, UserContext>
) => {
  // eslint-disable-next-line
  const config = mergeDeep({}, getConfig(), payload.config);
};

export const ignoreValidationForPrimitivePropertyValidator: GeneratedValidation = (
  payload: GeneratedValidationPayload<typeof IgnoreValidationForPrimitiveProperty, UserContext>
) => {
  // eslint-disable-next-line
  const config = mergeDeep({}, getConfig(), payload.config);
};

export const ignoreValidationForPrimitivePropertyWithOtherDecoratorsValidator: GeneratedValidation = (
  payload: GeneratedValidationPayload<typeof IgnoreValidationForPrimitivePropertyWithOtherDecorators, UserContext>
) => {
  // eslint-disable-next-line
  const config = mergeDeep({}, getConfig(), payload.config);
};

export const equalValidatorWithDefaultMessageValidator: GeneratedValidation = (
  payload: GeneratedValidationPayload<typeof EqualValidatorWithDefaultMessage, UserContext>
) => {
  const config = mergeDeep({}, getConfig(), payload.config);

  typeValidator({
    property: payload.data.someProperty,
    propertyName: 'someProperty',
    data: payload.data,
    config
  });

  equalValidator({
    property: payload.data.someProperty,
    propertyName: 'someProperty',
    data: payload.data,
    config,

    value: 'abcdef'
  });
};

export const equalValidatorWithCustomMessageValidator: GeneratedValidation = (
  payload: GeneratedValidationPayload<typeof EqualValidatorWithCustomMessage, UserContext>
) => {
  const config = mergeDeep({}, getConfig(), payload.config);

  typeValidator({
    property: payload.data.someProperty,
    propertyName: 'someProperty',
    data: payload.data,
    config
  });

  equalValidator({
    property: payload.data.someProperty,
    propertyName: 'someProperty',
    data: payload.data,
    config,

    value: 245,

    customMessage: 'equal custom message'
  });
};

export const equalValidatorForBooleanValidator: GeneratedValidation = (
  payload: GeneratedValidationPayload<typeof EqualValidatorForBoolean, UserContext>
) => {
  const config = mergeDeep({}, getConfig(), payload.config);

  typeValidator({
    property: payload.data.someProperty,
    propertyName: 'someProperty',
    data: payload.data,
    config
  });

  equalValidator({
    property: payload.data.someProperty,
    propertyName: 'someProperty',
    data: payload.data,
    config,

    value: true
  });
};

export const equalToValidatorWithDefaultMessageValidator: GeneratedValidation = (
  payload: GeneratedValidationPayload<typeof EqualToValidatorWithDefaultMessage, UserContext>
) => {
  const config = mergeDeep({}, getConfig(), payload.config);

  typeValidator({
    property: payload.data.someProperty,
    propertyName: 'someProperty',
    data: payload.data,
    config
  });

  equalToValidator({
    property: payload.data.someProperty,
    propertyName: 'someProperty',
    data: payload.data,
    config,

    targetPropertyName: 'someOtherProperty'
  });

  typeValidator({
    property: payload.data.someOtherProperty,
    propertyName: 'someOtherProperty',
    data: payload.data,
    config
  });

  equalToValidator({
    property: payload.data.someOtherProperty,
    propertyName: 'someOtherProperty',
    data: payload.data,
    config,

    targetPropertyName: 'someProperty'
  });
};
