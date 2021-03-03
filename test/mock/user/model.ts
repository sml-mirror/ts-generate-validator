import { UserType } from './type/model';
import {
  EmailValidation,
  EqualValidation,
  FloatValidation,
  IntegerValidation,
  LessThanValidation,
  LowercaseValidation,
  MatchValidation,
  MaxLengthValidation,
  MaxValidation,
  MinLengthValidation,
  MinValidation,
  PositiveValidation,
  RequiredOneOfValidation,
  TrimValidation,
  UppercaseValidation,
  UrlValidation,
  Validation
} from '../../../src/decorators/index';

@Validation
@RequiredOneOfValidation(['email, phone'])
export class User {
  @MinLengthValidation(2)
  @MaxLengthValidation(50)
  @TrimValidation()
  public name: string = '';

  @MinLengthValidation(2, 'surname length must be more then 2 letters')
  @MaxLengthValidation(50, 'surname length must be less then 50 letters')
  @TrimValidation('there should be no spaces at the beginning and at the end of surname')
  public surname: string = '';

  @MinValidation(18)
  @MaxValidation(60)
  @IntegerValidation()
  public age: number = 0;

  @LessThanValidation('age')
  @PositiveValidation()
  public workExperience: number = 0;

  @EqualValidation(true)
  public isActive: boolean = false;

  @EmailValidation()
  public email?: string;

  @MatchValidation(/^\d{10}$/)
  public phone?: string;

  @UrlValidation()
  public website?: string;

  @LowercaseValidation()
  @MinLengthValidation(5)
  @MaxLengthValidation(20)
  public nickname: string = '';

  @UppercaseValidation()
  public cardHolderName: string = '';

  @FloatValidation()
  public insuranceRatio: number = 1.0;

  public userType?: UserType;
}
