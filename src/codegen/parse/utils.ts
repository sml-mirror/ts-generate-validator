import { ValidationType } from '../../validators/model';

export const isPrimitiveType = (typeName: string): boolean => {
  const primitiveTypes = [ValidationType.boolean, ValidationType.number, ValidationType.string] as string[];
  return primitiveTypes.includes(typeName);
};
