import { cutFileExt, hasFileExt, isPackagePath, normalizeFileExt, normalizePath } from './../../utils/path';
import { IgnoreValidation } from './../../decorators/index';
import { IssueError, ErrorInFile, outWarning } from './../utils/error';
import { ValidationType } from './../../validators/model';
import { buildClassesMetadata } from './classes';
import { parseStruct, ImportNode } from 'ts-file-parser';
import * as fs from 'fs';
import * as path from 'path';
import {
  InputFileMetadata,
  ClassFieldTypeMetadata,
  ClassFieldBasicTypeMetadata,
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

    const inputFilePath = path.resolve(process.cwd(), normalizeFileExt(inputFileDesc.path));
    let content: string;
    try {
      content = fs.readFileSync(inputFilePath, 'utf-8');
    } catch (err) {
      outWarning(`Failed to read input file "${inputFilePath}" -> skip (${err.message})`);
      continue;
    }
    const structure = parseStruct(content, {}, inputFileDesc.path);

    if (structure.enumDeclarations.length) {
      enumDictionary[inputFileDesc.path] = structure.enumDeclarations.map((decl) => decl.name);
    }

    const imports = buildImportsMetadata(structure._imports);
    imports.forEach((imp) => {
      const isAlreadyParsed = metadata.some((m) => m.name === imp.absPath);
      if (inputFileDesc.parseClasses && !isAlreadyParsed && !isPackagePath(imp.absPath)) {
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
      functions: structure.functions.map(({ name, isExport, isAsync }) => ({ name, isExported: isExport, isAsync }))
    });
  } while (inputFiles.length);

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

    const resolveBasicType = (typeMetadata: ClassFieldBasicTypeMetadata): void => {
      if (typeMetadata.validationType !== ValidationType.unknown) {
        return;
      }

      // Trying to fix empty referencePath -> set to current file with model class
      if (!typeMetadata.referencePath) {
        typeMetadata.referencePath = metadata[fileIndex].name;
      }

      const { referencePath, name: typeName } = typeMetadata;
      if (!referencePath || !typeName) {
        typeMetadata.validationType = ValidationType.notSupported;
        return;
      }

      if (enumDictionary[referencePath]?.includes(typeName)) {
        typeMetadata.validationType = ValidationType.enum;
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
        typeMetadata.validationType = ValidationType.nested;
        typeMetadata.referencePath = metadataItemWithNestedClass.name;
        return;
      }

      typeMetadata.validationType = ValidationType.notSupported;
    };

    const resolveAnyType = (typeMetadata: ClassFieldTypeMetadata): void => {
      if (typeMetadata.validationType === ValidationType.array) {
        return resolveAnyType(typeMetadata.arrayOf);
      }
      if (typeMetadata.validationType === ValidationType.union) {
        return typeMetadata.unionTypes.forEach(resolveAnyType);
      }
      return resolveBasicType(typeMetadata);
    };

    resolveAnyType(fieldTypeMetadata);
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

    const checkBasicType = (typeMetadata: ClassFieldBasicTypeMetadata): void => {
      if (typeMetadata.validationType !== ValidationType.nested) {
        return;
      }

      const checkNestedClasses = (className: string, classPath: string) => {
        if (className === baseClassName && classPath === baseClassPath) {
          const fieldName = metadata[fileIndex].classes[classIndex].fields[fieldIndex].name;
          throw new ErrorInFile(
            `Class "${baseClassName}" has circular dependency in field "${fieldName}" with type "${typeMetadata.name}". Сircular dependencies are not allowed because they lead to infinite validation. Change field type or add "@${IgnoreValidation.name}" decorator.`,
            baseClassPath
          );
        }

        const _fileMetadata = metadata.find(({ name: filePath }) => filePath === classPath);
        if (!_fileMetadata) {
          throw new IssueError(
            `Referenced file metadata not found for nested class "${className}" (referenced file path: "${classPath}").`
          );
        }

        const _classMetadata = _fileMetadata.classes.find(({ name }) => name === className);
        if (!_classMetadata) {
          throw new IssueError(`Metadata not found for nested class "${className}" in file metadata "${classPath}").`);
        }

        _classMetadata.fields.forEach(({ type: _fieldTypeMetadata }) => {
          const _checkBasicType = (_typeMetadata: ClassFieldBasicTypeMetadata): void => {
            const { name: _name, validationType: _validationType, referencePath: _referencePath } = _typeMetadata;

            if (_validationType === ValidationType.nested && _name && _referencePath) {
              checkNestedClasses(_name, _referencePath);
            }
          };

          const _checkAnyType = (_typeMetadata: ClassFieldTypeMetadata): void => {
            if (_typeMetadata.validationType === ValidationType.array) {
              return _checkAnyType(_typeMetadata.arrayOf);
            }
            if (_typeMetadata.validationType === ValidationType.union) {
              return _typeMetadata.unionTypes.forEach(_checkAnyType);
            }
            return _checkBasicType(_typeMetadata);
          };

          _checkAnyType(_fieldTypeMetadata);
        });
      };

      if (typeMetadata.name && typeMetadata.referencePath) {
        checkNestedClasses(typeMetadata.name, typeMetadata.referencePath);
      }
    };

    const checkAnyType = (typeMetadata: ClassFieldTypeMetadata): void => {
      if (typeMetadata.validationType === ValidationType.array) {
        return checkAnyType(typeMetadata.arrayOf);
      }
      if (typeMetadata.validationType === ValidationType.union) {
        return typeMetadata.unionTypes.forEach(checkAnyType);
      }
      return checkBasicType(typeMetadata);
    };

    checkAnyType(fieldTypeMetadata);
  });
};

const buildImportsMetadata = (nodes: ImportNode[]): ImportMetadata[] => {
  return nodes.map(({ clauses, absPathString }) => {
    return {
      clauses,
      absPath: normalizePath(path.relative(process.cwd(), path.resolve(absPathString)))
    };
  });
};
