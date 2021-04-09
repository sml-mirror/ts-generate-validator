import { allowedFileExt } from './../model';
import { normalizePath, cutFileExt, isPackagePath } from './../../utils/path';
import { buildValidationFromClassMetadata } from './validation';
import { PreparedDataItem, PreparedValidation, PreparedImportMap, PreparedImport } from './model';
import * as path from 'path';
import { InputFileMetadata } from '../parse/model';
import { CodegenConfig } from '../../config/model';
import * as pkg from '../../../package.json';

export const prepareDataForRender = (
  inputFilesMetadata: InputFileMetadata[],
  config: CodegenConfig
): PreparedDataItem[] => {
  const preparedData: PreparedDataItem[] = [];

  inputFilesMetadata.forEach((metadata) => {
    const { name, classes, imports: inputFileImportsMetadata, functions: inputFileFunctionsMetadata } = metadata;
    const inputFilePath = cutFileExt(name);

    const filePath = buildOutputFilePath({ inputFileName: name, config });
    const fileName = buildOutputFileName(name);
    const filePathAbs = `${filePath}/${fileName}`;

    const importMap = buildBaseImportMap();
    const handleImportAdd = (targetPath: string, clause: string, isPackageName?: boolean): void => {
      const importPathAbs = path.relative(process.cwd(), targetPath);

      if (filePathAbs === importPathAbs) {
        return;
      }

      isPackageName = isPackageName ?? isPackagePath(targetPath);
      const importPath = isPackageName ? targetPath : normalizeImportPathForFile(filePath, targetPath);

      if (!importMap[importPath]) {
        importMap[importPath] = {};
      }

      importMap[importPath][clause] = true;
    };

    const validations: PreparedValidation[] = [];

    classes.forEach((cls) => {
      const validation = buildValidationFromClassMetadata({
        cls,
        clsFileName: name,
        addImport: handleImportAdd,
        inputFileImportsMetadata,
        inputFileFunctionsMetadata,
        inputFilePath,
        config
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

  return preparedData;
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
    ValidationError: true,
    ValidationException: true,
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
