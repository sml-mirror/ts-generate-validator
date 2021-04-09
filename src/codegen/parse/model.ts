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

export interface ImportMetadata {
  clauses: string[];
  absPath: string;
}

export interface FunctionMetadata {
  name: string;
  isExported: boolean;
}

export interface InputFileMetadata {
  name: string;
  classes: ClassMetadata[];
  imports: ImportMetadata[];
  functions: FunctionMetadata[];
}

export interface CustomTypeEntry {
  fileIndex: number;
  classIndex: number;
  fieldIndex: number;
}

export type EnumDictionary = { [file: string]: string[] };
