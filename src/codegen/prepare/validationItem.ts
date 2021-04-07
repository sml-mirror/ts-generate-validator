import {
  uppercaseValidator,
  lowercaseValidator,
  trimValidator,
  minLengthValidator,
  maxLengthValidator,
  emailValidator,
  urlValidator,
  matchValidator
} from './../../validators/string';
import { ValidationType, primitiveValidationTypes } from './../../validators/model';
import {
  minValidator,
  maxValidator,
  negativeValidator,
  positiveValidator,
  integerValidator,
  floatValidator,
  lessThanValidator,
  moreThanValidator
} from './../../validators/number';
import { equalValidator, equalToValidator, typeValidator } from './../../validators/common';
import { customValidator } from '../../validators';
import {
  TypeValidation,
  CustomValidation,
  EqualValidation,
  EqualToValidation,
  MinValidation,
  MaxValidation,
  NegativeValidation,
  PositiveValidation,
  IntegerValidation,
  FloatValidation,
  LessThanValidation,
  MoreThanValidation,
  TrimValidation,
  LowercaseValidation,
  UppercaseValidation,
  MinLengthValidation,
  MaxLengthValidation,
  EmailValidation,
  UrlValidation,
  MatchValidation
} from './../../decorators/index';

export const decoratorNameToValidationItemData: {
  [decoratorName: string]: {
    validatorName: string;
    validatorArgumentNames: string[];
    allowedValidationTypes: ValidationType[];
  };
} = {
  /**
   * Common
   */
  [TypeValidation.name]: {
    validatorName: typeValidator.name,
    validatorArgumentNames: ['customMessage'],
    allowedValidationTypes: [...primitiveValidationTypes, ValidationType.enum, ValidationType.nested]
  },
  [CustomValidation.name]: {
    validatorName: customValidator.name,
    validatorArgumentNames: ['customValidationFunction'],
    allowedValidationTypes: [...primitiveValidationTypes, ValidationType.enum, ValidationType.nested]
  },
  [EqualValidation.name]: {
    validatorName: equalValidator.name,
    validatorArgumentNames: ['value', 'customMessage'],
    allowedValidationTypes: [...primitiveValidationTypes, ValidationType.enum]
  },
  [EqualToValidation.name]: {
    validatorName: equalToValidator.name,
    validatorArgumentNames: ['targetPropertyName', 'customMessage'],
    allowedValidationTypes: [...primitiveValidationTypes, ValidationType.enum]
  },
  /**
   * Number
   */
  [MinValidation.name]: {
    validatorName: minValidator.name,
    validatorArgumentNames: ['threshold', 'customMessage'],
    allowedValidationTypes: [ValidationType.number]
  },
  [MaxValidation.name]: {
    validatorName: maxValidator.name,
    validatorArgumentNames: ['threshold', 'customMessage'],
    allowedValidationTypes: [ValidationType.number]
  },
  [NegativeValidation.name]: {
    validatorName: negativeValidator.name,
    validatorArgumentNames: ['customMessage'],
    allowedValidationTypes: [ValidationType.number]
  },
  [PositiveValidation.name]: {
    validatorName: positiveValidator.name,
    validatorArgumentNames: ['customMessage'],
    allowedValidationTypes: [ValidationType.number]
  },
  [IntegerValidation.name]: {
    validatorName: integerValidator.name,
    validatorArgumentNames: ['customMessage'],
    allowedValidationTypes: [ValidationType.number]
  },
  [FloatValidation.name]: {
    validatorName: floatValidator.name,
    validatorArgumentNames: ['customMessage'],
    allowedValidationTypes: [ValidationType.number]
  },
  [LessThanValidation.name]: {
    validatorName: lessThanValidator.name,
    validatorArgumentNames: ['targetPropertyName', 'customMessage'],
    allowedValidationTypes: [ValidationType.number]
  },
  [MoreThanValidation.name]: {
    validatorName: moreThanValidator.name,
    validatorArgumentNames: ['targetPropertyName', 'customMessage'],
    allowedValidationTypes: [ValidationType.number]
  },
  /**
   * String
   */
  [TrimValidation.name]: {
    validatorName: trimValidator.name,
    validatorArgumentNames: ['customMessage'],
    allowedValidationTypes: [ValidationType.string]
  },
  [LowercaseValidation.name]: {
    validatorName: lowercaseValidator.name,
    validatorArgumentNames: ['customMessage'],
    allowedValidationTypes: [ValidationType.string]
  },
  [UppercaseValidation.name]: {
    validatorName: uppercaseValidator.name,
    validatorArgumentNames: ['customMessage'],
    allowedValidationTypes: [ValidationType.string]
  },
  [MinLengthValidation.name]: {
    validatorName: minLengthValidator.name,
    validatorArgumentNames: ['threshold', 'customMessage'],
    allowedValidationTypes: [ValidationType.string]
  },
  [MaxLengthValidation.name]: {
    validatorName: maxLengthValidator.name,
    validatorArgumentNames: ['threshold', 'customMessage'],
    allowedValidationTypes: [ValidationType.string]
  },
  [EmailValidation.name]: {
    validatorName: emailValidator.name,
    validatorArgumentNames: ['customMessage'],
    allowedValidationTypes: [ValidationType.string]
  },
  [UrlValidation.name]: {
    validatorName: urlValidator.name,
    validatorArgumentNames: ['customMessage'],
    allowedValidationTypes: [ValidationType.string]
  },
  [MatchValidation.name]: {
    validatorName: matchValidator.name,
    validatorArgumentNames: ['regexp', 'customMessage'],
    allowedValidationTypes: [ValidationType.string]
  }
};
