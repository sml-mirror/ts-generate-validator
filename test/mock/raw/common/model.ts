import { customValidationFuncImported, someEntityUsedInCustomValidator } from './customValidationFunc';
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
import { ValidationError } from 'src';

/**
 * Type
 */
@Validation
export class TypeValidatorWithCustomMessage {
  @TypeValidation('type custom message')
  public someProperty = '';
}

@Validation
export class TypeValidatorOnNestedPropertyType {
  @TypeValidation('type custom message')
  public someProperty?: CustomValidatorFailed;
}

@Validation
export class TypeValidatorOnNullPropertyType {
  public someProperty: null = null;
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
export class CutomValidatorOnNonPrimitiveStructure {
  @CustomValidation(() => undefined)
  public someProperty?: Record<string, any> & { a: number };
}

@Validation
export class CutomValidatorSuccessAsync {
  @CustomValidation(async (): Promise<void> => new Promise((resolve) => setTimeout(() => resolve(), 300)))
  public someProperty?: number;
}

@Validation
export class CutomValidatorImported {
  @CustomValidation(customValidationFuncImported)
  public someProperty?: number;
}

export const customValidationFuncExported = (): void => undefined;

@Validation
export class CutomValidatorExported {
  @CustomValidation(customValidationFuncExported)
  public someProperty?: number;
}

@Validation
export class CutomValidatorWhichUsesImportedEntity {
  @CustomValidation(({ property, propertyName }) => {
    if (property !== someEntityUsedInCustomValidator) {
      throw new ValidationError(propertyName as string, 'some error message');
    }
  })
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
