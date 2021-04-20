import { IssueError } from './../utils/error';
import { allowedFileExt } from './../model';
import { normalizePath, cutFileExt, isPackagePath } from './../../utils/path';
import { buildValidationFromClassMetadata } from './validation';
import {
  PreparedDataItem,
  PreparedValidation,
  PreparedImportMap,
  PreparedImport,
  AsyncValidationsMap,
  NestedValidationItemEntry,
  HandleAsyncValidationAdd,
  HandleNestedValidationAdd
} from './model';
import * as path from 'path';
import { InputFileMetadata } from '../parse/model';
import { CodegenConfig } from '../../config/model';
import * as pkg from '../../../package.json';

export const prepareDataForRender = (
  inputFilesMetadata: InputFileMetadata[],
  config: CodegenConfig
): PreparedDataItem[] => {
  const preparedData: PreparedDataItem[] = [];
  const asyncValidationsMap: AsyncValidationsMap = {};
  const nestedValidationEntries: NestedValidationItemEntry[] = [];

  const addAsyncValidationToMap = (filePath: string, validationIndex: number, validationName: string) => {
    if (!asyncValidationsMap[filePath]) {
      asyncValidationsMap[filePath] = [];
    }
    asyncValidationsMap[filePath].push({
      validationIndex,
      validationName
    });
  };

  inputFilesMetadata.forEach((metadata) => {
    const { name, classes, imports: inputFileImportsMetadata, functions: inputFileFunctionsMetadata } = metadata;
    const inputFilePath = cutFileExt(name);

    const filePath = buildOutputFilePath({ inputFileName: name, config });
    const fileName = buildOutputFileName(name);
    const filePathAbs = `${filePath}/${fileName}`;

    const importMap = buildBaseImportMap();
    const handleImportAdd = (targetPath: string, clause: string, isPackageName?: boolean): void => {
      if (isClauseExistsInImportsMap(clause, importMap)) {
        return;
      }

      isPackageName = isPackageName ?? isPackagePath(targetPath);
      let importPath = targetPath;

      if (!isPackageName) {
        const importPathAbs = normalizePath(path.relative(process.cwd(), importPath));

        if (filePathAbs === importPathAbs) {
          return;
        }

        importPath = normalizeImportPathForFile(filePath, targetPath);
      }

      if (!importMap[importPath]) {
        importMap[importPath] = {};
      }

      importMap[importPath][clause] = true;
    };

    const validations: PreparedValidation[] = [];
    const handleAsyncValidationAdd: HandleAsyncValidationAdd = (validationName) => {
      const validationIndex = validations.length;
      const asyncValidationFilePath = `${filePath}/${fileName}`;
      addAsyncValidationToMap(asyncValidationFilePath, validationIndex, validationName);
    };
    const handleNestedValidationAdd: HandleNestedValidationAdd = ({
      validationName,
      validationItemIndex,
      nestedValidationName,
      nestedValidationFilePath
    }) => {
      const dataItemIndex = preparedData.length;
      const validationIndex = validations.length;

      const nestedValidationEntry = nestedValidationEntries.find(
        (entry) =>
          entry.dataItemIndex === dataItemIndex &&
          entry.validationIndex === validationIndex &&
          entry.validationItemIndex === validationItemIndex
      );

      if (nestedValidationEntry) {
        if (
          !nestedValidationEntry.nestedValidations.find(
            (nv) => nv.filePath === nestedValidationFilePath && nv.name === nestedValidationName
          )
        ) {
          nestedValidationEntry.nestedValidations.push({
            filePath: nestedValidationFilePath,
            name: nestedValidationName
          });
        }
        return;
      }

      nestedValidationEntries.push({
        dataItemIndex,
        validationName,
        validationIndex,
        validationItemIndex,
        nestedValidations: [
          {
            filePath: nestedValidationFilePath,
            name: nestedValidationName
          }
        ]
      });
    };

    classes.forEach((cls) => {
      const validation = buildValidationFromClassMetadata({
        cls,
        clsFileName: name,
        addImport: handleImportAdd,
        inputFileImportsMetadata,
        inputFileFunctionsMetadata,
        inputFilePath,
        config,
        handleAsyncValidationAdd,
        handleNestedValidationAdd
      });
      if (validation) {
        handleImportAdd(path.resolve(name), cls.name, false);
        validations.push(validation);
      }
    });

    const imports = buildImportsFromMap(importMap);

    if (validations.length) {
      preparedData.push({
        filePath,
        fileName,
        imports,
        validations
      });
    }
  });

  // Process nested validation entries for possible async inheritance
  if (nestedValidationEntries.length) {
    const pessimisticMaxIterationCount = nestedValidationEntries.length;
    let iterationCounter = 0;

    while (nestedValidationEntries.length) {
      // While loop fuse
      iterationCounter++;
      if (iterationCounter > pessimisticMaxIterationCount) {
        throw new IssueError(
          `Max iteration count is reached, but checking nested validations prepared data for possible async inheritance is not complete.`
        );
      }

      EntriesWalking: for (let entryIndex = 0; entryIndex < nestedValidationEntries.length; entryIndex++) {
        const entry = nestedValidationEntries[entryIndex];

        // Check if nested validation also has nested validations
        for (const nVal of entry.nestedValidations) {
          if (nestedValidationEntries.find((e) => e.validationName === nVal.name)) {
            continue EntriesWalking;
          }
        }

        // Check if nested validation is async
        for (const nVal of entry.nestedValidations) {
          const isAnyOfNestedValidationsAsync = asyncValidationsMap[nVal.filePath]?.find(
            (aVal) => aVal.validationName === nVal.name
          );

          if (isAnyOfNestedValidationsAsync) {
            const dataItem = preparedData[entry.dataItemIndex];

            dataItem.validations[entry.validationIndex].items[entry.validationItemIndex].async = true;
            dataItem.validations[entry.validationIndex].async = true;

            addAsyncValidationToMap(
              `${dataItem.filePath}/${dataItem.fileName}`,
              entry.validationIndex,
              entry.validationName
            );
          }

          nestedValidationEntries.splice(entryIndex, 1);
          break EntriesWalking;
        }
      }
    }
  }

  return preparedData;
};

const isClauseExistsInImportsMap = (targetClause: string, importMap: PreparedImportMap): boolean => {
  return Object.values(importMap).some((clauses) =>
    Object.entries(clauses).some(([clause, isActive]) => isActive && clause === targetClause)
  );
};

const normalizeImportPathForFile = (filePath: string, importPath: string): string => {
  let resultPath = normalizePath(path.relative(filePath, importPath));
  if (!resultPath.startsWith('./')) {
    resultPath = `./${resultPath}`;
  }
  if (resultPath.match(new RegExp(`\\.(${allowedFileExt.join('|')})$`))) {
    resultPath = cutFileExt(resultPath);
  }
  return resultPath;
};

export const buildOutputFilePath = ({ config }: { inputFileName: string; config: CodegenConfig }): string => {
  let result = path.resolve(process.cwd(), config.outputPath);
  result = path.relative(process.cwd(), result);
  return normalizePath(result);
};

export const buildOutputFileName = (inputFileName: string): string => {
  const pathToInputFileFromRoot = path.relative(process.cwd(), inputFileName);
  return (
    cutFileExt(pathToInputFileFromRoot)
      .replace(/\s/g, '_')
      .replace(/[/\\]+/g, '.') + '.ts'
  );
};

const buildBaseImportMap = (): PreparedImportMap => {
  const map: PreparedImportMap = {};
  map[pkg.name] = {
    GeneratedValidation: true,
    ValidationConfig: true,
    PartialValidationConfig: true,
    ValidationError: true,
    ValidationException: true,
    ValidationType: true,
    Data: true,
    UserContext: true,
    getConfig: true,
    mergeDeep: true
  };
  return map;
};

const buildImportsFromMap = (map: PreparedImportMap): PreparedImport[] => {
  return Object.keys(map).map((path) => ({
    clauses: Object.keys(map[path])
      .filter((clause) => map[path][clause])
      .join(', '),
    path
  }));
};
