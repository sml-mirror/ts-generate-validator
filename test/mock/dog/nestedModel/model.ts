import { Validation } from './../../../../src/decorators/index';

@Validation
export class User {
  public name: string = '';
  public surname: string = '';
}
