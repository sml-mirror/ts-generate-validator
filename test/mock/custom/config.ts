import { CustomValidation, Validation, EmailValidation, MinLengthValidation } from '../../../src/decorators/index';

@Validation({
  stopAtFirstError: true,
})
export class CustomConfigStopAtFirstError {
  @CustomValidation(() => false, 'This message always appears')
  public someProperty?: number;
}

@Validation({
  emailRegExp: /^email$/,
})
export class CustomConfigEmailRegExp {
  @EmailValidation()
  public someProperty?: string;
}

@Validation({
  messages: {
    string: {
      minLength: 'custom string minLength message',
    },
  },
})
export class CustomMessages {
  @MinLengthValidation(2)
  public someProperty: string = '';
}

@Validation({
  context: { a: { b: true } },
})
export class CustomConfigContext {
  @CustomValidation(({ context }) => {
    if (!(context as any)?.a?.b) {
      return false;
    }
    return true;
  }, 'This message must be unreachable')
  public someProperty?: number;
}
