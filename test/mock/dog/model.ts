import {
  MinLengthValidation,
  MaxLengthValidation,
  MinValidation,
  MaxValidation,
  IntegerValidation,
  LessThanValidation
} from './../../../src/decorators/index';
import { User } from 'test/mock/user/model';
import { Validation } from 'src/decorators';

@Validation
export class Dog {
  @MinLengthValidation(5)
  @MaxLengthValidation(20)
  public name = '';

  @MinValidation(2, 'only dogs over 2 years old are accepted')
  @MaxValidation(16, "dogs can't live that long")
  @IntegerValidation('age must be an integer value')
  public age = 0;

  @LessThanValidation('age', "dog can't be owned by anyone longer than his age")
  public ownedYears = 0;

  public owner?: typeof User;
}
