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
    allowedValidationTypes: [
      ...primitiveValidationTypes,
      ValidationType.enum,
      ValidationType.nested,
      ValidationType.array,
      ValidationType.union
    ]
  },
  [CustomValidation.name]: {
    validatorName: customValidator.name,
    validatorArgumentNames: ['customValidationFunction'],
    allowedValidationTypes: [
      ...primitiveValidationTypes,
      ValidationType.enum,
      ValidationType.nested,
      ValidationType.array,
      ValidationType.union,
      ValidationType.unknown,
      ValidationType.notSupported
    ]
  },
  [EqualValidation.name]: {
    validatorName: equalValidator.name,
    validatorArgumentNames: ['value', 'customMessage'],
    allowedValidationTypes: [
      ...primitiveValidationTypes,
      ValidationType.enum,
      ValidationType.array,
      ValidationType.union
    ]
  },
  [EqualToValidation.name]: {
    validatorName: equalToValidator.name,
    validatorArgumentNames: ['targetPropertyName', 'allowUndefined', 'customMessage'],
    allowedValidationTypes: [
      ...primitiveValidationTypes,
      ValidationType.enum,
      ValidationType.array,
      ValidationType.union
    ]
  },
  /**
   * Number
   */
  [MinValidation.name]: {
    validatorName: minValidator.name,
    validatorArgumentNames: ['threshold', 'customMessage'],
    allowedValidationTypes: [ValidationType.number, ValidationType.array]
  },
  [MaxValidation.name]: {
    validatorName: maxValidator.name,
    validatorArgumentNames: ['threshold', 'customMessage'],
    allowedValidationTypes: [ValidationType.number, ValidationType.array]
  },
  [NegativeValidation.name]: {
    validatorName: negativeValidator.name,
    validatorArgumentNames: ['customMessage'],
    allowedValidationTypes: [ValidationType.number, ValidationType.array]
  },
  [PositiveValidation.name]: {
    validatorName: positiveValidator.name,
    validatorArgumentNames: ['customMessage'],
    allowedValidationTypes: [ValidationType.number, ValidationType.array]
  },
  [IntegerValidation.name]: {
    validatorName: integerValidator.name,
    validatorArgumentNames: ['customMessage'],
    allowedValidationTypes: [ValidationType.number, ValidationType.array]
  },
  [FloatValidation.name]: {
    validatorName: floatValidator.name,
    validatorArgumentNames: ['customMessage'],
    allowedValidationTypes: [ValidationType.number, ValidationType.array]
  },
  [LessThanValidation.name]: {
    validatorName: lessThanValidator.name,
    validatorArgumentNames: ['targetPropertyName', 'allowUndefined', 'customMessage'],
    allowedValidationTypes: [ValidationType.number, ValidationType.array]
  },
  [MoreThanValidation.name]: {
    validatorName: moreThanValidator.name,
    validatorArgumentNames: ['targetPropertyName', 'allowUndefined', 'customMessage'],
    allowedValidationTypes: [ValidationType.number, ValidationType.array]
  },
  /**
   * String
   */
  [TrimValidation.name]: {
    validatorName: trimValidator.name,
    validatorArgumentNames: ['customMessage'],
    allowedValidationTypes: [ValidationType.string, ValidationType.array]
  },
  [LowercaseValidation.name]: {
    validatorName: lowercaseValidator.name,
    validatorArgumentNames: ['customMessage'],
    allowedValidationTypes: [ValidationType.string, ValidationType.array]
  },
  [UppercaseValidation.name]: {
    validatorName: uppercaseValidator.name,
    validatorArgumentNames: ['customMessage'],
    allowedValidationTypes: [ValidationType.string, ValidationType.array]
  },
  [MinLengthValidation.name]: {
    validatorName: minLengthValidator.name,
    validatorArgumentNames: ['threshold', 'customMessage'],
    allowedValidationTypes: [ValidationType.string, ValidationType.array]
  },
  [MaxLengthValidation.name]: {
    validatorName: maxLengthValidator.name,
    validatorArgumentNames: ['threshold', 'customMessage'],
    allowedValidationTypes: [ValidationType.string, ValidationType.array]
  },
  [EmailValidation.name]: {
    validatorName: emailValidator.name,
    validatorArgumentNames: ['customMessage'],
    allowedValidationTypes: [ValidationType.string, ValidationType.array]
  },
  [UrlValidation.name]: {
    validatorName: urlValidator.name,
    validatorArgumentNames: ['customMessage'],
    allowedValidationTypes: [ValidationType.string, ValidationType.array]
  },
  [MatchValidation.name]: {
    validatorName: matchValidator.name,
    validatorArgumentNames: ['regexp', 'customMessage'],
    allowedValidationTypes: [ValidationType.string, ValidationType.array]
  }
};
