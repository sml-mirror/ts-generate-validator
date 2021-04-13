import { PrimitiveValidationType } from './../../validators/model';
import { normalizePath } from './../../utils/path';
import * as path from 'path';
import { FieldModel, ImportNode, TypeKind, UnionType, ArrayType, BasicType } from 'ts-file-parser';
import { ValidationType } from '../../validators/model';
import { ClassFieldTypeMetadata } from './model';
import { primitiveValidationTypes } from '../../validators/model';

type TypeModel = BasicType | ArrayType | UnionType;

export const buildFieldTypeMetadata = (
  field: FieldModel,
  onCustomTypeFound: () => void,
  imports: ImportNode[]
): ClassFieldTypeMetadata => {
  let typeModel = field.type as TypeModel;
  let onCustomTypeFoundCalled = false;

  if (!typeModel) {
    if (field.valueConstraint.isCallConstraint) {
      return {
        validationType: ValidationType.notSupported,
        name: 'function'
      };
    }

    typeModel = {
      typeKind: TypeKind.BASIC,
      typeName: typeof field.valueConstraint.value
    } as BasicType;
  }

  return getValidationTypeByTypeModel(typeModel, imports, () => {
    if (!onCustomTypeFoundCalled) {
      onCustomTypeFound();
      onCustomTypeFoundCalled = true;
    }
  });
};

export const getValidationTypeByTypeModel = (
  typeModel: TypeModel,
  imports: ImportNode[],
  onCustomTypeFound: () => void
): ClassFieldTypeMetadata => {
  if (typeModel.typeKind === TypeKind.BASIC) {
    const _typeModel = typeModel as BasicType;
    let validationType = ValidationType.unknown;
    let referencePath: string | undefined;

    if (primitiveValidationTypes.includes(_typeModel.typeName as any)) {
      validationType = <PrimitiveValidationType>_typeModel.typeName;
    }

    const notSupportedTypes = ['undefined', 'symbol', 'function', 'object'];
    if (notSupportedTypes.includes(_typeModel.typeName) || _typeModel.typeName === 'mock') {
      validationType = ValidationType.notSupported;
    }

    if (validationType === ValidationType.unknown) {
      referencePath = findExternalPathForCustomType(_typeModel.typeName, imports);

      if (!referencePath ?? _typeModel.modulePath) {
        referencePath = path.resolve(_typeModel.modulePath);
      }

      if (referencePath) {
        referencePath = normalizePath(path.relative(process.cwd(), referencePath));
      }

      onCustomTypeFound();
    }

    return {
      validationType,
      name: _typeModel.typeName,
      referencePath
    };
  }

  if (typeModel.typeKind === TypeKind.ARRAY) {
    const _typeModel = typeModel as ArrayType;
    return {
      validationType: ValidationType.array,
      arrayOf: getValidationTypeByTypeModel(_typeModel.base as TypeModel, imports, onCustomTypeFound)
    };
  }

  if (typeModel.typeKind === TypeKind.UNION) {
    const _typeModel = typeModel as UnionType;
    return {
      validationType: ValidationType.union,
      unionTypes: _typeModel.options.map((opt) => {
        return getValidationTypeByTypeModel(opt as TypeModel, imports, onCustomTypeFound);
      })
    };
  }

  return {
    validationType: ValidationType.notSupported
  };
};

export const findExternalPathForCustomType = (typeName: string, imports: ImportNode[]): string | undefined => {
  const foundImport = imports.find(({ clauses }) => {
    return clauses.includes(typeName);
  });

  if (foundImport) {
    return foundImport.absPathString;
  }
};
