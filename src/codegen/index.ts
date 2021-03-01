import { parseInputFiles } from './parse';
import { getAllFiles } from './utils/getAllFiles';
import { getCodegenConfig } from './../config/codegen';

export const createValidators = (): void => {
  const config = getCodegenConfig();
  const inputFiles = getAllFiles(config.inputPath);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const inputFilesMetadata = parseInputFiles(inputFiles);

  // TODO: implement
};
