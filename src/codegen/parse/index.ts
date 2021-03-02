import { stripFileExt } from './../../utils/path';
import { fillEnumTypes } from './enums';
import { buildClassesMetadata } from './classes';
import { parseStruct } from 'ts-file-parser';
import * as fs from 'fs';
import { InputFileMetadata, PossibleEnumTypeEntry, EnumDictionary } from './model';

export const parseInputFiles = (files: string[]): InputFileMetadata[] => {
  const metadata: InputFileMetadata[] = [];
  const possibleEnumTypes: PossibleEnumTypeEntry[] = [];
  const enumDictionary: EnumDictionary = {};

  files.forEach((file, fileIndex) => {
    const content = fs.readFileSync(file, 'utf-8');
    const structure = parseStruct(content, {}, file);

    // TODO: remove
    if (file === 'mock/user/model.ts') {
      console.log(JSON.stringify(structure._imports, null, 2));
    }

    if (structure.enumDeclarations.length) {
      enumDictionary[stripFileExt(file)] = structure.enumDeclarations.map((decl) => decl.name);
    }

    if (structure.classes.length) {
      const classesMetadata = buildClassesMetadata(fileIndex, structure.classes, structure._imports);
      if (classesMetadata.classesForValidation.length) {
        possibleEnumTypes.push(...classesMetadata.possibleEnumTypes);
        metadata.push({
          name: structure.name,
          classes: classesMetadata.classesForValidation
        });
      }
    }
  });

  fillEnumTypes(metadata, enumDictionary, possibleEnumTypes);

  return metadata;
};
