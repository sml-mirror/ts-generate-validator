import { createValidators } from './../src/codegen/index';

test('createValidators', () => {
  process.chdir(process.cwd() + '/test');

  createValidators();

  expect(1).toEqual(1);
});
