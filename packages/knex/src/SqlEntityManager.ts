import {
  type AnyEntity,
  type ConnectionType,
  type EntityData,
  EntityManager,
  type EntityName,
  type EntityRepository,
  type FilterQuery,
  type GetRepository,
  type QueryResult,
} from '@mikro-orm/core';
import type { Knex } from 'knex';
import type { AbstractSqlDriver } from './AbstractSqlDriver';
import { QueryBuilder } from './query';
import type { SqlEntityRepository } from './SqlEntityRepository';

/**
 * @inheritDoc
 */
export class SqlEntityManager<D extends AbstractSqlDriver = AbstractSqlDriver> extends EntityManager<D> {
  /**
   * Creates a QueryBuilder instance
   */
  createQueryBuilder<T extends object>(
    entityName: EntityName<T> | QueryBuilder<T>,
    alias?: string,
    type?: ConnectionType,
  ): QueryBuilder<T> {
    const context = this.getContext();

    return new QueryBuilder<T>(
      entityName,
      this.getMetadata(),
      this.getDriver(),
      context.getTransactionContext(),
      alias,
      type,
      context,
    );
  }

  /**
   * Shortcut for `createQueryBuilder()`
   */
  qb<T extends object>(entityName: EntityName<T>, alias?: string, type?: ConnectionType) {
    return this.createQueryBuilder(entityName, alias, type);
  }

  /**
   * Returns configured knex instance.
   */
  getKnex(type?: ConnectionType) {
    return this.getConnection(type).getKnex();
  }

  async execute<T extends QueryResult | EntityData<AnyEntity> | EntityData<AnyEntity>[] = EntityData<AnyEntity>[]>(
    queryOrKnex: string | Knex.QueryBuilder | Knex.Raw,
    params: any[] = [],
    method: 'all' | 'get' | 'run' = 'all',
  ): Promise<T> {
    return this.getDriver().execute(queryOrKnex, params, method, this.getContext(false).getTransactionContext());
  }

  override getRepository<T extends object, U extends EntityRepository<T> = SqlEntityRepository<T>>(
    entityName: EntityName<T>,
  ): GetRepository<T, U> {
    return super.getRepository<T, U>(entityName);
  }

  protected override applyDiscriminatorCondition<Entity extends object>(
    entityName: string,
    where: FilterQuery<Entity>,
  ): FilterQuery<Entity> {
    // this is handled in QueryBuilder now for SQL drivers
    return where;
  }
}
