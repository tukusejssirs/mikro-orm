import { ReferenceKind } from '../enums';
import { MetadataStorage } from '../metadata';
import type { AnyEntity, Dictionary, EntityKey, EntityProperty } from '../typings';
import { Utils } from '../utils/Utils';
import type { PropertyOptions } from './Property';

export function Enum<T extends object>(options: EnumOptions<AnyEntity> | (() => Dictionary) = {}) {
  return function (target: AnyEntity, propertyName: string) {
    const meta = MetadataStorage.getMetadataFromDecorator(target.constructor as T);
    options = options instanceof Function ? { items: options } : options;
    meta.properties[propertyName as EntityKey<T>] = {
      name: propertyName,
      kind: ReferenceKind.SCALAR,
      enum: true,
      ...options,
    } as EntityProperty;

    return Utils.propertyDecoratorReturnValue();
  };
}

export interface EnumOptions<T> extends PropertyOptions<T> {
  items?: (number | string)[] | (() => Dictionary);
  array?: boolean;
  /** for postgres, by default it uses text column with check constraint */
  nativeEnumName?: string;
}
