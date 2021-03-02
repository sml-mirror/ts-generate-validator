import { UserContext } from 'src/config/model';
import { Data } from 'src/codegen/model';

export enum ValidationType {
  number = 'number',
  string = 'string',
  boolean = 'boolean',
  enum = 'enum',
  custom = 'custom',
  unknown = 'unknown'
}

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

export interface BaseValidatorPayload<D extends Data, P extends keyof D> {
  property: D[P];
  data: D;
}

export type BaseValidator<D extends Data, P extends keyof D> = (payload: BaseValidatorPayload<D, P>) => boolean;

export interface CustomValidatorPayload<D extends Data, P extends keyof D, C extends UserContext>
  extends BaseValidatorPayload<D, P> {
  context: C;
}

export type CustomValidator = <D extends Data = Data, P extends keyof D = keyof D, C extends UserContext = UserContext>(
  payload: CustomValidatorPayload<D, P, C>
) => ReturnType<BaseValidator<D, P>> | Promise<ReturnType<BaseValidator<D, P>>>;
