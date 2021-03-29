import { normalizePath, cutFileExt } from './../../utils/path';
import { configFileExists, configFileName } from './../../config/codegen';
import { buildValidationFromClassMetadata } from './validation';
import { PreparedDataItem, PreparedValidation, PreparedImportMap, PreparedImport } from './model';
import * as path from 'path';
import { GeneratedValidationParameter } from '../model';
import { InputFileMetadata } from '../parse/model';
import { UserContext, GenerateValidatorConfig } from '../../config/model';
import * as pkg from '../../../package.json';

export const prepareDataForRender = <C extends UserContext = UserContext>(
  inputFilesMetadata: InputFileMetadata[],
  config: GenerateValidatorConfig<C>
): PreparedDataItem[] => {
  const isConfigFileExists = configFileExists();
  const validationArgs = GeneratedValidationParameter;

  return inputFilesMetadata.map((metadata) => {
    const { name, classes } = metadata;

    const filePath = buildOutputFilePath({ inputFileName: name, config });
    const fileName = buildOutputFileName(name);

    const importMap = buildBaseImportMap({ isConfigFileExists });
    const handleImportAdd = (targetPath: string, clause: string, isPackageName?: boolean): void => {
      isPackageName = isPackageName ?? targetPath.indexOf('/') < 0;
      const importPath = isPackageName ? targetPath : normalizeImportPathForFile(filePath, targetPath);
      if (!importMap[importPath]) {
        importMap[importPath] = {};
      }
      importMap[importPath][clause] = true;
    };

    const configFilePath = isConfigFileExists
      ? normalizeImportPathForFile(filePath, path.resolve(configFileName))
      : undefined;

    const validations: PreparedValidation[] = [];
    classes.forEach((cls) => {
      const validation = buildValidationFromClassMetadata({
        cls,
        clsFileName: name,
        addImport: handleImportAdd,
        config
      });
      if (validation) {
        handleImportAdd(path.resolve(name), cls.name, false);
        validations.push(validation);
      }
    });

    const imports = buildImportsFromMap(importMap);

    return {
      filePath,
      fileName,
      imports,
      validationArgs,
      validations,
      configFilePath
    };
  });
};

const normalizeImportPathForFile = (filePath: string, importPath: string): string => {
  let resultPath = normalizePath(path.relative(filePath, importPath));
  if (!resultPath.startsWith('./')) {
    resultPath = `./${resultPath}`;
  }
  if (resultPath.match(/\.(ts|tsx|js|jsx)$/)) {
    resultPath = cutFileExt(resultPath);
  }
  return resultPath;
};

export const buildOutputFilePath = <C extends UserContext = UserContext>({
  config
}: {
  inputFileName: string;
  config: GenerateValidatorConfig<C>;
}): string => {
  return path.resolve(config.outputPath);
};

export const buildOutputFileName = (inputFileName: string): string => {
  const pathToInputFileFromRoot = path.relative(process.cwd(), inputFileName);
  return (
    cutFileExt(pathToInputFileFromRoot)
      .replace(/\s/g, '_')
      .replace(/[/\\]+/g, '.') + '.ts'
  );
};

const buildBaseImportMap = ({ isConfigFileExists }: { isConfigFileExists: boolean }): PreparedImportMap => {
  const map: PreparedImportMap = {};
  map[pkg.name] = {
    GeneratedValidation: true,
    GeneratedValidationPayload: true,
    UserContext: true,
    initConfig: isConfigFileExists,
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
