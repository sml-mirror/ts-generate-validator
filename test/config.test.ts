import { createConfigFile, deleteConfigFile } from './utils/config';
import { PartialGenerateValidatorConfig, UserContext, SeverityLevel } from './../src/config/model';
import { defaultConfig } from './../src/config/default';
import { mergeDeep } from './../src/utils/deepValue';
import { getCodegenConfig } from './../src/config/codegen';

const testConfigs: PartialGenerateValidatorConfig<UserContext>[] = [
  {
    inputPath: 'mock/'
  },
  {
    outputPath: 'gen/test-validators'
  },
  {
    unknownPropertySeverityLevel: SeverityLevel.error
  },
  {
    stopAtFirstError: true
  },
  {
    messages: {
      number: {
        type: 'test'
      }
    }
  }
];

describe('configuration', () => {
  const prevRootDir = process.cwd();
  const testRootDir = process.cwd() + '/test';
  process.chdir(testRootDir);

  console.log(process.cwd());
  // TODO: fix
  // test('getCodegenConfig - file not exists', () => {
  //   expect(getCodegenConfig()).toEqual(defaultConfig);
  // });

  testConfigs.forEach((config, index) => {
    test(`getCodegenConfig - config #${index}`, () => {
      createConfigFile(config);

      const actual = getCodegenConfig();
      const expected = mergeDeep({}, defaultConfig, config);

      expect(actual).toEqual(expected);

      deleteConfigFile();
    });
  });

  process.chdir(prevRootDir);
});
