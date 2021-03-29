import {
  GeneratedValidation,
  GeneratedValidationPayload,
  UserContext,
  initConfig,
  getConfig,
  mergeDeep,
  typeValidator
} from 'ts-generate-validator';

import { User } from './../../nestedModel/model';

import * as configFromFile from './../../ts-generate-validator-config.json';

initConfig(configFromFile);

export const userValidator: GeneratedValidation = (payload: GeneratedValidationPayload<typeof User, UserContext>) => {
  const config = mergeDeep({}, getConfig(), payload.config);

  typeValidator({
    property: payload.data.name,
    propertyName: 'name',
    data: payload.data,
    config,

    type: 'string'
  });

  typeValidator({
    property: payload.data.surname,
    propertyName: 'surname',
    data: payload.data,
    config,

    type: 'string'
  });
};
