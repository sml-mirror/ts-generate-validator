import { CircularNestingSubChild } from './nested/model';
import { Validation } from '../../../../../src/decorators';

@Validation
export class CircularNestingChild {
  public someProperty: CircularNestingSubChild = new CircularNestingSubChild();
}
