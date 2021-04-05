import { ThresholdValidator, BaseValidator, DependOnValidator } from './model';

export const minValidator: ThresholdValidator = ({ property, threshold, customMessage, config }) => {
  const msgFromConfig = config.messages?.number.min;

  if (property < threshold) {
    const defaultMessage = `The minimum allowed value is "${threshold}", but received is "${property}"`;
    throw new Error(customMessage ?? msgFromConfig ?? defaultMessage);
  }
};

export const maxValidator: ThresholdValidator = ({ property, threshold, customMessage, config }) => {
  const msgFromConfig = config.messages?.number.max;

  if (property > threshold) {
    const defaultMessage = `The maximum allowed value is "${threshold}", but received is "${property}"`;
    throw new Error(customMessage ?? msgFromConfig ?? defaultMessage);
  }
};

export const negativeValidator: BaseValidator = ({ property, customMessage, config }) => {
  const msgFromConfig = config.messages?.number.negative;

  if (property >= 0) {
    const defaultMessage = `Only negative values are allowed, but received value is "${property}"`;
    throw new Error(customMessage ?? msgFromConfig ?? defaultMessage);
  }
};

export const positiveValidator: BaseValidator = ({ property, customMessage, config }) => {
  const msgFromConfig = config.messages?.number.positive;

  if (property < 0) {
    const defaultMessage = `Only positive values are allowed, but received value is "${property}"`;
    throw new Error(customMessage ?? msgFromConfig ?? defaultMessage);
  }
};

export const integerValidator: BaseValidator = ({ property, customMessage, config }) => {
  const msgFromConfig = config.messages?.number.integer;

  if (property % 1 !== 0) {
    const defaultMessage = `Only integer values are allowed, but received value is "${property}"`;
    throw new Error(customMessage ?? msgFromConfig ?? defaultMessage);
  }
};

export const floatValidator: BaseValidator = ({ property, customMessage, config }) => {
  const msgFromConfig = config.messages?.number.float;

  if (property % 1 === 0) {
    const defaultMessage = `Only float values are allowed, but received value is "${property}"`;
    throw new Error(customMessage ?? msgFromConfig ?? defaultMessage);
  }
};

export const lessThanValidator: DependOnValidator = ({ property, data, targetPropertyName, customMessage, config }) => {
  const msgFromConfig = config.messages?.number.lessThan;

  if (property >= data[targetPropertyName]) {
    const defaultMessage = `Must be less than "${targetPropertyName}" property value, but received value "${property}" is more or equal to "${data[targetPropertyName]}"`;
    throw new Error(customMessage ?? msgFromConfig ?? defaultMessage);
  }
};

export const moreThanValidator: DependOnValidator = ({ property, data, targetPropertyName, customMessage, config }) => {
  const msgFromConfig = config.messages?.number.moreThan;

  if (property <= data[targetPropertyName]) {
    const defaultMessage = `Must be more than "${targetPropertyName}" property value, but received value "${property}" is less or equal to "${data[targetPropertyName]}"`;
    throw new Error(customMessage ?? msgFromConfig ?? defaultMessage);
  }
};
