import { configFileName } from './../../src/config/codegen';
import * as fs from 'fs';
import { PartialGenerateValidatorConfig, UserContext } from './../../src/config/model';

const getConfigFileName = (): string => {
  return `${process.cwd()}/${configFileName}`;
};

export const createConfigFile = <C extends UserContext = UserContext>(
  config: PartialGenerateValidatorConfig<C>
): void => {
  fs.writeFileSync(getConfigFileName(), JSON.stringify(config, null, 2));
};

export const deleteConfigFile = (): void => {
  fs.unlinkSync(getConfigFileName());
};
