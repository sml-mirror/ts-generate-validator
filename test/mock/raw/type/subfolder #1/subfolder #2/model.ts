import { Validation } from '../../../../../../src/decorators/index';

export interface SomeNonPrimitiveStructure {
  a: string;
  b: number;
  c: boolean;
}

export enum SomeEnum {
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
