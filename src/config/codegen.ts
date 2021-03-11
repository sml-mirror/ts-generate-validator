import { getEnumValues } from './../utils/enum';
import { PartialGenerateValidatorConfig, SeverityLevel } from './model';
import { defaultConfig } from './default';
import { mergeDeep } from './../utils/deepValue';
import * as fs from 'fs';
import { GenerateValidatorConfig, UserContext } from '../config/model';

export const configFileName = 'ts-generate-validator-config.json';

export const configFileExists = (): boolean => {
  return Boolean(Object.keys(getConfigFromFile).length);
};

const getConfigFromFile = (): PartialGenerateValidatorConfig<UserContext> => {
  if (!fs.existsSync(configFileName)) {
    return {};
  }
  try {
    return <PartialGenerateValidatorConfig<UserContext>>JSON.parse(fs.readFileSync(configFileName, 'utf8'));
  } catch (err) {
    console.error(
      `Error when reading config from file "${configFileName}. Make sure the file has correct syntax. Using default config..."`
    );
    return {};
  }
};

export const getCodegenConfig = (): GenerateValidatorConfig<UserContext> => {
  const configFromFile = getConfigFromFile();

  if (configFromFile.hasOwnProperty('unknownPropertySeverityLevel')) {
    const possibleValues = getEnumValues(SeverityLevel);
    if (!possibleValues.includes(String(configFromFile.unknownPropertySeverityLevel))) {
      delete configFromFile.unknownPropertySeverityLevel;
    }
  }

  if (configFromFile.hasOwnProperty('emailRegExp')) {
    if (typeof configFromFile.emailRegExp === 'string' && (configFromFile.emailRegExp as string | undefined)?.length) {
      configFromFile.emailRegExp = new RegExp(configFromFile.emailRegExp);
    } else {
      delete configFromFile.emailRegExp;
    }
  }

  return mergeDeep({}, defaultConfig, configFromFile) as GenerateValidatorConfig<UserContext>;
};
