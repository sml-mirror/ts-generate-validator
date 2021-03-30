import { createConfigFile, deleteConfigFile } from './utils/config';
import { PartialCodegenConfig, SeverityLevel } from './../src/config/model';
import { defaultCodegenConfig } from './../src/config/default';
import { mergeDeep } from './../src/utils/deepValue';
import { getCodegenConfig } from './../src/config/codegen';

const testConfigs: PartialCodegenConfig[] = [
  {
    inputPath: 'mock/'
  },
  {
    outputPath: 'gen/test-validators'
  },
  {
    unknownPropertySeverityLevel: SeverityLevel.error
  }
];

describe('configuration', () => {
  const prevRootDir = process.cwd();

  beforeAll(() => {
    const testRootDir = process.cwd() + '/test';
    process.chdir(testRootDir);
  });

  afterAll(() => {
    process.chdir(prevRootDir);
  });

  test('getCodegenConfig - file not exists', () => {
    expect(getCodegenConfig()).toEqual(defaultCodegenConfig);
  });

  testConfigs.forEach((config, index) => {
    test(`getCodegenConfig - config #${index}`, () => {
      createConfigFile(config);

      const actual = getCodegenConfig();
      const expected = mergeDeep({}, defaultCodegenConfig, config);

      expect(actual).toEqual(expected);

      deleteConfigFile();
    });
  });
});
