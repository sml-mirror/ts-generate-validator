import { outWarning } from './../codegen/utils/error';
import { getSanitizedObjectCopy, isObject } from './../utils/object';
import { getEnumValues } from './../utils/enum';
import { CodegenConfig, PartialCodegenConfig, SeverityLevel, codegenConfigKeys } from './model';
import { defaultCodegenConfig } from './default';
import { mergeDeep } from './../utils/deepValue';
import * as fs from 'fs';
import * as path from 'path';

export const configFileName = 'ts-generate-validator-config.json';

const getConfigFromFile = (): Record<string, any> => {
  const configFilePath = path.resolve(process.cwd(), configFileName);

  if (!fs.existsSync(configFilePath)) {
    return {};
  }
  try {
    const parsedData = JSON.parse(fs.readFileSync(configFilePath, 'utf8'));

    if (!isObject(parsedData)) {
      throw new Error();
    }

    return parsedData;
  } catch (err) {
    outWarning(
      `Error when reading config from file "${configFileName}". Make sure the file has correct syntax. Using default config...`
    );
    return {};
  }
};

export const getCodegenConfig = (): CodegenConfig => {
  const configFromFile = getConfigFromFile();
  const sanitizedConfig = getSanitizedObjectCopy<PartialCodegenConfig>(configFromFile, codegenConfigKeys);

  if (sanitizedConfig.hasOwnProperty('inputPath')) {
    if (typeof sanitizedConfig.inputPath !== 'string') {
      outWarning(
        `File "${configFileName}" has wrong configuration. Property "inputPath" is not a valid path. Using default value "${defaultCodegenConfig.inputPath}".`
      );
      delete sanitizedConfig.inputPath;
    }
  }

  if (sanitizedConfig.hasOwnProperty('outputPath')) {
    if (typeof sanitizedConfig.outputPath !== 'string') {
      outWarning(
        `File "${configFileName}" has wrong configuration. Property "outputPath" is not a valid path. Using default value "${defaultCodegenConfig.outputPath}".`
      );
      delete sanitizedConfig.inputPath;
    }
  }

  if (sanitizedConfig.hasOwnProperty('unknownPropertySeverityLevel')) {
    const possibleValues = getEnumValues(SeverityLevel);
    if (!possibleValues.includes(String(sanitizedConfig.unknownPropertySeverityLevel))) {
      outWarning(
        `File "${configFileName}" has wrong configuration. Property "unknownPropertySeverityLevel" must be one of "${possibleValues.join(
          ', '
        )}", but recieved "${sanitizedConfig.unknownPropertySeverityLevel}". Using default value "${
          defaultCodegenConfig.unknownPropertySeverityLevel
        }".`
      );
      delete sanitizedConfig.unknownPropertySeverityLevel;
    }
  }

  return mergeDeep({}, defaultCodegenConfig, sanitizedConfig) as CodegenConfig;
};
