import { ValidationType } from '../../validators/model';

export const getValidationTypeByTypeName = (typeName: string): ValidationType => {
  const primitiveTypes = [ValidationType.boolean, ValidationType.number, ValidationType.string] as string[];
  if (primitiveTypes.includes(typeName)) {
    return <ValidationType>typeName;
  }

  const notSupportedTypes = ['null', 'undefined', 'symbol', 'function', 'object'];
  if (notSupportedTypes.includes(typeName)) {
    return ValidationType.notSupported;
  }

  return ValidationType.unknown;
};
