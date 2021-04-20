import { ValidationError } from './../codegen/utils/error';
import { ThresholdValidator, BaseValidator, DependOnValidator } from './model';

export const minValidator: ThresholdValidator = (payload) => {
  const { property, propertyName, threshold, customMessage, config, optional } = payload;

  if (optional && property === undefined) {
    return;
  }

  if (property && Array.isArray(property)) {
    return property.forEach((p, i) => minValidator({ ...payload, property: p, propertyName: `${propertyName}[${i}]` }));
  }

  const msgFromConfig = config.messages?.number?.min;

  if (property < threshold) {
    const defaultMessage = `The minimum allowed value is "${threshold}", but received is "${property}"`;
    throw new ValidationError(propertyName, customMessage ?? msgFromConfig ?? defaultMessage);
  }
};

export const maxValidator: ThresholdValidator = (payload) => {
  const { property, propertyName, threshold, customMessage, config, optional } = payload;

  if (optional && property === undefined) {
    return;
  }

  if (property && Array.isArray(property)) {
    return property.forEach((p, i) => maxValidator({ ...payload, property: p, propertyName: `${propertyName}[${i}]` }));
  }

  const msgFromConfig = config.messages?.number?.max;

  if (property > threshold) {
    const defaultMessage = `The maximum allowed value is "${threshold}", but received is "${property}"`;
    throw new ValidationError(propertyName, customMessage ?? msgFromConfig ?? defaultMessage);
  }
};

export const negativeValidator: BaseValidator = (payload) => {
  const { property, propertyName, customMessage, config, optional } = payload;

  if (optional && property === undefined) {
    return;
  }

  if (property && Array.isArray(property)) {
    return property.forEach((p, i) =>
      negativeValidator({ ...payload, property: p, propertyName: `${propertyName}[${i}]` })
    );
  }

  const msgFromConfig = config.messages?.number?.negative;

  if (property >= 0) {
    const defaultMessage = `Only negative values are allowed, but received value is "${property}"`;
    throw new ValidationError(propertyName, customMessage ?? msgFromConfig ?? defaultMessage);
  }
};

export const positiveValidator: BaseValidator = (payload) => {
  const { property, propertyName, customMessage, config, optional } = payload;

  if (optional && property === undefined) {
    return;
  }

  if (property && Array.isArray(property)) {
    return property.forEach((p, i) =>
      positiveValidator({ ...payload, property: p, propertyName: `${propertyName}[${i}]` })
    );
  }

  const msgFromConfig = config.messages?.number?.positive;

  if (property < 0) {
    const defaultMessage = `Only positive values are allowed, but received value is "${property}"`;
    throw new ValidationError(propertyName, customMessage ?? msgFromConfig ?? defaultMessage);
  }
};

export const integerValidator: BaseValidator = (payload) => {
  const { property, propertyName, customMessage, config, optional } = payload;

  if (optional && property === undefined) {
    return;
  }

  if (property && Array.isArray(property)) {
    return property.forEach((p, i) =>
      integerValidator({ ...payload, property: p, propertyName: `${propertyName}[${i}]` })
    );
  }

  const msgFromConfig = config.messages?.number?.integer;

  if (property % 1 !== 0) {
    const defaultMessage = `Only integer values are allowed, but received value is "${property}"`;
    throw new ValidationError(propertyName, customMessage ?? msgFromConfig ?? defaultMessage);
  }
};

export const floatValidator: BaseValidator = (payload) => {
  const { property, propertyName, customMessage, config, optional } = payload;

  if (optional && property === undefined) {
    return;
  }

  if (property && Array.isArray(property)) {
    return property.forEach((p, i) =>
      floatValidator({ ...payload, property: p, propertyName: `${propertyName}[${i}]` })
    );
  }

  const msgFromConfig = config.messages?.number?.float;

  if (property % 1 === 0) {
    const defaultMessage = `Only float values are allowed, but received value is "${property}"`;
    throw new ValidationError(propertyName, customMessage ?? msgFromConfig ?? defaultMessage);
  }
};

export const lessThanValidator: DependOnValidator = (payload) => {
  const { property, propertyName, data, targetPropertyName, customMessage, config, allowUndefined } = payload;

  if (property === undefined && allowUndefined) {
    return;
  }

  if (property && Array.isArray(property)) {
    const targetIsArray = data[targetPropertyName] && Array.isArray(data[targetPropertyName]);
    return property.forEach((p, i) =>
      lessThanValidator({
        ...payload,
        property: p,
        propertyName: `${propertyName}[${i}]`,
        data: { [targetPropertyName]: targetIsArray ? data[targetPropertyName][i] : data[targetPropertyName] }
      })
    );
  }

  const msgFromConfig = config.messages?.number?.lessThan;

  if (property >= data[targetPropertyName] || property === undefined) {
    const defaultMessage = `Must be less than "${targetPropertyName}" property value, but received value "${property}" is more or equal to "${data[targetPropertyName]}"`;
    throw new ValidationError(propertyName, customMessage ?? msgFromConfig ?? defaultMessage);
  }
};

export const moreThanValidator: DependOnValidator = (payload) => {
  const { property, propertyName, data, targetPropertyName, customMessage, config, allowUndefined } = payload;

  if (property === undefined && allowUndefined) {
    return;
  }

  if (property && Array.isArray(property)) {
    const targetIsArray = data[targetPropertyName] && Array.isArray(data[targetPropertyName]);
    return property.forEach((p, i) =>
      moreThanValidator({
        ...payload,
        property: p,
        propertyName: `${propertyName}[${i}]`,
        data: { [targetPropertyName]: targetIsArray ? data[targetPropertyName][i] : data[targetPropertyName] }
      })
    );
  }

  const msgFromConfig = config.messages?.number?.moreThan;

  if (property <= data[targetPropertyName] || property === undefined) {
    const defaultMessage = `Must be more than "${targetPropertyName}" property value, but received value "${property}" is less or equal to "${data[targetPropertyName]}"`;
    throw new ValidationError(propertyName, customMessage ?? msgFromConfig ?? defaultMessage);
  }
};
