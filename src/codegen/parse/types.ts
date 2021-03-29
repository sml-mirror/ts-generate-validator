import { normalizePath } from './../../utils/path';
import { cutFileExt } from '../../utils/path';
import * as path from 'path';
import { FieldModel, BasicType, ImportNode } from 'ts-file-parser';
import { ValidationType } from '../../validators/model';
import { ClassFieldTypeMetadata } from './model';
import { primitiveValidationTypes } from '../../validators/model';

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
      const resultPath =
        externalPath ?? (fieldType.modulePath ? cutFileExt(path.resolve(fieldType.modulePath)) : undefined);

      if (resultPath) {
        type.referencePath = normalizePath(resultPath);
      }

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

export const getValidationTypeByTypeName = (typeName: string): ValidationType => {
  if (primitiveValidationTypes.includes(typeName as any)) {
    return <ValidationType>typeName;
  }

  const notSupportedTypes = ['null', 'undefined', 'symbol', 'function', 'object'];
  if (notSupportedTypes.includes(typeName)) {
    return ValidationType.notSupported;
  }

  return ValidationType.unknown;
};

export const findExternalPathForCustomType = (typeName: string, imports: ImportNode[]): string | undefined => {
  const foundImport = imports.find(({ clauses }) => {
    return clauses.includes(typeName);
  });

  if (foundImport) {
    let result = path.resolve(...foundImport.absPathNode);
    result = cutFileExt(result);
    return result;
  }
};
