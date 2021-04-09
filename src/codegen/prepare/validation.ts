import { buildOutputFileName, buildOutputFilePath } from './index';
import { escapeString } from './../utils/string';
import { decoratorNameToValidationItemData } from './validationItem';
import { handleError, ErrorInFile, IssueError } from './../utils/error';
import { ValidationType } from './../../validators/model';
import { requiredOneOfValidator, typeValidator } from './../../validators/common';
import { RequiredOneOfValidation, CustomValidation, IgnoreValidation, TypeValidation } from './../../decorators/index';
import { PreparedValidationItem, PreparedValidatorPayloadItem } from './model';
import { PreparedValidation } from './model';
import { ClassMetadata } from './../parse/model';
import { CodegenConfig } from './../../config/model';
import * as pkg from '../../../package.json';
import * as path from 'path';

export const buildValidationFromClassMetadata = ({
  cls,
  clsFileName,
  addImport,
  config
}: {
  cls: ClassMetadata;
  clsFileName: string;
  addImport: (path: string, clause: string, isPackageName?: boolean) => void;
  config: CodegenConfig;
}): PreparedValidation | undefined => {
  const name = getValidationName(cls.name);
  const items: PreparedValidationItem[] = [];
  let async = false;

  cls.decorators.forEach(({ name, arguments: args }) => {
    if (name === RequiredOneOfValidation.name) {
      const fields = <Parameters<typeof RequiredOneOfValidation>[0]>args[0];
      const customMessage = <Parameters<typeof RequiredOneOfValidation>[1]>args[1];

      if (!fields.length) {
        return;
      }

      fields.forEach((requiredFieldName) => {
        if (!cls.fields.find(({ name: clsFieldName }) => clsFieldName === requiredFieldName)) {
          throw new ErrorInFile(
            `Class "${cls.name}" has wrong field list in "${RequiredOneOfValidation.name}" decorator. Field "${requiredFieldName}" not exists in class declaration.`,
            clsFileName
          );
        }
      });

      const validatorPayload: PreparedValidatorPayloadItem[] = [
        { property: 'fields', value: `[${fields.map((f) => `'${f}'`).join(', ')}]`, type: 'array' }
      ];

      if (customMessage) {
        validatorPayload.push({ property: 'customMessage', value: escapeString(customMessage), type: 'string' });
      }

      addImport(pkg.name, requiredOneOfValidator.name, true);
      items.push({
        propertyName: fields[0],
        validatorName: requiredOneOfValidator.name,
        validatorPayload
      });
    }
  });

  cls.fields.forEach((clsFieldMetadata) => {
    const { name: fieldName, type: typeMetadata, decorators } = clsFieldMetadata;

    // Ignore validation
    if (decorators.find(({ name: decoratorName }) => decoratorName === IgnoreValidation.name)) {
      return;
    }

    // Not supported validation
    if (typeMetadata.validationType === ValidationType.notSupported) {
      if (!decorators.find(({ name: decoratorName }) => decoratorName === CustomValidation.name)) {
        const error = new ErrorInFile(
          `Failed to create validation for "${cls.name}.${fieldName}". Type "${typeMetadata.name}" is not supported. Change field type or add "${IgnoreValidation.name}" decorator.`,
          clsFileName
        );
        handleError(error.message, config.unknownPropertySeverityLevel);
        return;
      }
    }

    // Type validation
    const { allowedValidationTypes } = decoratorNameToValidationItemData[TypeValidation.name];
    if (allowedValidationTypes.includes(typeMetadata.validationType)) {
      const customMessageForTypeValidator = <Parameters<typeof TypeValidation>[0] | undefined>(
        decorators.find(({ name: decoratorName }) => decoratorName === TypeValidation.name)?.arguments[0]
      );

      const validatorPayload: PreparedValidatorPayloadItem[] = [];
      if (customMessageForTypeValidator) {
        validatorPayload.push({
          property: 'customMessage',
          value: escapeString(customMessageForTypeValidator),
          type: 'string'
        });
      }
      if (
        typeMetadata.validationType === ValidationType.enum ||
        typeMetadata.validationType === ValidationType.nested
      ) {
        if (typeMetadata.referencePath && typeMetadata.name) {
          const refPath = typeMetadata.referencePath;
          const importPath =
            typeMetadata.validationType === ValidationType.nested
              ? `${buildOutputFilePath({ inputFileName: refPath, config })}/${buildOutputFileName(refPath)}`
              : refPath;
          const typeDescription =
            typeMetadata.validationType === ValidationType.nested
              ? getValidationName(typeMetadata.name)
              : typeMetadata.name;

          addImport(path.resolve(importPath), typeDescription, false);

          validatorPayload.push({
            property: 'typeDescription',
            value: typeDescription,
            type: 'object'
          });
        } else {
          throw new IssueError(
            `Failed to create validation for "${cls.name}.${fieldName}" -> "${typeMetadata.validationType}" validation type requires "referencePath" and "name" filled in metadata, but some of them is empty.`
          );
        }
      }

      validatorPayload.push({
        property: 'type',
        value: typeMetadata.validationType,
        type: 'string'
      });

      addImport(pkg.name, typeValidator.name, true);

      items.push({
        propertyName: fieldName,
        validatorName: typeValidator.name,
        validatorPayload
      });
    }

    // Other validations
    decorators.forEach(({ name: decoratorName, arguments: args }) => {
      // Skip TypeValidation decorator
      if (decoratorName === TypeValidation.name) {
        return;
      }

      // Other validations for nested types not allowed
      if (typeMetadata.validationType === ValidationType.nested) {
        throw new ErrorInFile(
          `Decorator "@${decoratorName}" can't be used on "${cls.name}.${fieldName}" of type "${typeMetadata.validationType}". Additional validations for nested types not allowed.`,
          clsFileName
        );
      }

      // Decorator is not for validation -> skip
      if (!decoratorNameToValidationItemData[decoratorName]) {
        return;
      }

      const { validatorName, validatorArgumentNames, allowedValidationTypes } = decoratorNameToValidationItemData[
        decoratorName
      ];

      // Decorator misused
      if (!allowedValidationTypes.includes(typeMetadata.validationType) && decoratorName !== CustomValidation.name) {
        throw new ErrorInFile(
          `Decorator "${validatorName}" can't be used on "${cls.name}.${fieldName}" of type "${
            typeMetadata.validationType
          }" (allowed types: ${allowedValidationTypes.map((v) => `"${v}"`).join(', ')})`,
          clsFileName
        );
      }

      const isAsync = decoratorName === CustomValidation.name && Boolean(args[0].toString().match(/^\s*async/));
      if (isAsync) {
        async = true;
      }

      addImport(pkg.name, validatorName, true);
      items.push({
        propertyName: fieldName,
        validatorName,
        async: isAsync,
        validatorPayload: args.map((arg, index) => {
          const property = validatorArgumentNames[index];
          let type = '';
          let value = arg.toString();

          if (property === 'value') {
            type = typeMetadata.validationType;
          }

          if (['customMessage', 'targetPropertyName'].includes(property)) {
            type = 'string';
          }

          if (type === 'string') {
            value = escapeString(value);
          }

          return {
            property,
            value,
            type
          };
        })
      });
    });
  });

  return {
    name,
    modelClassName: cls.name,
    items,
    async
  };
};

const getValidationName = (className: string): string => {
  return `${className[0].toLocaleLowerCase()}${className.slice(1)}Validator`;
};
