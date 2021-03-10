import { PartialMessageMap } from '../localization/model';
import { MessageMap } from '../localization/model';

export enum SeverityLevel {
  silence = 0,
  warning = 1,
  error = 2
}

export type UserContext = any;

export interface CodegenConfig {
  inputPath: string;
  outputPath: string;
  unknownPropertySeverityLevel: SeverityLevel;
}

export type PartialCodegenConfig = Partial<CodegenConfig>;

export interface ValidationConfig<C extends UserContext> {
  stopAtFirstError: boolean;
  emailRegExp: RegExp;
  messages?: MessageMap;
  context?: C;
}

export type PartialValidationConfig<C extends UserContext> = Partial<
  Omit<ValidationConfig<C>, 'messages'> & { messages: PartialMessageMap }
>;

export type GenerateValidatorConfig<C extends UserContext> = CodegenConfig & ValidationConfig<C>;

export type PartialGenerateValidatorConfig<C extends UserContext> = PartialCodegenConfig & PartialValidationConfig<C>;
