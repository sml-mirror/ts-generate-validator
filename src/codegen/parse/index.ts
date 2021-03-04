import { ValidationType } from './../../validators/model';
import { stripFileExt } from './../../utils/path';
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

export const resolveCustomTypes = (
  metadata: InputFileMetadata[],
  enumDictionary: EnumDictionary,
  possibleEnumTypes: CustomTypeEntry[]
): void => {
  possibleEnumTypes.forEach(({ fileIndex, classIndex, fieldIndex }) => {
    const fieldTypeMetadata = metadata[fileIndex].classes[classIndex].fields[fieldIndex].type;

    // Trying to fix empty referencePath -> set to current file with model class
    if (!fieldTypeMetadata.referencePath) {
      fieldTypeMetadata.referencePath = metadata[fileIndex].name;
    }

    const { referencePath, name } = fieldTypeMetadata;
    if (referencePath && name && enumDictionary[referencePath]?.includes(name)) {
      fieldTypeMetadata.validationType = ValidationType.enum;
    } else {
      fieldTypeMetadata.validationType = ValidationType.notSupported;
    }
  });
};
