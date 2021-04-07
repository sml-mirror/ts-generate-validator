import { cutFileExt, hasFileExt } from './../../utils/path';
import { IgnoreValidation } from './../../decorators/index';
import { IssueError, ErrorInFile } from './../utils/error';
import { ValidationType } from './../../validators/model';
import { buildClassesMetadata } from './classes';
import { parseStruct, ImportNode } from 'ts-file-parser';
import * as fs from 'fs';
import * as path from 'path';
import { InputFileMetadata, CustomTypeEntry, EnumDictionary, ImportMetadata } from './model';

export const parseInputFiles = (files: string[]): InputFileMetadata[] => {
  const metadata: InputFileMetadata[] = [];
  const customTypeEntries: CustomTypeEntry[] = [];
  const enumDictionary: EnumDictionary = {};

  files.forEach((file) => {
    const content = fs.readFileSync(path.resolve(process.cwd(), file), 'utf-8');
    const structure = parseStruct(content, {}, file);

    if (structure.enumDeclarations.length) {
      enumDictionary[file] = structure.enumDeclarations.map((decl) => decl.name);
    }

    if (structure.classes.length) {
      const classesMetadata = buildClassesMetadata(metadata.length, structure.classes, structure._imports);
      if (classesMetadata.classesForValidation.length) {
        customTypeEntries.push(...classesMetadata.customTypeEntries);
        metadata.push({
          name: structure.name,
          classes: classesMetadata.classesForValidation,
          imports: buildImportsMetadata(structure._imports),
          functions: structure.functions.map(({ name, isExport }) => ({ name, isExported: isExport }))
        });
      }
    }
  });

  resolveCustomTypes({ metadata, enumDictionary, customTypeEntries });
  validateNestedClasses({ metadata, customTypeEntries });

  return metadata;
};

export const resolveCustomTypes = ({
  metadata,
  enumDictionary,
  customTypeEntries
}: {
  metadata: InputFileMetadata[];
  enumDictionary: EnumDictionary;
  customTypeEntries: CustomTypeEntry[];
}): void => {
  customTypeEntries.forEach(({ fileIndex, classIndex, fieldIndex }) => {
    const fieldTypeMetadata = metadata[fileIndex].classes[classIndex].fields[fieldIndex].type;

    // Trying to fix empty referencePath -> set to current file with model class
    if (!fieldTypeMetadata.referencePath) {
      fieldTypeMetadata.referencePath = metadata[fileIndex].name;
    }

    const { referencePath, name: typeName } = fieldTypeMetadata;
    if (!referencePath || !typeName) {
      fieldTypeMetadata.validationType = ValidationType.notSupported;
      return;
    }

    if (enumDictionary[referencePath]?.includes(typeName)) {
      fieldTypeMetadata.validationType = ValidationType.enum;
      return;
    }

    const metadataItemWithNestedClass = metadata.find(({ name: fileName, classes }) => {
      let fileNameMatched = true;

      const fileNameHasExt = hasFileExt(fileName);
      const refPathHasExt = hasFileExt(referencePath);

      if (fileNameHasExt === refPathHasExt) {
        fileNameMatched = fileName === referencePath;
      } else {
        fileNameMatched = cutFileExt(fileName) === cutFileExt(referencePath);
      }

      if (!fileNameMatched) {
        return false;
      }

      return Boolean(classes.find(({ name: className }) => className === typeName));
    });
    if (metadataItemWithNestedClass) {
      fieldTypeMetadata.validationType = ValidationType.nested;
      fieldTypeMetadata.referencePath = metadataItemWithNestedClass.name;
      return;
    }

    fieldTypeMetadata.validationType = ValidationType.notSupported;
  });
};

export const validateNestedClasses = ({
  metadata,
  customTypeEntries
}: {
  metadata: InputFileMetadata[];
  customTypeEntries: CustomTypeEntry[];
}): void => {
  customTypeEntries.forEach(({ fileIndex, classIndex, fieldIndex }) => {
    const baseClassName = metadata[fileIndex].classes[classIndex].name;
    const baseClassPath = metadata[fileIndex].name;
    const fieldTypeMetadata = metadata[fileIndex].classes[classIndex].fields[fieldIndex].type;

    if (fieldTypeMetadata.validationType !== ValidationType.nested) {
      return;
    }

    const checkNestedClasses = (className: string, classPath: string) => {
      if (className === baseClassName && classPath === baseClassPath) {
        const fieldName = metadata[fileIndex].classes[classIndex].fields[fieldIndex].name;
        throw new ErrorInFile(
          `Class "${baseClassName}" has circular dependency in field "${fieldName}" with type "${fieldTypeMetadata.name}". Сircular dependencies are not allowed because they lead to infinite validation. Change field type or add "@${IgnoreValidation.name}" decorator.`,
          baseClassPath
        );
      }

      const fileMetadata = metadata.find(({ name: filePath }) => filePath === classPath);
      if (!fileMetadata) {
        throw new IssueError(
          `Referenced file metadata not found for nested class "${className}" (referenced file path: "${classPath}").`
        );
      }

      const classMetadata = fileMetadata.classes.find(({ name }) => name === className);
      if (!classMetadata) {
        throw new IssueError(`Metadata not found for nested class "${className}" in file metadata "${classPath}").`);
      }

      classMetadata.fields.forEach(({ type: { name, validationType, referencePath } }) => {
        if (validationType === ValidationType.nested && name && referencePath) {
          checkNestedClasses(name, referencePath);
        }
      });
    };

    if (fieldTypeMetadata.name && fieldTypeMetadata.referencePath) {
      checkNestedClasses(fieldTypeMetadata.name, fieldTypeMetadata.referencePath);
    }
  });
};

const buildImportsMetadata = (nodes: ImportNode[]): ImportMetadata[] => {
  return nodes.map(({ clauses, absPathNode }) => {
    const pathToFile = absPathNode.join('/');
    return {
      clauses,
      absPath: path.relative(process.cwd(), path.resolve(pathToFile))
    };
  });
};
