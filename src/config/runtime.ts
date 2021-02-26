import { mergeDeep } from '../utils/deepValue';
import { PartialValidationConfig, UserContext, GenerateValidatorConfig } from 'src/config/model';
import { defaultConfig } from './default';

let globalConfig = defaultConfig;

export const changeConfig = <C extends UserContext = UserContext>(config: PartialValidationConfig<C>) => {
  globalConfig = mergeDeep({}, globalConfig, config) as GenerateValidatorConfig<C>;
};

export const getConfig = (): Readonly<typeof globalConfig> => globalConfig;
