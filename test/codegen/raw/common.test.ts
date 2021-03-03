import { parseInputFiles } from '../../../src/codegen/parse/index';
import * as path from 'path';
import { getAllFiles } from '../../../src/codegen/utils/getAllFiles';
import { getCodegenConfig } from '../../../src/config/codegen';
import { deleteConfigFile, createConfigFile } from '../../utils/config';

describe('codegen/raw/common', () => {
  const prevRootDir = process.cwd();

  beforeAll(() => {
    const testRootDir = process.cwd() + '/test/mock/raw/common';
    process.chdir(testRootDir);
    createConfigFile({
      inputPath: '.'
    });
  });

  afterAll(() => {
    deleteConfigFile();
    process.chdir(prevRootDir);
  });

  test('parse metadata', () => {
    const config = getCodegenConfig();
    const inputFiles = getAllFiles(path.resolve(config.inputPath));
    const inputFilesMetadata = parseInputFiles(inputFiles);

    expect(inputFilesMetadata).toMatchSnapshot('parseMetadata');
  });
});
