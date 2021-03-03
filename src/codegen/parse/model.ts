import { ValidationType } from '../../validators/model';
import { Decorator } from 'ts-file-parser';

export interface ClassFieldTypeMetadata {
  validationType: ValidationType;
  referencePath?: string;
  name?: string;
}

export interface ClassFieldMetadata {
  name: string;
  type: ClassFieldTypeMetadata;
  optional: boolean;
  decorators: Decorator[];
}

export interface ClassMetadata {
  name: string;
  decorators: Decorator[];
  fields: ClassFieldMetadata[];
}

export interface InputFileMetadata {
  name: string;
  classes: ClassMetadata[];
}

export interface CustomTypeEntry {
  fileIndex: number;
  classIndex: number;
  fieldIndex: number;
}

export type EnumDictionary = { [file: string]: string[] };
