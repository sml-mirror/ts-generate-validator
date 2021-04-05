import { configFileName } from './../../src/config/codegen';
import * as fs from 'fs';
import { PartialCodegenConfig } from './../../src/config/model';

const getConfigFileName = (): string => {
  return `${process.cwd()}/${configFileName}`;
};

export const createConfigFile = (config: PartialCodegenConfig): void => {
  fs.writeFileSync(getConfigFileName(), JSON.stringify(config, null, 2));
};

export const deleteConfigFile = (): void => {
  fs.unlinkSync(getConfigFileName());
};
