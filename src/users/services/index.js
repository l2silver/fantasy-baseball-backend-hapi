// @flow
import { promisify } from 'bluebird';
import bcrypt from 'bcrypt';
import repo from '../repositories';
import { create as createSession } from './sessions';
import followersRepo from '../repositories/followers';

const tables = ['c', '1b', '2b', 'ss', '3b', 'rf', 'cf', 'lf', 'of'];

export function getAll(){
  return new Promise((resolve, reject) => {
    Promise.all(tables.map(name => repo.getTable(name))).then(results => results.reduce((finalResult, value, index) => {
      finalResult[tables[index]] = value;
      return finalResult;
    }, {})).then(resolve);
  });
}

