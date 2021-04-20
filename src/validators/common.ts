import { promiseAny } from './../utils/promise';
import { ValidationError, ValidationException } from './../codegen/utils/error';
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

export const requiredOneOfValidator: RequiredOneOfValidator = ({
  propertyName,
  data,
  fields,
  customMessage,
  config
}) => {
  const msgFromConfig = config.messages?.common?.requiredOneOf;

  if (!fields.find((field) => Boolean(data[field] !== undefined && data[field] !== null))) {
    const defaultMessage = `At least one of the fields must be filled, but all fields are empty (${fields.join(', ')})`;
    throw new ValidationError(`${propertyName}(${fields.join('|')})`, customMessage ?? msgFromConfig ?? defaultMessage);
  }
};

export const typeValidator: TypeValidator = ({
  property,
  propertyName,
  type,
  typeDescription,
  optional,
  context,
  customMessage,
  config,
  ...rest
}) => {
  if (optional && property === undefined) {
    return;
  }

  const propertyType = property === null ? 'null' : typeof property;
  const msgFromConfig = getMessageFromConfig(type, CommonValidator.type, config);

  if (type === ValidationType.union) {
    if (!typeDescription || !Array.isArray(typeDescription)) {
      throw new IssueError(
        `Error: "typeDescription" is invalid or not provided for union type validation (propertyName: "${propertyName}")`
      );
    }

    let complexTypeCountInUnion = 0;
    let complexTypeErrors: ValidationError[] | undefined;
    let isAnyTypeCheckSucceed: boolean = false;

    const promises: Promise<ReturnType<TypeValidator>>[] = typeDescription
      .map((unionTypeDesc) => {
        const isComplexType = (type: ValidationType): boolean => {
          return [ValidationType.array, ValidationType.nested].includes(type);
        };

        const handleTypeValidationError = (err: any) => {
          let errors: ValidationError[] | undefined;

          if (err instanceof ValidationException) {
            errors = err.errors;
          } else if (err instanceof ValidationError) {
            // There are no complex type validation details -> do nothing
          } else throw err;

          if (isComplexType(unionTypeDesc.type) && errors && !complexTypeErrors) {
            complexTypeErrors = errors;
          }
        };

        if (isComplexType(unionTypeDesc.type)) {
          complexTypeCountInUnion++;
        }

        try {
          const result = typeValidator({
            property,
            propertyName,
            type: unionTypeDesc.type,
            typeDescription: unionTypeDesc.typeDescription,
            context,
            customMessage,
            config,
            ...rest
          } as Parameters<TypeValidator>[0]);

          if (result instanceof Promise) {
            result
              .then(() => {
                isAnyTypeCheckSucceed = true;
              })
              .catch(handleTypeValidationError);
          } else {
            isAnyTypeCheckSucceed = true;
          }

          return result;
        } catch (err) {
          handleTypeValidationError(err);
        }
      })
      .filter((result) => result instanceof Promise) as Promise<ReturnType<TypeValidator>>[];

    const handleUnionValidationFail = () => {
      if (complexTypeCountInUnion === 1 && complexTypeErrors) {
        throw new ValidationException(complexTypeErrors);
      }

      const defaultMessage = `Must be one of the following types: ${typeDescription
        .map((desc) => desc.type)
        .join(', ')}. But recieved property value is none of them.`;
      throw new ValidationError(propertyName, customMessage ?? msgFromConfig ?? defaultMessage);
    };

    if (promises.length) {
      return promiseAny(promises).catch(handleUnionValidationFail);
    }

    if (isAnyTypeCheckSucceed) {
      return;
    }

    handleUnionValidationFail();
  }

  if (type === ValidationType.array) {
    if (!property || !Array.isArray(property)) {
      const defaultMessage = `Must be an array, but received value type is "${propertyType}"`;
      throw new ValidationError(propertyName, customMessage ?? msgFromConfig ?? defaultMessage);
    }

    const promises: Promise<ReturnType<TypeValidator>>[] = property
      .map((item, index) => {
        return typeValidator({
          property: item,
          propertyName: `${propertyName}[${index}]`,
          type: (typeDescription as TypeValidatorPayload).type,
          typeDescription: (typeDescription as TypeValidatorPayload).typeDescription,
          context,
          customMessage,
          config,
          ...rest
        } as Parameters<TypeValidator>[0]);
      })
      .filter((r) => r instanceof Promise) as Promise<ReturnType<TypeValidator>>[];

    if (promises.length) {
      return Promise.all(promises);
    }

    return;
  }

  if (type === ValidationType.enum) {
    if (!typeDescription || typeof typeDescription !== 'object') {
      throw new IssueError(`Type description for "${type}" type not provided.`);
    }

    const possibleValues = getEnumValues(typeDescription);
    if (!possibleValues.includes(String(property))) {
      const defaultMessage = `Must be a "${type}" member. Received value is "${property}" (expected one of: ${possibleValues.join(
        ', '
      )})`;
      throw new ValidationError(propertyName, customMessage ?? msgFromConfig ?? defaultMessage);
    }
    return;
  }

  if (type === ValidationType.nested) {
    if (!typeDescription || typeof typeDescription !== 'function') {
      throw new IssueError(`Type description for "${type}" type not provided.`);
    }

    return typeDescription(property, config, context, `${propertyName}.`);
  }

  if (!primitiveValidationTypes.includes(type as any)) {
    throw new IssueError(
      `Unexpected type to check - "${type}" (expected one of: ${[
        ...primitiveValidationTypes,
        ValidationType.array,
        ValidationType.union,
        ValidationType.nested
      ]
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
  if (rest.optional && rest.property === undefined) {
    return;
  }

  return customValidationFunction({ ...rest });
};

export const equalValidator: EqualValidator = (payload) => {
  const { property, propertyName, value, customMessage, config, optional } = payload;

  if (optional && property === undefined) {
    return;
  }

  if (property && Array.isArray(property)) {
    const valueIsArray = value && Array.isArray(value);
    return property.forEach((p, i) =>
      equalValidator({
        ...payload,
        property: p,
        propertyName: `${propertyName}[${i}]`,
        value: valueIsArray ? value[i] : value
      })
    );
  }

  const msgFromConfig = getMessageFromConfig(typeof property, CommonValidator.equal, config);

  if (property !== value) {
    const defaultMessage = `Must be equal to "${value}", but received "${property}"`;
    throw new ValidationError(propertyName, customMessage ?? msgFromConfig ?? defaultMessage);
  }
};

export const equalToValidator: DependOnValidator = (payload) => {
  const { property, propertyName, targetPropertyName, data, customMessage, config, allowUndefined } = payload;

  if (property === undefined && allowUndefined) {
    return;
  }

  if (property && Array.isArray(property)) {
    const targetIsArray = data[targetPropertyName] && Array.isArray(data[targetPropertyName]);
    return property.forEach((p, i) =>
      equalToValidator({
        ...payload,
        property: p,
        propertyName: `${propertyName}[${i}]`,
        data: { [targetPropertyName]: targetIsArray ? data[targetPropertyName][i] : data[targetPropertyName] }
      })
    );
  }

  const msgFromConfig = getMessageFromConfig(typeof property, CommonValidator.equalTo, config);

  if (property !== data[targetPropertyName]) {
    const defaultMessage = `Must be equal to a property "${targetPropertyName}" (expected: "${data[targetPropertyName]}", received: "${property}")`;
    throw new ValidationError(propertyName, customMessage ?? msgFromConfig ?? defaultMessage);
  }
};
