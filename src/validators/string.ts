import { BaseValidator, ThresholdValidator, MatchValidator } from './model';

export const trimValidator: BaseValidator = ({ property, customMessage }) => {
  // https://stackoverflow.com/questions/38934328/regex-match-a-string-without-leading-and-trailing-spaces
  if (property && !String(property).match(/^[A-Za-z0-9]+(?: +[A-Za-z0-9]+)*$/)) {
    const defaultMessage = `Should not have leading and trailing spaces, but received string has ("${property}")`;
    throw new Error(customMessage ?? defaultMessage);
  }
};

export const lowercaseValidator: BaseValidator = ({ property, customMessage }) => {
  if (String(property) !== String(property).toLocaleLowerCase()) {
    const defaultMessage = `Should not have uppercase letters, but received string has ("${property}")`;
    throw new Error(customMessage ?? defaultMessage);
  }
};

export const uppercaseValidator: BaseValidator = ({ property, customMessage }) => {
  if (String(property) !== String(property).toLocaleUpperCase()) {
    const defaultMessage = `Should not have lowercase letters, but received string has ("${property}")`;
    throw new Error(customMessage ?? defaultMessage);
  }
};

export const minLengthValidator: ThresholdValidator = ({ property, threshold, customMessage }) => {
  if (String(property).length < threshold) {
    const defaultMessage = `Should be longer than ${threshold} characters, but received string (${property}) contains only "${
      String(property).length
    }" characters`;
    throw new Error(customMessage ?? defaultMessage);
  }
};

export const maxLengthValidator: ThresholdValidator = ({ property, threshold, customMessage }) => {
  if (String(property).length > threshold) {
    const defaultMessage = `Should be no longer than ${threshold} characters, but received string (${property}) contains "${
      String(property).length
    }" characters`;
    throw new Error(customMessage ?? defaultMessage);
  }
};

export const emailValidator: BaseValidator = ({ property, config, customMessage }) => {
  if (!String(property).match(config.emailRegExp)) {
    const defaultMessage = `Must be a valid email, but received "${property}"`;
    throw new Error(customMessage ?? defaultMessage);
  }
};

export const urlValidator: BaseValidator = ({ property, customMessage }) => {
  // https://github.com/jquense/yup/blob/master/src/string.ts
  // eslint-disable-next-line no-useless-escape
  const regexp = /^((https?|ftp):)?\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
  if (!String(property).match(regexp)) {
    const defaultMessage = `Must be a valid URL, but received "${property}"`;
    throw new Error(customMessage ?? defaultMessage);
  }
};

export const matchValidator: MatchValidator = ({ property, regexp, customMessage }) => {
  if (!String(property).match(regexp)) {
    const defaultMessage = `Should match the pattern ${String(regexp)}, but received string ("${property}") not match`;
    throw new Error(customMessage ?? defaultMessage);
  }
};
