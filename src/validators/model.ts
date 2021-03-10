import { Message } from '../localization/model';
import { UserContext, GenerateValidatorConfig } from '../config/model';
import { Data } from '../codegen/model';

export enum ValidationType {
  number = 'number',
  string = 'string',
  boolean = 'boolean',
  enum = 'enum',
  unknown = 'unknown',
  notSupported = 'notSupported'
}

export const primitiveValidationTypes = [ValidationType.boolean, ValidationType.number, ValidationType.string] as const;
export type PrimitiveValidationType = typeof primitiveValidationTypes[number];

export enum CommonValidator {
  type = 'type',
  custom = 'custom',
  equal = 'equal',
  equalTo = 'equalTo'
}

export enum NumberValidator {
  min = 'min',
  max = 'max',
  negative = 'negative',
  positive = 'positive',
  integer = 'integer',
  float = 'float',
  lessThan = 'lessThan',
  moreThan = 'moreThan'
}

export enum StringValidator {
  trim = 'trim',
  lowercase = 'lowercase',
  uppercase = 'uppercase',
  minLength = 'minLength',
  maxLength = 'maxLength',
  email = 'email',
  url = 'url',
  match = 'match'
}

export type BooleanValidator = CommonValidator;

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
  // Reason for eslint disable: Record<string, never> behavior is not equal to {} behavior
  // eslint-disable-next-line @typescript-eslint/ban-types
  EP extends {} = {},
  D extends Data = Data,
  P extends keyof D = keyof D,
  C extends UserContext = UserContext
> = (payload: ValidatorPayload<EP, D, P, C>) => void;

export type RequiredOneOfValidatorPayload<D extends Data> = { fields: (keyof D)[] };

export type RequiredOneOfValidator<
  D extends Data = Data,
  P extends keyof D = keyof D,
  C extends UserContext = UserContext
> = BaseValidator<RequiredOneOfValidatorPayload<D>, D, P, C>;

export type CustomValidationFunction = <D extends Data, P extends keyof D, C extends UserContext>(
  payload: Omit<BaseValidatorPayload<D, P, C>, 'customMessage'> & { context: C }
) => ReturnType<BaseValidator> | Promise<ReturnType<BaseValidator>>;

export type CustomValidatorPayload<C extends UserContext> = {
  context: C;
  customValidationFunction: CustomValidationFunction;
};

export type CustomValidator<
  D extends Data = Data,
  P extends keyof D = keyof D,
  C extends UserContext = UserContext
> = BaseValidator<CustomValidatorPayload<C>, D, P, C>;

export type EnumDescription = Record<string, any>;

export type TypeValidatorPayload = {
  type: ValidationType;
  typeDescription?: EnumDescription;
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

export type DependOnValidatorPayload<D extends Data> = {
  targetPropertyName: keyof D;
};

export type DependOnValidator<
  D extends Data = Data,
  P extends keyof D = keyof D,
  C extends UserContext = UserContext
> = BaseValidator<DependOnValidatorPayload<D>, D, P, C>;

export type ThresholdValidatorPayload = {
  threshold: number;
};

export type ThresholdValidator<
  D extends Data = Data,
  P extends keyof D = keyof D,
  C extends UserContext = UserContext
> = BaseValidator<ThresholdValidatorPayload, D, P, C>;

export type MatchValidatorPayload = {
  regexp: RegExp;
};

export type MatchValidator<
  D extends Data = Data,
  P extends keyof D = keyof D,
  C extends UserContext = UserContext
> = BaseValidator<MatchValidatorPayload, D, P, C>;
