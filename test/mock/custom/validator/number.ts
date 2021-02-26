import {
  Validation,
  PositiveValidation,
  IntegerValidation,
  FloatValidation,
  LessThanValidation,
  NegativeValidation,
  MoreThanValidation,
  MinValidation,
  MaxValidation,
} from 'src/decorators/index';

/**
 * Min
 */
@Validation()
export class MinValidatorWithDefaultMessage {
  @MinValidation(10)
  public someProperty: number = 0;
}

@Validation()
export class MinValidatorOnWrongPropertyType {
  @MinValidation(10)
  public someProperty: string = '';
}

@Validation()
export class MinValidatorWithCustomMessage {
  @MinValidation(10, 'min custom message')
  public someProperty: number = 0;
}

/**
 * Max
 */
@Validation()
export class MaxValidatorWithDefaultMessage {
  @MaxValidation(10)
  public someProperty: number = 0;
}

@Validation()
export class MaxValidatorOnWrongPropertyType {
  @MaxValidation(10)
  public someProperty: string = '';
}

@Validation()
export class MaxValidatorWithCustomMessage {
  @MaxValidation(10, 'max custom message')
  public someProperty: number = 0;
}

/**
 * Negative
 */
@Validation()
export class NegativeValidatorWithDefaultMessage {
  @NegativeValidation()
  public someProperty: number = 0;
}

@Validation()
export class NegativeValidatorOnWrongPropertyType {
  @NegativeValidation()
  public someProperty: string = '';
}

@Validation()
export class NegativeValidatorWithCustomMessage {
  @NegativeValidation('negative custom message')
  public someProperty: number = 0;
}

/**
 * Positive
 */
@Validation()
export class PositiveValidatorWithDefaultMessage {
  @PositiveValidation()
  public someProperty: number = 0;
}

@Validation()
export class PositiveValidatorOnWrongPropertyType {
  @PositiveValidation()
  public someProperty: string = '';
}

@Validation()
export class PositiveValidatorWithCustomMessage {
  @PositiveValidation('positive custom message')
  public someProperty: number = 0;
}

/**
 * Integer
 */
@Validation()
export class IntegerValidatorWithDefaultMessage {
  @IntegerValidation()
  public someProperty: number = 0;
}

@Validation()
export class IntegerValidatorOnWrongPropertyType {
  @IntegerValidation()
  public someProperty: string = '';
}

@Validation()
export class IntegerValidatorWithCustomMessage {
  @IntegerValidation('integer custom message')
  public someProperty: number = 0;
}

/**
 * Float
 */
@Validation()
export class FloatValidatorWithDefaultMessage {
  @FloatValidation()
  public someProperty: number = 0;
}

@Validation()
export class FloatValidatorOnWrongPropertyType {
  @FloatValidation()
  public someProperty: string = '';
}

@Validation()
export class FloatValidatorWithCustomMessage {
  @FloatValidation('float custom message')
  public someProperty: number = 0;
}

/**
 * LessThan & moreThan
 */
@Validation()
export class LessThanMoreThanValidatorWithDefaultMessage {
  @LessThanValidation('someOtherProperty')
  public someProperty: number = 0;

  @MoreThanValidation('someProperty')
  public someOtherProperty: number = 0;
}

@Validation()
export class LessThanMoreThanValidatorOnWrongPropertyType {
  @LessThanValidation('someOtherProperty')
  public someProperty: string = '';

  @MoreThanValidation('someProperty')
  public someOtherProperty: string = '';
}

@Validation()
export class LessThanValidatorWithCustomMessage {
  @LessThanValidation('someOtherProperty', 'lessThan custom message')
  public someProperty: number = 0;

  @MoreThanValidation('someProperty', 'moreThan custom message')
  public someOtherProperty: number = 0;
}
