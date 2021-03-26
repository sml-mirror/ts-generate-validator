import { CircularNestingChild } from './nested/model';
import { Validation } from '../../../../src/decorators';

@Validation
export class CircularNestingParent {
  public someProperty: CircularNestingChild = new CircularNestingChild();
}
