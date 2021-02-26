import {
  Validation,
  LowercaseValidation,
  UppercaseValidation,
  EmailValidation,
  UrlValidation,
  TrimValidation,
  MinLengthValidation,
  MaxLengthValidation,
  MatchValidation,
} from 'src/decorators/index';

/**
 * Trim
 */
@Validation()
export class TrimValidatorWithDefaultMessage {
  @TrimValidation()
  public someProperty: string = '';
}

@Validation()
export class TrimValidatorOnWrongPropertyType {
  @TrimValidation()
  public someProperty: boolean = false;
}

@Validation()
export class TrimValidatorWithCustomMessage {
  @TrimValidation('trim custom message')
  public someProperty: string = '';
}

/**
 * Lowercase
 */
@Validation()
export class LowercaseValidatorWithDefaultMessage {
  @LowercaseValidation()
  public someProperty: string = '';
}

@Validation()
export class LowercaseValidatorOnWrongPropertyType {
  @LowercaseValidation()
  public someProperty: boolean = false;
}

@Validation()
export class LowercaseValidatorWithCustomMessage {
  @LowercaseValidation('lowercase custom message')
  public someProperty: string = '';
}

/**
 * Uppercase
 */
@Validation()
export class UppercaseValidatorWithDefaultMessage {
  @UppercaseValidation()
  public someProperty: string = '';
}

@Validation()
export class UppercaseValidatorOnWrongPropertyType {
  @UppercaseValidation()
  public someProperty: boolean = false;
}

@Validation()
export class UppercaseValidatorWithCustomMessage {
  @UppercaseValidation('uppercase custom message')
  public someProperty: string = '';
}

/**
 * MinLength
 */
@Validation()
export class MinLengthValidatorWithDefaultMessage {
  @MinLengthValidation(5)
  public someProperty: string = '';
}

@Validation()
export class MinLengthValidatorOnWrongPropertyType {
  @MinLengthValidation(5)
  public someProperty: boolean = false;
}

@Validation()
export class MinLengthValidatorWithCustomMessage {
  @MinLengthValidation(5, 'minLength custom message')
  public someProperty: string = '';
}

/**
 * MaxLength
 */
@Validation()
export class MaxLengthValidatorWithDefaultMessage {
  @MaxLengthValidation(25)
  public someProperty: string = '';
}

@Validation()
export class MaxLengthValidatorOnWrongPropertyType {
  @MaxLengthValidation(25)
  public someProperty: boolean = false;
}

@Validation()
export class MaxLengthValidatorWithCustomMessage {
  @MaxLengthValidation(25, 'maxLength custom message')
  public someProperty: string = '';
}

/**
 * Email
 */
@Validation()
export class EmailValidatorWithDefaultMessage {
  @EmailValidation()
  public someProperty: string = '';
}

@Validation()
export class EmailValidatorOnWrongPropertyType {
  @EmailValidation()
  public someProperty: boolean = false;
}

@Validation()
export class EmailValidatorWithCustomMessage {
  @EmailValidation('email custom message')
  public someProperty: string = '';
}

/**
 * Url
 */
@Validation()
export class UrlValidatorWithDefaultMessage {
  @UrlValidation()
  public someProperty: string = '';
}

@Validation()
export class UrlValidatorOnWrongPropertyType {
  @UrlValidation()
  public someProperty: boolean = false;
}

@Validation()
export class UrlValidatorWithCustomMessage {
  @UrlValidation('url custom message')
  public someProperty: string = '';
}

/**
 * Match
 */
@Validation()
export class MatchValidatorWithDefaultMessage {
  @MatchValidation(/^matchString$/)
  public someProperty: string = '';
}

@Validation()
export class MatchValidatorOnWrongPropertyType {
  @MatchValidation(/^matchString$/)
  public someProperty: number = 0;
}

@Validation()
export class MatchValidatorWithCustomMessage {
  @MatchValidation(/^matchString$/, 'match custom message')
  public someProperty: string = '';
}
