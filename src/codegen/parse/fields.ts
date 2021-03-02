import * as path from 'path';
import { isPrimitiveType } from './utils';
import { ValidationType } from '../../validators/model';
import { BasicType, FieldModel, ImportNode } from 'ts-file-parser';
import { ClassFieldMetadata, ClassFieldTypeMetadata } from './model';

export const buildClassFieldsMetadata = (
  fields: FieldModel[],
  onPossibleEnumTypeFound: (fieldIndex: number) => void,
  imports: ImportNode[]
): ClassFieldMetadata[] => {
  return fields.map((field, fieldIndex) => {
    const { name, optional, decorators } = field;
    const fieldType = field.type as BasicType;
    const type: ClassFieldTypeMetadata = {
      validationType: ValidationType.unknown
    };
    const fieldMetadata = {
      name,
      optional,
      type,
      decorators
    };

    if (!fieldType) {
      return fieldMetadata;
    }

    if (isPrimitiveType(fieldType.typeName)) {
      type.validationType = fieldType.typeName as ValidationType;
    } else {
      if (fieldType.typeName) {
        const externalPath = findExternalPathForType(fieldType.typeName, imports);
        type.name = fieldType.typeName;
        type.referencePath = externalPath ?? fieldType.modulePath;
        onPossibleEnumTypeFound(fieldIndex);
      }
    }

    return fieldMetadata;
  });
};

const findExternalPathForType = (typeName: string, imports: ImportNode[]): string | null => {
  const foundImport = imports.find(({ clauses }) => {
    return clauses.includes(typeName);
  });

  if (foundImport) {
    return path.resolve(...foundImport.absPathNode);
  }

  return null;
};
