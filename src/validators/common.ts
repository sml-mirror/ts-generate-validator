import { TypeValidation } from './../decorators/index';
import { decoratorNameToValidationItemData } from './../codegen/prepare/validationItem';
import { ValidationError } from './../codegen/utils/error';
import { AllowedCommonValidators } from './../localization/model';
import { PartialValidationConfig } from '../../src/config/model';
import { IssueError } from './../codegen/utils/error';
import { getEnumValues } from './../utils/enum';
import {
  TypeValidator,
  TypeValidatorPayload,
  CustomValidator,
  primitiveValidationTypes,
  EqualValidator,
  DependOnValidator,
  ValidationType,
  RequiredOneOfValidator,
  CommonValidator
} from './model';

const getMessageFromConfig = (
  type: string,
  validatorName: AllowedCommonValidators,
  config: PartialValidationConfig
): string | undefined => {
  const messageMapSection = primitiveValidationTypes.find((t) => t === type);

  if (!messageMapSection) {
    return undefined;
  }

  return config?.messages?.[messageMapSection]?.[validatorName] ?? config?.messages?.common?.[validatorName];
};

export const requiredOneOfValidator: RequiredOneOfValidator = ({ data, fields, customMessage, config }) => {
  const msgFromConfig = config.messages?.common.requiredOneOf;

  if (!fields.find((field) => Boolean(data[field] !== undefined && data[field] !== null))) {
    const defaultMessage = `At least one of the fields must be filled, but all fields are empty (${fields.join(', ')})`;
    throw new ValidationError(fields.join(', '), customMessage ?? msgFromConfig ?? defaultMessage);
  }
};

export const typeValidator: TypeValidator = ({
  property,
  propertyName,
  type,
  typeDescription,
  context,
  customMessage,
  config,
  ...rest
}) => {
  const propertyType = property === null ? 'null' : typeof property;
  const msgFromConfig = getMessageFromConfig(type, CommonValidator.type, config);

  if (type === ValidationType.union) {
    if (!typeDescription || !Array.isArray(typeDescription)) {
      throw new IssueError(
        `Error: "typeDescription" is invalid or not provided for union type validation (propertyName: "${propertyName}")`
      );
    }

    for (const unionTypeDesc of typeDescription) {
      try {
        typeValidator({
          property,
          propertyName,
          type: unionTypeDesc.type,
          typeDescription: unionTypeDesc.typeDescription,
          context,
          customMessage,
          config,
          ...rest
        } as Parameters<TypeValidator>[0]);
        // If validation succeed -> return
        return;
      } catch (err) {
        // Do nothing
      }
    }

    const defaultMessage = `Must be one of the following types: ${typeDescription
      .map((desc) => desc.type)
      .join(', ')}. But recieved property value is none of them.`;
    throw new ValidationError(propertyName, customMessage ?? msgFromConfig ?? defaultMessage);
  }

  if (type === ValidationType.array) {
    if (!property || !Array.isArray(property)) {
      const defaultMessage = `Must be an array, but received value type is "${propertyType}"`;
      throw new ValidationError(propertyName, customMessage ?? msgFromConfig ?? defaultMessage);
    }

    property.forEach((item) =>
      typeValidator({
        property: item,
        propertyName,
        type: (typeDescription as TypeValidatorPayload).type,
        typeDescription: (typeDescription as TypeValidatorPayload).typeDescription,
        context,
        customMessage,
        config,
        ...rest
      } as Parameters<TypeValidator>[0])
    );
  }

  if (type === ValidationType.enum) {
    if (!typeDescription || typeof typeDescription !== 'object') {
      throw new IssueError(`Type description for "${type}" type not provided.`);
    }

    const possibleValues = getEnumValues(typeDescription);
    if (!possibleValues.includes(property)) {
      const defaultMessage = `Must be a "${type}" member. Received value is "${property}" (expected one of: ${possibleValues.join(
        ', '
      )}`;
      throw new ValidationError(propertyName, customMessage ?? msgFromConfig ?? defaultMessage);
    }
    return;
  }

  if (type === ValidationType.nested) {
    if (!typeDescription || typeof typeDescription !== 'function') {
      throw new IssueError(`Type description for "${type}" type not provided.`);
    }

    typeDescription(property, config, context);
    return;
  }

  if (!primitiveValidationTypes.includes(type as any)) {
    throw new Error(
      `Unexpected type to check - "${type}" (expected one of: ${decoratorNameToValidationItemData[
        TypeValidation.name
      ].allowedValidationTypes
        .map((t) => `"${t}"`)
        .join(', ')})`
    );
  }

  if (type !== propertyType) {
    const defaultMessage = `Must be a "${type}", but received a "${propertyType}"`;
    throw new ValidationError(propertyName, customMessage ?? msgFromConfig ?? defaultMessage);
  }

  if (type === 'number' && isNaN(property)) {
    const defaultMessage = `Must be a "${type}", but received a "NaN" (Not a number)`;
    throw new ValidationError(propertyName, customMessage ?? msgFromConfig ?? defaultMessage);
  }
};

export const customValidator: CustomValidator = ({ customValidationFunction, ...rest }) => {
  customValidationFunction({ ...rest });
};

export const equalValidator: EqualValidator = ({ property, propertyName, value, customMessage, config }) => {
  const msgFromConfig = getMessageFromConfig(typeof property, CommonValidator.equal, config);

  if (property !== value) {
    const defaultMessage = `Must be equal to "${value}", but received "${property}"`;
    throw new ValidationError(propertyName, customMessage ?? msgFromConfig ?? defaultMessage);
  }
};

export const equalToValidator: DependOnValidator = ({
  property,
  propertyName,
  targetPropertyName,
  data,
  customMessage,
  config
}) => {
  const msgFromConfig = getMessageFromConfig(typeof property, CommonValidator.equalTo, config);

  if (property !== data[targetPropertyName]) {
    const defaultMessage = `Must be equal to a property "${targetPropertyName}" (expected: "${data[targetPropertyName]}", received: "${property}")`;
    throw new ValidationError(propertyName, customMessage ?? msgFromConfig ?? defaultMessage);
  }
};
