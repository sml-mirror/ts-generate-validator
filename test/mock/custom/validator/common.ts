import {
  Validation,
  CustomValidation,
  EqualValidation,
  EqualToValidation,
  IgnoreValidation,
  TypeValidation,
  MinValidation,
  MaxValidation,
} from 'src/decorators/index';

/**
 * Type
 */
@Validation()
export class TypeValidatorWithCustomMessage {
  @TypeValidation('type custom message')
  public someProperty: string = '';
}

@Validation()
export class TypeValidatorOnWrongPropertyType {
  @TypeValidation('type custom message')
  public someProperty?: CustomValidatorFailed;
}

/**
 * Custom
 */
@Validation()
export class CustomValidatorFailed {
  @CustomValidation(() => false, 'custom validator message')
  public someProperty?: number;
}

@Validation()
export class CutomValidatorSuccess {
  @CustomValidation(() => true, 'custom validator message')
  public someProperty?: number;
}

/**
 * Ignore
 */
@Validation()
export class IgnoreValidationForNonPrimitiveProperty {
  @IgnoreValidation
  public someProperty?: number;
}

@Validation()
export class IgnoreValidationForPrimitiveProperty {
  @IgnoreValidation
  public someProperty: number = 0;
}

@Validation()
export class IgnoreValidationForPrimitivePropertyWithOtherDecorators {
  @MaxValidation(10)
  @IgnoreValidation
  @MinValidation(2)
  public someProperty: number = 0;
}

/**
 * Equal
 */
@Validation()
export class EqualValidatorWithDefaultMessage {
  @EqualValidation('abcdef')
  public someProperty: string = '';
}

@Validation()
export class EqualValidatorWithCustomMessage {
  @EqualValidation(245, 'equal custom message')
  public someProperty: number = 0;
}

@Validation()
export class EqualValidatorForBoolean {
  @EqualValidation(true)
  public someProperty: boolean = false;
}

/**
 * EqualTo
 */
@Validation()
export class EqualToValidatorWithDefaultMessage {
  @EqualToValidation('someOtherProperty')
  public someProperty: string = '';

  @EqualToValidation('someProperty')
  public someOtherProperty: string = '';
}

export class EqualToValidatorWithCustomMessage {
  @EqualToValidation('someOtherProperty', 'equialTo custom message')
  public someProperty: string = '';

  @EqualToValidation('someProperty', 'equialTo custom message')
  public someOtherProperty: string = '';
}
