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

    const filePath = path.resolve(config.outputPath);
    const fileName = buildOutputFileName(name);

    const importMap = buildBaseImportMap({ isConfigFileExists });
    const handleImportAdd = (targetPath: string, clause: string): void => {
      const importPath = targetPath.indexOf('/') > -1 ? path.relative(filePath, targetPath) : targetPath;
      if (!importMap[importPath]) {
        importMap[importPath] = {};
      }
      importMap[importPath][clause] = true;
    };

    const configFilePath = isConfigFileExists ? path.relative(filePath, path.resolve(configFileName)) : undefined;

    const validations: PreparedValidation[] = [];
    classes.forEach((cls) => {
      const validation = buildValidationFromClassMetadata({
        cls,
        clsFileName: name,
        addImport: handleImportAdd,
        config
      });
      if (validation) {
        handleImportAdd(name, cls.name);
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

const buildOutputFileName = (inputFileName: string): string => {
  return path.relative(process.cwd(), inputFileName).replace(/\s/g, '_').replace(/\/+/g, '.');
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
