import type { Platform } from '../platforms';
import type { EntityProperty } from '../typings';
import { Type } from './Type';

export class IntegerType extends Type<number | null | undefined, number | null | undefined> {
  override getColumnType(prop: EntityProperty, platform: Platform) {
    return platform.getIntegerTypeDeclarationSQL(prop);
  }

  override compareAsType(): string {
    return 'number';
  }

  override ensureComparable(): boolean {
    return false;
  }
}
