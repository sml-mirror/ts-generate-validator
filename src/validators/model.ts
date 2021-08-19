import { GeneratedValidation } from './../codegen/model';
import { Message } from '../localization/model';
import { UserContext, ValidationConfig } from '../config/model';
import { Data } from '../codegen/model';

export enum ValidationType {
  number = 'number',
  bigInt = 'bigint',
  string = 'string',
  boolean = 'boolean',
  null = 'null',
  enum = 'enum',
  union = 'union',
  array = 'array',
  nested = 'nested',
  unknown = 'unknown',
  notSupported = 'notSupported'
}

export const primitiveValidationTypes = [
  ValidationType.boolean,
  ValidationType.number,
  ValidationType.string,
  ValidationType.null
] as const;
export type PrimitiveValidationType = typeof primitiveValidationTypes[number];

export enum CommonValidator {
  type = 'type',
  custom = 'custom',
  equal = 'equal',
  equalTo = 'equalTo',
  requiredOneOf = 'requiredOneOf',
  date = 'date'
}

export enum NumberValidator {
  min = 'min',
  max = 'max',
  negative = 'negative',
  positive = 'positive',
  integer = 'integer',
  bigInt = 'bigInt',
  notBigInt = 'notBigInt',
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
  optional?: boolean;
  config: ValidationConfig;
  context?: C;
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
  payload: Omit<BaseValidatorPayload<D, P, C>, 'customMessage'>
) => ReturnType<BaseValidator> | Promise<ReturnType<BaseValidator>>;

export type CustomValidatorPayload = {
  customValidationFunction: CustomValidationFunction;
};

export type CustomValidator<D extends Data = Data, P extends keyof D = keyof D, C extends UserContext = UserContext> = (
  ...args: Parameters<BaseValidator<CustomValidatorPayload, D, P, C>>
) => ReturnType<BaseValidator> | Promise<ReturnType<BaseValidator>>;

export type EnumDescription = Record<string, any>;

export type TypeValidatorPayload =
  | {
      type: Exclude<
        ValidationType,
        ValidationType.enum | ValidationType.nested | ValidationType.array | ValidationType.union
      >;
      typeName?: string;
      typeDescription?: undefined;
    }
  | {
      type: ValidationType.enum;
      typeName?: string;
      typeDescription: EnumDescription;
    }
  | {
      type: ValidationType.nested;
      typeName?: string;
      typeDescription: GeneratedValidation;
    }
  | {
      type: ValidationType.array;
      typeName?: string;
      typeDescription: TypeValidatorPayload;
    }
  | {
      type: ValidationType.union;
      typeName?: string;
      typeDescription: TypeValidatorPayload[];
    };

export type TypeValidator<D extends Data = Data, P extends keyof D = keyof D, C extends UserContext = UserContext> = (
  ...args: Parameters<BaseValidator<TypeValidatorPayload, D, P, C>>
) => ReturnType<BaseValidator> | Promise<ReturnType<BaseValidator>>;

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
  allowUndefined?: boolean;
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
