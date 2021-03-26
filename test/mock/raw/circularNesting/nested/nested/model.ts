import { CircularNestingParent } from './../../model';
import { Validation } from '../../../../../../src/decorators';

@Validation
export class CircularNestingSubChild {
  public someProperty: CircularNestingParent = new CircularNestingParent();
}
