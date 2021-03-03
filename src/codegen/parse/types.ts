import { stripFileExt } from './../../utils/path';
import { getValidationTypeByTypeName } from './utils';
import * as path from 'path';
import { FieldModel, BasicType, ImportNode } from 'ts-file-parser';
import { ValidationType } from '../../validators/model';
import { InputFileMetadata, EnumDictionary, CustomTypeEntry, ClassFieldTypeMetadata } from './model';

export const buildFieldTypeMetadata = (
  field: FieldModel,
  onCustomTypeFound: () => void,
  imports: ImportNode[]
): ClassFieldTypeMetadata => {
  const fieldType = field.type as BasicType | null;
  const type: ClassFieldTypeMetadata = {
    validationType: ValidationType.unknown
  };

  if (fieldType) {
    const typeName = fieldType.typeName ?? 'undefined';
    type.name = typeName;
    type.validationType = getValidationTypeByTypeName(typeName);

    if (type.validationType === ValidationType.unknown) {
      const externalPath = findExternalPathForCustomType(typeName, imports);
      type.referencePath =
        externalPath ?? fieldType.modulePath ? stripFileExt(path.resolve(fieldType.modulePath)) : undefined;

      onCustomTypeFound();
    }
  } else {
    if (!field.valueConstraint.isCallConstraint) {
      const typeName = typeof field.valueConstraint.value;
      type.name = typeName;
      type.validationType = getValidationTypeByTypeName(typeName);
    }
  }

  return type;
};

export const findExternalPathForCustomType = (typeName: string, imports: ImportNode[]): string | undefined => {
  const foundImport = imports.find(({ clauses }) => {
    return clauses.includes(typeName);
  });

  if (foundImport) {
    return path.resolve(...foundImport.absPathNode);
  }
};

export const resolveCustomTypes = (
  metadata: InputFileMetadata[],
  enumDictionary: EnumDictionary,
  possibleEnumTypes: CustomTypeEntry[]
): void => {
  possibleEnumTypes.forEach(({ fileIndex, classIndex, fieldIndex }) => {
    const fieldTypeMetadata = metadata[fileIndex].classes[classIndex].fields[fieldIndex].type;

    // Trying to fix empty referencePath -> set to current file with model class
    if (!fieldTypeMetadata.referencePath) {
      fieldTypeMetadata.referencePath = metadata[fileIndex].name;
    }

    const { referencePath, name } = fieldTypeMetadata;
    if (referencePath && name && enumDictionary[referencePath]?.includes(name)) {
      fieldTypeMetadata.validationType = ValidationType.enum;
    } else {
      fieldTypeMetadata.validationType = ValidationType.notSupported;
    }
  });
};
