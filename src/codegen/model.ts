import { Message } from 'src/localization/model';
import { UserContext, ValidationConfig } from 'src/config/model';

export type Data = Record<string, any>;

export type GeneratedValidation = <D extends Data, C extends UserContext>(
  data: D,
  config?: ValidationConfig<C>
) => void | Promise<void>;

export interface ValidationError<D extends Data> {
  field: keyof D | (keyof D)[];
  message: Message;
}

export interface ValidationException<D extends Data> {
  errors: ValidationError<D>[];
}
