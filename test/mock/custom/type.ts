import { Validation } from './../../../src/decorators/index';

interface SomeNonPrimitiveSctructure {
  a: string;
  b: number;
  c: boolean;
}

enum SomeEnum {
  A = 'a',
  B = 'b',
}

@Validation()
export class ClassWithNonPrimitiveProperty {
  public someProperty?: SomeNonPrimitiveSctructure;
}

@Validation()
export class ClassWithEnumProperty {
  public someProperty?: SomeEnum;
}
