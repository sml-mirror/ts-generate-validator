import { cutFileExt, hasFileExt, isPackagePath, normalizeFileExt } from './../../utils/path';
import { IgnoreValidation } from './../../decorators/index';
import { IssueError, ErrorInFile } from './../utils/error';
import { ValidationType } from './../../validators/model';
import { buildClassesMetadata } from './classes';
import { parseStruct, ImportNode } from 'ts-file-parser';
import * as fs from 'fs';
import * as path from 'path';
import {
  InputFileMetadata,
  CustomTypeEntry,
  EnumDictionary,
  ImportMetadata,
  InputFileDesc,
  ClassMetadata
} from './model';

export const parseInputFiles = (files: string[]): InputFileMetadata[] => {
  const inputFiles: InputFileDesc[] = files.map((f) => ({ path: f, parseClasses: true }));
  const metadata: InputFileMetadata[] = [];
  const customTypeEntries: CustomTypeEntry[] = [];
  const enumDictionary: EnumDictionary = {};

  do {
    const inputFileDesc = inputFiles.shift();

    if (!inputFileDesc) {
      break;
    }

    const content = fs.readFileSync(path.resolve(process.cwd(), normalizeFileExt(inputFileDesc.path)), 'utf-8');
    const structure = parseStruct(content, {}, inputFileDesc.path);

    if (structure.enumDeclarations.length) {
      enumDictionary[inputFileDesc.path] = structure.enumDeclarations.map((decl) => decl.name);
    }

    const imports = buildImportsMetadata(structure._imports);
    // console.log(imports);
    imports.forEach((imp) => {
      const isAlreadyParsed = metadata.some((m) => m.name === imp.absPath);
      if (inputFileDesc.parseClasses && !isAlreadyParsed && !isPackagePath(imp.absPath)) {
        // console.log('SEARCH FOR ENUMS:', imp.absPath, normalizeFileExt(imp.absPath));
        inputFiles.push({ path: imp.absPath, parseClasses: false });
      }
    });

    const classes: ClassMetadata[] = [];
    if (inputFileDesc.parseClasses && structure.classes.length) {
      const classesMetadata = buildClassesMetadata(metadata.length, structure.classes, structure._imports);
      if (classesMetadata.classesForValidation.length) {
        customTypeEntries.push(...classesMetadata.customTypeEntries);
        classes.push(...classesMetadata.classesForValidation);
      }
    }

    metadata.push({
      name: structure.name,
      classes,
      imports,
      functions: structure.functions.map(({ name, isExport }) => ({ name, isExported: isExport }))
    });
  } while (inputFiles.length);

  console.log(JSON.stringify(enumDictionary, null, 2));
  console.log(
    JSON.stringify(
      metadata
        .find((m) => m.name === 'model.ts')
        ?.classes.find((c) => c.name === 'TypeValidatorOnImportedEnumPropertyType'),
      null,
      2
    )
  );

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
  return nodes.map(({ clauses, absPathString }) => {
    return {
      clauses,
      absPath: path.relative(process.cwd(), path.resolve(absPathString))
    };
  });
};
