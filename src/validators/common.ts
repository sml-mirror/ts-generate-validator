import { IssueError } from './../codegen/utils/error';
import { getEnumValues } from './../utils/enum';
import {
  TypeValidator,
  CustomValidator,
  primitiveValidationTypes,
  EqualValidator,
  DependOnValidator,
  ValidationType,
  RequiredOneOfValidator
} from './model';

export const requiredOneOfValidator: RequiredOneOfValidator = ({ data, fields, customMessage }) => {
  if (!fields.find((field) => Boolean(data[field] !== undefined && data[field] !== null))) {
    const defaultMessage = `At least one of the fields must be filled, but all fields are empty (${fields.join(', ')})`;
    throw new Error(customMessage ?? defaultMessage);
  }
};

export const typeValidator: TypeValidator = ({ property, type, typeDescription, customMessage }) => {
  const propertyType = typeof property;

  if (type === ValidationType.enum) {
    if (!typeDescription) {
      throw new IssueError(`Type description for "${type}" type not provided.`);
    }

    const possibleValues = getEnumValues(typeDescription);
    if (!possibleValues.includes(property)) {
      const defaultMessage = `Must be a "${type}" member. Received value is "${property}" (expected one of: ${possibleValues.join(
        ', '
      )}`;
      throw new Error(customMessage ?? defaultMessage);
    }
    return;
  }

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

export const customValidator: CustomValidator = ({ customValidationFunction, ...rest }) => {
  customValidationFunction({ ...rest });
};

export const equalValidator: EqualValidator = ({ property, value, customMessage }) => {
  if (property !== value) {
    const defaultMessage = `Must be equal to "${value}", but received "${property}"`;
    throw new Error(customMessage ?? defaultMessage);
  }
};

export const equalToValidator: DependOnValidator = ({ property, targetPropertyName, data, customMessage }) => {
  if (property !== data[targetPropertyName]) {
    const defaultMessage = `Must be equal to a property "${targetPropertyName}" (expected: "${data[targetPropertyName]}", received: "${property}")`;
    throw new Error(customMessage ?? defaultMessage);
  }
};
