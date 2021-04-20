import { UserType } from './../../user/type/model';
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
import { ValidationError } from '../../../../src';

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
  public someProperty?: CustomValidatorSuccess;
}

@Validation
export class TypeValidatorOnAsyncNestedPropertyType {
  @TypeValidation('type custom message')
  public someProperty?: CustomValidatorSuccessAsync;
}

@Validation
export class TypeValidatorOnAsyncDeepNestedPropertyType {
  @TypeValidation('type custom message')
  public someProperty?: TypeValidatorOnAsyncNestedPropertyType;
}

@Validation
export class TypeValidatorOnNullPropertyType {
  public someProperty: null = null;
}

@Validation
export class TypeValidatorOnNullPropertyWithoutType {
  public someProperty = null;
}

@Validation
export class TypeValidatorOnImportedEnumPropertyType {
  public someProperty?: UserType;
}

@Validation
export class TypeValidatorOnUnionPropertyType {
  public someProperty: string | number | null = null;
}

@Validation
export class TypeValidatorOnUnionWithNestedPropertyType {
  public someProperty: CustomValidatorFailed | number | null = null;
}

@Validation
export class TypeValidatorOnArrayPropertyType {
  public someProperty: string[] = [];
}

@Validation
export class TypeValidatorOnUnionWithArrayPropertyType {
  public someProperty: null | number | string[] = null;
}

@Validation
export class TypeValidatorOnArrayOfNestedTypePropertyType {
  public someProperty: CustomValidatorSuccess[] = [];
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
export class CustomValidatorSuccess {
  @CustomValidation(() => undefined)
  public someProperty?: number;
}

@Validation
export class CustomValidatorOnNonPrimitiveStructure {
  @CustomValidation(() => undefined)
  public someProperty?: Record<string, any> & { a: number };
}

@Validation
export class CustomValidatorSuccessAsync {
  @CustomValidation(async (): Promise<void> => new Promise((resolve) => setTimeout(() => resolve(), 300)))
  public someProperty?: number;
}

@Validation
export class CustomValidatorImported {
  @CustomValidation(customValidationFuncImported)
  public someProperty?: number;
}

export const customValidationFuncExported = (): void => undefined;

@Validation
export class CustomValidatorExported {
  @CustomValidation(customValidationFuncExported)
  public someProperty?: number;
}

@Validation
export class CustomValidatorWhichUsesImportedEntity {
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
  @EqualToValidation('someOtherProperty', false, 'equialTo custom message')
  public someProperty = '';

  @EqualToValidation('someProperty', false, 'equialTo custom message')
  public someOtherProperty = '';
}
