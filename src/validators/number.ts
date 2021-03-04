import { MinValidator, MaxValidator, BaseValidator, LessThanValidator, MoreThanValidator } from './model';

export const minValidator: MinValidator = ({ property, trashold, customMessage }) => {
  if (property < trashold) {
    const defaultMessage = `The minimum allowed value is "${trashold}", but received is "${property}"`;
    throw new Error(customMessage ?? defaultMessage);
  }
};

export const maxValidator: MaxValidator = ({ property, trashold, customMessage }) => {
  if (property > trashold) {
    const defaultMessage = `The maximum allowed value is "${trashold}", but received is "${property}"`;
    throw new Error(customMessage ?? defaultMessage);
  }
};

export const negativeValidator: BaseValidator = ({ property, customMessage }) => {
  if (property >= 0) {
    const defaultMessage = `Only negative values are allowed, but received value is "${property}"`;
    throw new Error(customMessage ?? defaultMessage);
  }
};

export const positiveValidator: BaseValidator = ({ property, customMessage }) => {
  if (property < 0) {
    const defaultMessage = `Only positive values are allowed, but received value is "${property}"`;
    throw new Error(customMessage ?? defaultMessage);
  }
};

export const integerValidator: BaseValidator = ({ property, customMessage }) => {
  if (property % 1 !== 0) {
    const defaultMessage = `Only integer values are allowed, but received value is "${property}"`;
    throw new Error(customMessage ?? defaultMessage);
  }
};

export const floatValidator: BaseValidator = ({ property, customMessage }) => {
  if (property % 1 === 0) {
    const defaultMessage = `Only float values are allowed, but received value is "${property}"`;
    throw new Error(customMessage ?? defaultMessage);
  }
};

export const lessThanValidator: LessThanValidator = ({ property, data, targetPropertyName, customMessage }) => {
  if (property >= data[targetPropertyName]) {
    const defaultMessage = `Must be less than "${targetPropertyName}" property value, but received value "${property}" is more or equal to "${data[targetPropertyName]}"`;
    throw new Error(customMessage ?? defaultMessage);
  }
};

export const moreThanValidator: MoreThanValidator = ({ property, data, targetPropertyName, customMessage }) => {
  if (property <= data[targetPropertyName]) {
    const defaultMessage = `Must be more than "${targetPropertyName}" property value, but received value "${property}" is less or equal to "${data[targetPropertyName]}"`;
    throw new Error(customMessage ?? defaultMessage);
  }
};
