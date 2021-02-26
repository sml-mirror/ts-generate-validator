import { defaultConfig } from './../src/config/default';
import { mergeDeep } from './../src/utils/deepValue';
import { getCodegenConfig } from './../src/config/codegen';
import configFromFile from './ts-generate-validator-config.json';

test('getCodegenConfig', () => {
  process.chdir(process.cwd() + '/test');

  const actual = getCodegenConfig();
  const expected = mergeDeep({}, defaultConfig, configFromFile);

  expect(actual).toEqual(expected);
});
