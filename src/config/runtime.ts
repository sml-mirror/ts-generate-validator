import { mergeDeep } from '../utils/deepValue';
import { PartialValidationConfig, ValidationConfig } from '../config/model';
import { defaultRuntimeConfig } from './default';

let globalConfig = defaultRuntimeConfig;

export const changeConfig = (config: PartialValidationConfig): void => {
  globalConfig = mergeDeep({}, globalConfig, config) as ValidationConfig;
};

export const getConfig = (): Readonly<ValidationConfig> => globalConfig;
