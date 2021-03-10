import {
  Validation,
  CustomValidation,
  EqualValidation,
  EqualToValidation,
  IgnoreValidation,
  TypeValidation,
  MinValidation,
  MaxValidation
} from '../../../../src/decorators';

/**
 * Type
 */
@Validation
export class TypeValidatorWithCustomMessage {
  @TypeValidation('type custom message')
  public someProperty = '';
}

@Validation
export class TypeValidatorOnWrongPropertyType {
  @TypeValidation('type custom message')
  public someProperty?: CustomValidatorFailed;
}

/**
 * Custom
 */
@Validation
export class CustomValidatorFailed {
  @CustomValidation(() => {
    throw new Error('Failed!');
  })
  public someProperty?: number;
}

@Validation
export class CutomValidatorSuccess {
  @CustomValidation(() => undefined)
  public someProperty?: number;
}

@Validation
export class CutomValidatorSuccessAsync {
  @CustomValidation(async (): Promise<void> => new Promise((resolve) => setTimeout(() => resolve(), 300)))
  public someProperty?: number;
}

/**
 * Ignore
 */
@Validation
export class IgnoreValidationForNonPrimitiveProperty {
  @IgnoreValidation
  public someProperty?: number;
}

@Validation
export class IgnoreValidationForPrimitiveProperty {
  @IgnoreValidation
  public someProperty = 0;
}

@Validation
export class IgnoreValidationForPrimitivePropertyWithOtherDecorators {
  @MaxValidation(10)
  @IgnoreValidation
  @MinValidation(2)
  public someProperty = 0;
}

/**
 * Equal
 */
@Validation
export class EqualValidatorWithDefaultMessage {
  @EqualValidation('abcdef')
  public someProperty = '';
}

@Validation
export class EqualValidatorWithCustomMessage {
  @EqualValidation(245, 'equal custom message')
  public someProperty = 0;
}

@Validation
export class EqualValidatorForBoolean {
  @EqualValidation(true)
  public someProperty = false;
}

/**
 * EqualTo
 */
@Validation
export class EqualToValidatorWithDefaultMessage {
  @EqualToValidation('someOtherProperty')
  public someProperty = '';

  @EqualToValidation('someProperty')
  public someOtherProperty = '';
}

export class EqualToValidatorWithCustomMessage {
  @EqualToValidation('someOtherProperty', 'equialTo custom message')
  public someProperty = '';

  @EqualToValidation('someProperty', 'equialTo custom message')
  public someOtherProperty = '';
}
