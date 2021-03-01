import { CustomValidator } from './../validators/model';
import { Data } from 'src/codegen/model';
import { Message } from 'src/localization/model';

const emptyDecorator = (...args: any[]) => args[0];

/*
 *********************
 *
 * Class decorators
 *
 *********************
 */

/**
 * Marks a class as requiring generation of a validation function
 * @param config config that will only be applied to the current class validation
 */
// @ts-ignore
export const Validation = emptyDecorator;

/**
 * Adds to several optional class properties listed in the first argument a validator that checks if at least one of the specified properties is complete
 * @param properties target optional class properties list
 * @param message error message
 */
// @ts-ignore
export const RequiredOneOfValidation = <D extends Data = Data>(properties: (keyof D)[], message?: Message) => (
  // @ts-ignore
  constructor: Function
) => undefined;

/*
 *********************
 *
 * Property decorators
 *
 *********************
 */

/**
 * Common
 */

/**
 * Changes default error message for type checking
 * @param message error message
 */
// @ts-ignore
export const TypeValidation = (message: Message) => emptyDecorator;

/**
 * Checks property value using a custom validation function
 * @param validator validation function for check
 * @param message error message
 */
// @ts-ignore
export const CustomValidation = (validator: CustomValidator, message: Message) => emptyDecorator;

/**
 * Marks a property as ignored in a validation function - it will not be checked against type, and any other decorators applied will be ignored
 */
// @ts-ignore
export const IgnoreValidation = emptyDecorator;

/**
 * Checks if property matches the value passed in the first argument
 * @param trashold maximum allowed property value
 * @param message error message
 */
// @ts-ignore
export const EqualValidation = (value: string | number | boolean, message?: Message) => emptyDecorator;

/**
 * Checks if property value is equal to another property value
 * @param propName another property name to compare
 * @param message error message
 */
// @ts-ignore
export const EqualToValidation = (propName: string, message?: Message) => emptyDecorator;

/**
 * Number
 */

/**
 * Checks property against the minimum trashold value (inclusive)
 * @param trashold minimum allowed property value
 * @param message error message
 */
// @ts-ignore
export const MinValidation = (trashold: number, message?: Message) => emptyDecorator;

/**
 * Checks property against the maximum trashold value (inclusive)
 * @param trashold maximum allowed property value
 * @param message error message
 */
// @ts-ignore
export const MaxValidation = (trashold: number, message?: Message) => emptyDecorator;

/**
 * Checks if property is negative number
 * @param message error message
 */
// @ts-ignore
export const NegativeValidation = (message?: Message) => emptyDecorator;

/**
 * Checks if property is positive number
 * @param message error message
 */
// @ts-ignore
export const PositiveValidation = (message?: Message) => emptyDecorator;

/**
 * Checks if property is integer
 * @param message error message
 */
// @ts-ignore
export const IntegerValidation = (message?: Message) => emptyDecorator;

/**
 * Checks if property is float
 * @param message error message
 */
// @ts-ignore
export const FloatValidation = (message?: Message) => emptyDecorator;

/**
 * Checks if property value is less than another property value
 * @param propName another property name to compare
 * @param message error message
 */
// @ts-ignore
export const LessThanValidation = (propName: string, message?: Message) => emptyDecorator;

/**
 * Checks if property value is more than another property value
 * @param propName another property name to compare
 * @param message error message
 */
// @ts-ignore
export const MoreThanValidation = (propName: string, message?: Message) => emptyDecorator;

/**
 * String
 */

/**
 * Checks the absence of spaces at the beginning and end of a string
 * @param message error message
 */
// @ts-ignore
export const TrimValidation = (message?: Message) => emptyDecorator;

/**
 * Сhecks for no capital letters in a string
 * @param message error message
 */
// @ts-ignore
export const LowercaseValidation = (message?: Message) => emptyDecorator;

/**
 * Сhecks for no lowercase letters in a string
 * @param message error message
 */
// @ts-ignore
export const UppercaseValidation = (message?: Message) => emptyDecorator;

/**
 * Checks the string length against the minimum trashold value (inclusive)
 * @param trashold minimum allowed string length
 * @param message error message
 */
// @ts-ignore
export const MinLengthValidation = (trashold: number, message?: Message) => emptyDecorator;

/**
 * Checks the string length against the maximum trashold value (inclusive)
 * @param trashold maximum allowed string length
 * @param message error message
 */
// @ts-ignore
export const MaxLengthValidation = (trashold: number, message?: Message) => emptyDecorator;

/**
 * Checks if string is correct email
 * @param message error message
 */
// @ts-ignore
export const EmailValidation = (message?: Message) => emptyDecorator;

/**
 * Checks if string is correct url
 * @param message error message
 */
// @ts-ignore
export const UrlValidation = (message?: Message) => emptyDecorator;

/**
 * Checks the string against the regular expression passed in the first argument
 * @param regexp regular expression to match
 * @param message error message
 */
// @ts-ignore
export const MatchValidation = (regexp: RegExp, message?: Message) => emptyDecorator;
