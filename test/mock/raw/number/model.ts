import {
  Validation,
  PositiveValidation,
  IntegerValidation,
  FloatValidation,
  LessThanValidation,
  NegativeValidation,
  MoreThanValidation,
  MinValidation,
  MaxValidation
} from '../../../../src/decorators';

/**
 * Min
 */
@Validation
export class MinValidatorWithDefaultMessage {
  @MinValidation(10)
  public someProperty = 0;
}

@Validation
export class MinValidatorOnWrongPropertyType {
  @MinValidation(10)
  public someProperty = '';
}

@Validation
export class MinValidatorWithCustomMessage {
  @MinValidation(10, 'min custom message')
  public someProperty = 0;
}

/**
 * Max
 */
@Validation
export class MaxValidatorWithDefaultMessage {
  @MaxValidation(10)
  public someProperty = 0;
}

@Validation
export class MaxValidatorOnWrongPropertyType {
  @MaxValidation(10)
  public someProperty = '';
}

@Validation
export class MaxValidatorWithCustomMessage {
  @MaxValidation(10, 'max custom message')
  public someProperty = 0;
}

/**
 * Negative
 */
@Validation
export class NegativeValidatorWithDefaultMessage {
  @NegativeValidation()
  public someProperty = 0;
}

@Validation
export class NegativeValidatorOnWrongPropertyType {
  @NegativeValidation()
  public someProperty = '';
}

@Validation
export class NegativeValidatorWithCustomMessage {
  @NegativeValidation('negative custom message')
  public someProperty = 0;
}

/**
 * Positive
 */
@Validation
export class PositiveValidatorWithDefaultMessage {
  @PositiveValidation()
  public someProperty = 0;
}

@Validation
export class PositiveValidatorOnWrongPropertyType {
  @PositiveValidation()
  public someProperty = '';
}

@Validation
export class PositiveValidatorWithCustomMessage {
  @PositiveValidation('positive custom message')
  public someProperty = 0;
}

/**
 * Integer
 */
@Validation
export class IntegerValidatorWithDefaultMessage {
  @IntegerValidation()
  public someProperty = 0;
}

@Validation
export class IntegerValidatorOnWrongPropertyType {
  @IntegerValidation()
  public someProperty = '';
}

@Validation
export class IntegerValidatorWithCustomMessage {
  @IntegerValidation('integer custom message')
  public someProperty = 0;
}

/**
 * Float
 */
@Validation
export class FloatValidatorWithDefaultMessage {
  @FloatValidation()
  public someProperty = 0;
}

@Validation
export class FloatValidatorOnWrongPropertyType {
  @FloatValidation()
  public someProperty = '';
}

@Validation
export class FloatValidatorWithCustomMessage {
  @FloatValidation('float custom message')
  public someProperty = 0;
}

/**
 * LessThan & moreThan
 */
@Validation
export class LessThanMoreThanValidatorWithDefaultMessage {
  @LessThanValidation('someOtherProperty')
  public someProperty = 0;

  @MoreThanValidation('someProperty')
  public someOtherProperty = 0;
}

@Validation
export class LessThanMoreThanValidatorOnWrongPropertyType {
  @LessThanValidation('someOtherProperty')
  public someProperty = '';

  @MoreThanValidation('someProperty')
  public someOtherProperty = '';
}

@Validation
export class LessThanValidatorWithCustomMessage {
  @LessThanValidation('someOtherProperty', 'lessThan custom message')
  public someProperty = 0;

  @MoreThanValidation('someProperty', 'moreThan custom message')
  public someOtherProperty = 0;
}
