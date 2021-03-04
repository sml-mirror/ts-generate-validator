import { TypeValidator, primitiveValidationTypes, EqualValidator, EqualToValidator } from './model';

export const typeValidator: TypeValidator = ({ property, type, customMessage }) => {
  const propertyType = typeof property;

  if (!primitiveValidationTypes.includes(type as any)) {
    throw new Error(
      `Unexpected type to check - "${type}" (expected one of: ${primitiveValidationTypes
        .map((t) => `"${t}"`)
        .join(', ')})`
    );
  }

  if (type !== propertyType) {
    const defaultMessage = `Must be a "${type}", but received a "${propertyType}"`;
    throw new Error(customMessage ?? defaultMessage);
  }

  if (type === 'number' && isNaN(property)) {
    const defaultMessage = `Must be a "${type}", but received a "NaN" (Not a number)`;
    throw new Error(customMessage ?? defaultMessage);
  }
};

export const equalValidator: EqualValidator = ({ property, value, customMessage }) => {
  if (property !== value) {
    const defaultMessage = `Must be equal to "${value}", but received "${property}"`;
    throw new Error(customMessage ?? defaultMessage);
  }
};

export const equalToValidator: EqualToValidator = ({ property, targetPropertyName, data, customMessage }) => {
  if (property !== data[targetPropertyName]) {
    const defaultMessage = `Must be equal to a property "${targetPropertyName}" (expected: "${data[targetPropertyName]}", received: "${property}")`;
    throw new Error(customMessage ?? defaultMessage);
  }
};
