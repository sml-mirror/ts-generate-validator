import { Message } from 'src/localization/model';
import { UserContext, GenerateValidatorConfig } from 'src/config/model';
import { Data } from 'src/codegen/model';

export enum ValidationType {
  number = 'number',
  string = 'string',
  boolean = 'boolean',
  enum = 'enum',
  custom = 'custom',
  unknown = 'unknown',
  notSupported = 'notSupported'
}

export const primitiveValidationTypes = [ValidationType.boolean, ValidationType.number, ValidationType.string] as const;
export type PrimitiveValidationType = typeof primitiveValidationTypes[number];

export enum NumberValidator {
  type = 'type',
  custom = 'custom',
  min = 'min',
  max = 'max',
  equal = 'equal',
  negative = 'negative',
  positive = 'positive',
  integer = 'integer',
  float = 'float',
  lessThan = 'lessThan',
  moreThan = 'moreThan',
  equalTo = 'equalTo'
}

export enum StringValidator {
  type = 'type',
  custom = 'custom',
  trim = 'trim',
  lowercase = 'lowercase',
  uppercase = 'uppercase',
  minLength = 'minLength',
  maxLength = 'maxLength',
  email = 'email',
  url = 'url',
  match = 'match',
  equal = 'equal',
  equalTo = 'equalTo'
}

export enum BooleanValidator {
  type = 'type',
  custom = 'custom',
  equal = 'equal',
  equalTo = 'equalTo'
}

export interface BaseValidatorPayload<D extends Data, P extends keyof D, C extends UserContext> {
  property: D[P];
  propertyName: P;
  data: D;
  config: GenerateValidatorConfig<C>;
  customMessage?: Message;
}

export type ValidatorPayload<
  EP extends Record<string, any>,
  D extends Data,
  P extends keyof D,
  C extends UserContext
> = BaseValidatorPayload<D, P, C> & EP;

export type BaseValidator<
  EP extends Record<string, any> = Record<string, never>,
  D extends Data = Data,
  P extends keyof D = keyof D,
  C extends UserContext = UserContext
> = (payload: ValidatorPayload<EP, D, P, C>) => void;

export type CustomValidatorPayload<C extends UserContext> = { context: C };

export type CustomValidator = <D extends Data = Data, P extends keyof D = keyof D, C extends UserContext = UserContext>(
  payload: ValidatorPayload<CustomValidatorPayload<C>, D, P, C>
) =>
  | ReturnType<BaseValidator<CustomValidatorPayload<C>, D, P, C>>
  | Promise<ReturnType<BaseValidator<CustomValidatorPayload<C>, D, P, C>>>;

export type TypeValidatorPayload = {
  type: ValidationType;
};

export type TypeValidator<
  D extends Data = Data,
  P extends keyof D = keyof D,
  C extends UserContext = UserContext
> = BaseValidator<TypeValidatorPayload, D, P, C>;

export type EqualValidatorPayload<D extends Data> = {
  value: D[keyof D];
};

export type EqualValidator<
  D extends Data = Data,
  P extends keyof D = keyof D,
  C extends UserContext = UserContext
> = BaseValidator<EqualValidatorPayload<D>, D, P, C>;

export type EqualToValidatorPayload<D extends Data> = {
  targetPropertyName: keyof D;
};

export type EqualToValidator<
  D extends Data = Data,
  P extends keyof D = keyof D,
  C extends UserContext = UserContext
> = BaseValidator<EqualToValidatorPayload<D>, D, P, C>;
