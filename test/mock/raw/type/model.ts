import { Validation } from '../../../../src/decorators/index';

interface SomeNonPrimitiveStructure {
  a: string;
  b: number;
  c: boolean;
}

enum SomeEnum {
  A = 'a',
  B = 'b'
}

@Validation
export class ClassWithNonPrimitiveProperty {
  public someProperty?: SomeNonPrimitiveStructure;
}

@Validation
export class ClassWithEnumProperty {
  public someProperty?: SomeEnum;
}
