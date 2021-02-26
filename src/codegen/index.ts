import { parseInputFiles } from './parse';
import { getAllFiles } from './utils/getAllFiles';
import { getCodegenConfig } from './../config/codegen';

export const createValidators = () => {
  const config = getCodegenConfig();
  const inputFiles = getAllFiles(config.inputPath);
  const inputFilesMetadata = parseInputFiles(inputFiles);

  // TODO: implement
};
