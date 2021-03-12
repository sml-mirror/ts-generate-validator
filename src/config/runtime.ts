import { mergeDeep } from '../utils/deepValue';
import { PartialValidationConfig, UserContext, GenerateValidatorConfig } from '../config/model';
import { defaultConfig } from './default';

let globalConfig = defaultConfig;
let configInited = false;

export const initConfig = <C extends UserContext = UserContext>(configFromFile: Record<string, any>): void => {
  if (configInited) {
    return;
  }
  configInited = true;
  globalConfig = mergeDeep({}, defaultConfig, configFromFile) as GenerateValidatorConfig<C>;
};

export const changeConfig = <C extends UserContext = UserContext>(config: PartialValidationConfig<C>): void => {
  globalConfig = mergeDeep({}, globalConfig, config) as GenerateValidatorConfig<C>;
};

export const getConfig = <C extends UserContext = UserContext>(): Readonly<GenerateValidatorConfig<C>> => globalConfig;
