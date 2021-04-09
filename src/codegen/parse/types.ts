import { normalizePath } from './../../utils/path';
import * as path from 'path';
import { FieldModel, ImportNode, TypeKind, UnionType, ArrayType } from 'ts-file-parser';
import { ValidationType } from '../../validators/model';
import { ClassFieldTypeMetadata } from './model';
import { primitiveValidationTypes } from '../../validators/model';

export const buildFieldTypeMetadata = (
  field: FieldModel,
  onCustomTypeFound: () => void,
  imports: ImportNode[]
): ClassFieldTypeMetadata => {
  const fieldTypeModel = field.type as any;
  let onCustomTypeFoundCalled = false;
  const fieldType: ClassFieldTypeMetadata = {
    validationType: ValidationType.unknown
  };

  if (fieldTypeModel) {
    fieldType.validationType = getValidationTypeByTypeDesc(fieldTypeModel);

    const buildTypeMetadata = (typeModel: Record<string, any>): Omit<ClassFieldTypeMetadata, 'unionTypes'> => {
      const type: ClassFieldTypeMetadata = {
        name: typeModel.typeName ?? 'undefined',
        validationType: getValidationTypeByTypeDesc(typeModel)
      };

      if (fieldType.validationType === ValidationType.unknown) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const externalPath = findExternalPathForCustomType(type.name!, imports);
        const resultPath =
          externalPath ?? (fieldTypeModel.modulePath ? path.resolve(fieldTypeModel.modulePath) : undefined);

        if (resultPath) {
          type.referencePath = normalizePath(path.relative(process.cwd(), resultPath));
        }

        if (!onCustomTypeFoundCalled) {
          onCustomTypeFound();
          onCustomTypeFoundCalled = true;
        }
      }

      return type;
    };

    if (fieldType.validationType === ValidationType.union) {
      fieldType.name = ValidationType.union;
      fieldType.unionTypes = (fieldTypeModel as UnionType).options.map(buildTypeMetadata);
    } else if (fieldType.validationType === ValidationType.array) {
      fieldType.name = ValidationType.array;
      fieldType.arrayOf = buildTypeMetadata((fieldTypeModel as ArrayType).base);
    } else {
      return buildTypeMetadata(fieldTypeModel);
    }
  } else {
    if (!field.valueConstraint.isCallConstraint) {
      const typeName = typeof field.valueConstraint.value;
      fieldType.name = typeName;
      fieldType.validationType = getValidationTypeByTypeDesc({ typeName });
    }
  }

  return fieldType;
};

export const getValidationTypeByTypeDesc = (typeDesc: Record<string, any>): ValidationType => {
  const typeKind: TypeKind = typeDesc.typeKind;

  if (typeKind === TypeKind.BASIC) {
    const typeName: string = typeDesc.typeName;

    if (primitiveValidationTypes.includes(typeName as any)) {
      return <ValidationType>typeName;
    }

    const notSupportedTypes = ['undefined', 'symbol', 'function', 'object'];
    if (notSupportedTypes.includes(typeName)) {
      return ValidationType.notSupported;
    }
  }

  if (typeKind === TypeKind.ARRAY) {
    return ValidationType.array;
  }

  if (typeKind === TypeKind.UNION) {
    return ValidationType.union;
  }

  return ValidationType.unknown;
};

export const findExternalPathForCustomType = (typeName: string, imports: ImportNode[]): string | undefined => {
  const foundImport = imports.find(({ clauses }) => {
    return clauses.includes(typeName);
  });

  if (foundImport) {
    return foundImport.absPathString;
  }
};
