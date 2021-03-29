import {
  GeneratedValidation,
  GeneratedValidationPayload,
  UserContext,
  initConfig,
  getConfig,
  mergeDeep,
  typeValidator,
  minLengthValidator,
  maxLengthValidator,
  minValidator,
  maxValidator,
  integerValidator,
  lessThanValidator
} from 'ts-generate-validator';

import { userValidator } from './nestedModel.model';

import { Dog } from './../../model';

import * as configFromFile from './../../ts-generate-validator-config.json';

initConfig(configFromFile);

export const dogValidator: GeneratedValidation = (payload: GeneratedValidationPayload<typeof Dog, UserContext>) => {
  const config = mergeDeep({}, getConfig(), payload.config);

  typeValidator({
    property: payload.data.name,
    propertyName: 'name',
    data: payload.data,
    config,

    type: 'string'
  });

  minLengthValidator({
    property: payload.data.name,
    propertyName: 'name',
    data: payload.data,
    config,

    threshold: 5
  });

  maxLengthValidator({
    property: payload.data.name,
    propertyName: 'name',
    data: payload.data,
    config,

    threshold: 20
  });

  typeValidator({
    property: payload.data.age,
    propertyName: 'age',
    data: payload.data,
    config,

    type: 'number'
  });

  minValidator({
    property: payload.data.age,
    propertyName: 'age',
    data: payload.data,
    config,

    threshold: 2,

    customMessage: 'only dogs over 2 years old are accepted'
  });

  maxValidator({
    property: payload.data.age,
    propertyName: 'age',
    data: payload.data,
    config,

    threshold: 16,

    customMessage: "dogs can't live that long"
  });

  integerValidator({
    property: payload.data.age,
    propertyName: 'age',
    data: payload.data,
    config,

    customMessage: 'age must be an integer value'
  });

  typeValidator({
    property: payload.data.ownedYears,
    propertyName: 'ownedYears',
    data: payload.data,
    config,

    type: 'number'
  });

  lessThanValidator({
    property: payload.data.ownedYears,
    propertyName: 'ownedYears',
    data: payload.data,
    config,

    targetPropertyName: 'age',

    customMessage: "dog can't be owned by anyone longer than his age"
  });

  typeValidator({
    property: payload.data.owner,
    propertyName: 'owner',
    data: payload.data,
    config,

    typeDescription: userValidator,

    type: 'nested'
  });
};
