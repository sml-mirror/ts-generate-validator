import { stripFileExt } from './../../utils/path';
import { resolveCustomTypes } from './types';
import { buildClassesMetadata } from './classes';
import { parseStruct } from 'ts-file-parser';
import * as fs from 'fs';
import { InputFileMetadata, CustomTypeEntry, EnumDictionary } from './model';

export const parseInputFiles = (files: string[]): InputFileMetadata[] => {
  const metadata: InputFileMetadata[] = [];
  const customTypeEntries: CustomTypeEntry[] = [];
  const enumDictionary: EnumDictionary = {};

  files.forEach((file, fileIndex) => {
    const content = fs.readFileSync(file, 'utf-8');
    const structure = parseStruct(content, {}, file);

    if (structure.enumDeclarations.length) {
      enumDictionary[stripFileExt(file)] = structure.enumDeclarations.map((decl) => decl.name);
    }

    if (structure.classes.length) {
      const classesMetadata = buildClassesMetadata(fileIndex, structure.classes, structure._imports);
      if (classesMetadata.classesForValidation.length) {
        customTypeEntries.push(...classesMetadata.customTypeEntries);
        metadata.push({
          name: stripFileExt(structure.name),
          classes: classesMetadata.classesForValidation
        });
      }
    }
  });

  resolveCustomTypes(metadata, enumDictionary, customTypeEntries);

  return metadata;
};
