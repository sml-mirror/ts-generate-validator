import { buildFieldTypeMetadata } from './types';
import { FieldModel, ImportNode } from 'ts-file-parser';
import { ClassFieldMetadata, ClassFieldTypeMetadata } from './model';

export const buildClassFieldsMetadata = (
  fields: FieldModel[],
  onCustomTypeFound: (fieldIndex: number) => void,
  imports: ImportNode[]
): ClassFieldMetadata[] => {
  return fields.map((field, fieldIndex) => {
    const { name, optional, decorators } = field;
    const type: ClassFieldTypeMetadata = buildFieldTypeMetadata(field, () => onCustomTypeFound(fieldIndex), imports);

    return {
      name,
      optional,
      type,
      decorators
    };
  });
};
