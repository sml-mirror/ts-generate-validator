import { Message } from 'src/localization/model';
import { UserContext, ValidationConfig } from 'src/config/model';

export type Data = Record<string, any>;

export enum GeneratedValidationParameter {
  data = 'data',
  config = 'config'
}

export type GeneratedValidationPayload<D extends Data, C extends UserContext> = {
  [GeneratedValidationParameter.data]: D;
  [GeneratedValidationParameter.config]?: ValidationConfig<C>;
};

export type GeneratedValidation = <D extends Data, C extends UserContext>(
  payload: GeneratedValidationPayload<D, C>
) => void | Promise<void>;

export interface ValidationError<D extends Data> {
  field: keyof D | (keyof D)[];
  message: Message;
}

export interface ValidationException<D extends Data> {
  errors: ValidationError<D>[];
}
