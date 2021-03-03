import {
  Validation,
  LowercaseValidation,
  UppercaseValidation,
  EmailValidation,
  UrlValidation,
  TrimValidation,
  MinLengthValidation,
  MaxLengthValidation,
  MatchValidation
} from 'src/decorators/index';

/**
 * Trim
 */
@Validation
export class TrimValidatorWithDefaultMessage {
  @TrimValidation()
  public someProperty = '';
}

@Validation
export class TrimValidatorOnWrongPropertyType {
  @TrimValidation()
  public someProperty = false;
}

@Validation
export class TrimValidatorWithCustomMessage {
  @TrimValidation('trim custom message')
  public someProperty = '';
}

/**
 * Lowercase
 */
@Validation
export class LowercaseValidatorWithDefaultMessage {
  @LowercaseValidation()
  public someProperty = '';
}

@Validation
export class LowercaseValidatorOnWrongPropertyType {
  @LowercaseValidation()
  public someProperty = false;
}

@Validation
export class LowercaseValidatorWithCustomMessage {
  @LowercaseValidation('lowercase custom message')
  public someProperty = '';
}

/**
 * Uppercase
 */
@Validation
export class UppercaseValidatorWithDefaultMessage {
  @UppercaseValidation()
  public someProperty = '';
}

@Validation
export class UppercaseValidatorOnWrongPropertyType {
  @UppercaseValidation()
  public someProperty = false;
}

@Validation
export class UppercaseValidatorWithCustomMessage {
  @UppercaseValidation('uppercase custom message')
  public someProperty = '';
}

/**
 * MinLength
 */
@Validation
export class MinLengthValidatorWithDefaultMessage {
  @MinLengthValidation(5)
  public someProperty = '';
}

@Validation
export class MinLengthValidatorOnWrongPropertyType {
  @MinLengthValidation(5)
  public someProperty = false;
}

@Validation
export class MinLengthValidatorWithCustomMessage {
  @MinLengthValidation(5, 'minLength custom message')
  public someProperty = '';
}

/**
 * MaxLength
 */
@Validation
export class MaxLengthValidatorWithDefaultMessage {
  @MaxLengthValidation(25)
  public someProperty = '';
}

@Validation
export class MaxLengthValidatorOnWrongPropertyType {
  @MaxLengthValidation(25)
  public someProperty = false;
}

@Validation
export class MaxLengthValidatorWithCustomMessage {
  @MaxLengthValidation(25, 'maxLength custom message')
  public someProperty = '';
}

/**
 * Email
 */
@Validation
export class EmailValidatorWithDefaultMessage {
  @EmailValidation()
  public someProperty = '';
}

@Validation
export class EmailValidatorOnWrongPropertyType {
  @EmailValidation()
  public someProperty = false;
}

@Validation
export class EmailValidatorWithCustomMessage {
  @EmailValidation('email custom message')
  public someProperty = '';
}

/**
 * Url
 */
@Validation
export class UrlValidatorWithDefaultMessage {
  @UrlValidation()
  public someProperty = '';
}

@Validation
export class UrlValidatorOnWrongPropertyType {
  @UrlValidation()
  public someProperty = false;
}

@Validation
export class UrlValidatorWithCustomMessage {
  @UrlValidation('url custom message')
  public someProperty = '';
}

/**
 * Match
 */
@Validation
export class MatchValidatorWithDefaultMessage {
  @MatchValidation(/^matchString$/)
  public someProperty = '';
}

@Validation
export class MatchValidatorOnWrongPropertyType {
  @MatchValidation(/^matchString$/)
  public someProperty = 0;
}

@Validation
export class MatchValidatorWithCustomMessage {
  @MatchValidation(/^matchString$/, 'match custom message')
  public someProperty = '';
}
