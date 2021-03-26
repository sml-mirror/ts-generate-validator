import { readAllOutputFiles, removeGeneratedValidators } from './../../utils/output';
import { createValidators } from './../../../src/codegen/index';
import { deleteConfigFile, createConfigFile } from './../../utils/config';

describe('codegen/circularNesting', () => {
  const prevRootDir = process.cwd();

  beforeAll(() => {
    const testRootDir = process.cwd() + '/test/mock/raw/circularNesting';
    process.chdir(testRootDir);
    createConfigFile({
      inputPath: '.'
    });
  });

  afterAll(() => {
    deleteConfigFile();
    process.chdir(prevRootDir);
  });

  test('create validators', async () => {
    await expect(
      (async () => {
        await createValidators();

        readAllOutputFiles(({ file, content }) => {
          expect(content).toMatchSnapshot(`generated validators at "${file}"`);
        });

        removeGeneratedValidators();
      })()
    ).rejects.toThrow('has circular dependency in field');
  });
});
