import { primitiveValidationTypes } from './../../validators/model';
import { ValidationType } from '../../validators/model';

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
