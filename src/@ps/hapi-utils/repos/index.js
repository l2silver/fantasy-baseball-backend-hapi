// @flow
import pgp from 'pg-promise';
import blandSquel from 'squel';

const {
  PG_DATABASE: database,
  PG_USER: user,
  PG_PASSWORD: password,
  PG_HOST: host,
  PG_PORT: port,
} = process.env;

export const connection = { database, user, password, host, port };
export const squel = blandSquel.useFlavour('postgres');
export const db = pgp()(connection);

export default class Repo {
  tableName: string;
  constructor(tableName: string) {
    this.tableName = tableName;
  }
  insert = (params?: Object = {}, options?: Object) => {
    const initialQuery = squel.insert()
    .into(this.tableName);
    Object.keys(params).forEach((key) => {
      initialQuery
      .set(key, params[key]);
    });
    if (!options || !options.skipTime) {
      const time = new Date().toDateString();
      ['created_at', 'updated_at'].forEach((key) => {
        initialQuery
        .set(key, time);
      });
    }
    const { text, values } = initialQuery.toParam();
    console.log('insertQuery', text, values);
    return db.one(`${text} RETURNING id`, values);
  };

  update = (filters: Object, params: Object) => {
    const initialQuery = squel.update()
        .table(this.tableName);
    Object.keys(params).forEach((key) => {
      initialQuery.set(key, params[key]);
    });

    Object.keys(filters).forEach((key) => {
      const operator = Array.isArray(filters[key]) ? ' in ' : ' = ';
      initialQuery.where(`${key}${operator}?`, filters[key]);
    });

    const { text, values } = initialQuery.toParam();

    console.log('text', text);
    console.log('values', values);
    return db.none(text, values);
  }
  retrieve = (params: Object = {}) => {
    const initialQuery = squel.select()
    .from(this.tableName);
    Object.keys(params).forEach((key) => {
      const operator = Array.isArray(params[key]) ? ' in ' : ' = ';
      initialQuery.where(`${key}${operator}?`, params[key]);
    });
    const { text, values } = initialQuery.toParam();
    console.log('text', text);
    console.log('values', values);
    return db.oneOrNone(text, values);
  };
  retrieveAll = (params: Object = {}) => {
    const initialQuery = squel.select()
    .from(this.tableName);
    Object.keys(params).forEach((key) => {
      const operator = Array.isArray(params[key]) ? ' in ' : ' = ';
      initialQuery.where(`${key}${operator}?`, params[key]);
    });
    const { text, values } = initialQuery.toParam();
    return db.manyOrNone(text, values);
  };

  count = (params: Object = {}) => {
    const initialQuery = squel.select()
    .from(this.tableName)
    .field('count(*)');
    Object.keys(params).forEach((key) => {
      const operator = Array.isArray(params[key]) ? ' in ' : ' = ';
      initialQuery.where(`${key}${operator}?`, params[key]);
    });
    const { text, values } = initialQuery.toParam();
    return db.one(text, values);
  };
  remove = (filters: Object = {}) => {
    const initialQuery = squel.delete()
      .from(this.tableName);
    Object.keys(filters).forEach((key) => {
      const operator = Array.isArray(filters[key]) ? ' in ' : ' = ';
      initialQuery.where(
        `${key}${operator}?`,
        filters[key],
      );
    });
    const { text, values } = initialQuery.toParam();
    console.log('text', text);
    console.log('values', values);
    return db.none(text, values);
  }

  reorder = (filters: Object, { rawOriginal, rawNext }: {rawOriginal: number, rawNext: number}, ordinalField: string = 'ordinal') => {
    if (rawOriginal > rawNext) {
      return this.reorderForwards(filters, { rawOriginal, rawNext }, ordinalField);
    }
    if (rawOriginal < rawNext) {
      return this.reorderBackwards(filters, { rawOriginal, rawNext }, ordinalField);
    }
    return Promise.resolve();
  }

  reorderBackwards = (filters: Object, { rawOriginal, rawNext }: Object, ordinalField: string = 'ordinal') => {
    const original = parseInt(rawOriginal, 10);
    const next = parseInt(rawNext, 10);
    const initialQuery = squel.update()
        .table(this.tableName)
        .set(`${ordinalField} = (CASE
        WHEN ${ordinalField} BETWEEN (${original} + 1) AND (${next}) THEN ${ordinalField} - 1
          WHEN ${ordinalField} = ${original} THEN ${next}
      END
    )`);
    Object.keys(filters).forEach((key) => {
      const operator = Array.isArray(filters[key]) ? ' in ' : ' = ';
      initialQuery.where(`${key}${operator}?`, filters[key]);
    });
    console.log('query', initialQuery.toString());
    return db.none(initialQuery.toString());
  }
  reorderForwards = (filters: Object, { rawOriginal, rawNext }: Object, ordinalField: string = 'ordinal') => {
    const original = parseInt(rawOriginal, 10);
    const next = parseInt(rawNext, 10);
    const initialQuery = squel.update()
        .table(this.tableName)
        .set(`${ordinalField} = (CASE
        WHEN ${ordinalField} BETWEEN ${next} AND (${original - 1}) THEN ${ordinalField} + 1
          WHEN ${ordinalField} = ${original} THEN ${next}
      END
    )`);
    Object.keys(filters).forEach((key) => {
      const operator = Array.isArray(filters[key]) ? ' in ' : ' = ';
      initialQuery.where(`${key}${operator}?`, filters[key]);
    });
    console.log('query', initialQuery.toString());
    return db.none(initialQuery.toString());
  }

}
