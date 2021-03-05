import { handleError, FileError, IssueError } from './../utils/error';
import { ValidationType } from './../../validators/model';
import { requiredOneOfValidator, typeValidator } from './../../validators/common';
import { RequiredOneOfValidation, CustomValidation, IgnoreValidation, TypeValidation } from './../../decorators/index';
import { PreparedValidationItem, PreparedValidatorPayloadItem } from './model';
import { PreparedValidation } from './model';
import { ClassMetadata } from './../parse/model';
import { UserContext, GenerateValidatorConfig } from './../../config/model';

export const buildValidationFromClassMetadata = <C extends UserContext = UserContext>({
  cls,
  clsFileName,
  addImport,
  config
}: {
  cls: ClassMetadata;
  clsFileName: string;
  addImport: (path: string, clause: string) => void;
  config: GenerateValidatorConfig<C>;
}): PreparedValidation | undefined => {
  const name = getValidationName(cls.name);
  const items: PreparedValidationItem[] = [];
  // eslint-disable-next-line prefer-const
  let async = false;

  cls.decorators.forEach(({ name, arguments: args }) => {
    if (name === RequiredOneOfValidation.name) {
      const fields = <Parameters<typeof RequiredOneOfValidation>[0]>args[0];
      const customMessage = <Parameters<typeof RequiredOneOfValidation>[1]>args[1];

      fields.forEach((requiredFieldName) => {
        if (!cls.fields.find(({ name: clsFieldName }) => clsFieldName === requiredFieldName)) {
          throw new FileError(
            `Class "${cls.name}" has wrong field list in "${RequiredOneOfValidation.name}" decorator. Field "${requiredFieldName}" not exists in class declaration.`,
            clsFileName
          );
        }
      });

      const validatorPayload: PreparedValidatorPayloadItem[] = [
        { property: 'fields', value: `[${fields.map((f) => `'${f}'`).join(', ')}]` }
      ];

      if (customMessage) {
        validatorPayload.push({ property: 'customMessage', value: customMessage });
      }

      items.push({
        propertyName: fields.join(', '),
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
        handleError(
          `Failed to create validation for "${cls.name}.${fieldName}". Type "${typeMetadata.name}" is not supported. Change field type or add "${IgnoreValidation.name}" decorator.\n\nThe above error was occured in ${clsFileName}`,
          config.unknownPropertySeverityLevel
        );
        return;
      }
    }

    // Type validation
    const customMessageForTypeValidator = <Parameters<typeof TypeValidation>[0] | undefined>(
      decorators.find(({ name: decoratorName }) => decoratorName === TypeValidation.name)?.arguments[0]
    );

    const validatorPayload: PreparedValidatorPayloadItem[] = [];
    if (customMessageForTypeValidator) {
      validatorPayload.push({ property: 'customMessage', value: customMessageForTypeValidator });
    }
    if (typeMetadata.validationType === ValidationType.enum) {
      if (typeMetadata.referencePath && typeMetadata.name) {
        addImport(typeMetadata.referencePath, typeMetadata.name);
        validatorPayload.push({ property: 'typeDescription', value: typeMetadata.name });
      } else {
        throw new IssueError(
          `Failed to create validation for "${cls.name}.${fieldName}". Enum validation type requires "referencePath" and "name" filled in metadata, but some of them is empty.`
        );
      }
    }

    items.push({
      propertyName: fieldName,
      validatorName: typeValidator.name,
      validatorPayload
    });

    // TODO: other decorators applying
  });

  return {
    name,
    items,
    async
  };
};

const getValidationName = (className: string): string => {
  return `${className[0].toLocaleLowerCase()}${className.slice(1)}Validator`;
};
