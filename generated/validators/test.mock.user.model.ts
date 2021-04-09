/* This file was automatically generated and should not be edited */
// tslint:disable
/* eslint-disable */

import {
  GeneratedValidation,
  ValidationConfig,
  ValidationError,
  ValidationException,
  Data,
  UserContext,
  getConfig,
  mergeDeep,
  requiredOneOfValidator,
  typeValidator,
  minLengthValidator,
  maxLengthValidator,
  trimValidator,
  minValidator,
  maxValidator,
  integerValidator,
  lessThanValidator,
  positiveValidator,
  equalValidator,
  emailValidator,
  matchValidator,
  urlValidator,
  lowercaseValidator,
  uppercaseValidator,
  floatValidator
} from 'ts-generate-validator';

import { User } from './../../test/mock/user/model';

export const userValidator: GeneratedValidation = <D extends Data = typeof User, C extends UserContext = UserContext>(
  data: D,
  configArg?: ValidationConfig,
  context?: C
) => {
  const config = <ValidationConfig>mergeDeep({}, getConfig(), configArg ?? {});
  const errors: ValidationError[] = [];

  try {
    requiredOneOfValidator({
      property: data?.email,
      propertyName: 'email',
      data,
      config,
      context,

      fields: ['email', 'phone']
    });

    typeValidator({
      property: data?.name,
      propertyName: 'name',
      data,
      config,
      context,

      type: 'string'
    });

    minLengthValidator({
      property: data?.name,
      propertyName: 'name',
      data,
      config,
      context,

      threshold: 2
    });

    maxLengthValidator({
      property: data?.name,
      propertyName: 'name',
      data,
      config,
      context,

      threshold: 50
    });

    trimValidator({
      property: data?.name,
      propertyName: 'name',
      data,
      config,
      context
    });

    typeValidator({
      property: data?.surname,
      propertyName: 'surname',
      data,
      config,
      context,

      type: 'string'
    });

    minLengthValidator({
      property: data?.surname,
      propertyName: 'surname',
      data,
      config,
      context,

      threshold: 2,

      customMessage: 'surname length must be more then 2 letters'
    });

    maxLengthValidator({
      property: data?.surname,
      propertyName: 'surname',
      data,
      config,
      context,

      threshold: 50,

      customMessage: 'surname length must be less then 50 letters'
    });

    trimValidator({
      property: data?.surname,
      propertyName: 'surname',
      data,
      config,
      context,

      customMessage: 'there should be no spaces at the beginning and at the end of surname'
    });

    typeValidator({
      property: data?.age,
      propertyName: 'age',
      data,
      config,
      context,

      type: 'number'
    });

    minValidator({
      property: data?.age,
      propertyName: 'age',
      data,
      config,
      context,

      threshold: 18
    });

    maxValidator({
      property: data?.age,
      propertyName: 'age',
      data,
      config,
      context,

      threshold: 60
    });

    integerValidator({
      property: data?.age,
      propertyName: 'age',
      data,
      config,
      context
    });

    typeValidator({
      property: data?.workExperience,
      propertyName: 'workExperience',
      data,
      config,
      context,

      type: 'number'
    });

    lessThanValidator({
      property: data?.workExperience,
      propertyName: 'workExperience',
      data,
      config,
      context,

      targetPropertyName: 'age'
    });

    positiveValidator({
      property: data?.workExperience,
      propertyName: 'workExperience',
      data,
      config,
      context
    });

    typeValidator({
      property: data?.isActive,
      propertyName: 'isActive',
      data,
      config,
      context,

      type: 'boolean'
    });

    equalValidator({
      property: data?.isActive,
      propertyName: 'isActive',
      data,
      config,
      context,

      value: true
    });

    typeValidator({
      property: data?.email,
      propertyName: 'email',
      data,
      config,
      context,

      type: 'string'
    });

    emailValidator({
      property: data?.email,
      propertyName: 'email',
      data,
      config,
      context
    });

    typeValidator({
      property: data?.phone,
      propertyName: 'phone',
      data,
      config,
      context,

      type: 'string'
    });

    matchValidator({
      property: data?.phone,
      propertyName: 'phone',
      data,
      config,
      context,

      regexp: /^\d{10}$/
    });

    typeValidator({
      property: data?.website,
      propertyName: 'website',
      data,
      config,
      context,

      type: 'string'
    });

    urlValidator({
      property: data?.website,
      propertyName: 'website',
      data,
      config,
      context
    });

    typeValidator({
      property: data?.nickname,
      propertyName: 'nickname',
      data,
      config,
      context,

      type: 'string'
    });

    lowercaseValidator({
      property: data?.nickname,
      propertyName: 'nickname',
      data,
      config,
      context
    });

    minLengthValidator({
      property: data?.nickname,
      propertyName: 'nickname',
      data,
      config,
      context,

      threshold: 5
    });

    maxLengthValidator({
      property: data?.nickname,
      propertyName: 'nickname',
      data,
      config,
      context,

      threshold: 20
    });

    typeValidator({
      property: data?.cardHolderName,
      propertyName: 'cardHolderName',
      data,
      config,
      context,

      type: 'string'
    });

    uppercaseValidator({
      property: data?.cardHolderName,
      propertyName: 'cardHolderName',
      data,
      config,
      context
    });

    typeValidator({
      property: data?.insuranceRatio,
      propertyName: 'insuranceRatio',
      data,
      config,
      context,

      type: 'number'
    });

    floatValidator({
      property: data?.insuranceRatio,
      propertyName: 'insuranceRatio',
      data,
      config,
      context
    });
  } catch (err) {
    if (!(err instanceof ValidationError)) {
      throw err;
    }

    errors.push(err);

    if (config.stopAtFirstError) {
      throw new ValidationException(errors);
    }
  }

  if (errors.length) {
    throw new ValidationException(errors);
  }
};
