import { keys } from 'ts-transformer-keys';
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

export const codegenConfigKeys = keys<CodegenConfig>();

export interface ValidationConfig {
  stopAtFirstError: boolean;
  emailRegExp: RegExp;
  messages?: MessageMap;
}

export type PartialValidationConfig = Partial<Omit<ValidationConfig, 'messages'> & { messages: PartialMessageMap }>;
