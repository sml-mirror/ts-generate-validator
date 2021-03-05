import { prepareDataForRender } from './prepare';
import * as path from 'path';
import { parseInputFiles } from './parse';
import { getAllFiles } from './utils/getAllFiles';
import { getCodegenConfig } from './../config/codegen';

export const createValidators = (): void => {
  const config = getCodegenConfig();
  const inputFiles = getAllFiles(path.resolve(config.inputPath));
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const inputFilesMetadata = parseInputFiles(inputFiles);

  // // TODO: remove
  // console.log(
  //   JSON.stringify(
  //     inputFilesMetadata.filter((m) => m.name === path.resolve('mock/user/model.ts')),
  //     null,
  //     2
  //   )
  // );

  const dataForRender = prepareDataForRender(inputFilesMetadata, config);

  // TODO: remove
  console.log(JSON.stringify(dataForRender, null, 2));
};
