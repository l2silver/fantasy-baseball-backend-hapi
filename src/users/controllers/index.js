// @flow
// import RPC from '@imp_pat/server-utils/rpcUtils';
import { defaultController } from '@ps/hapi-utils/controllers';
import repo from '../repositories';

const userController = options => defaultController('users', options);

export function getAllHandler(request: *, reply: *) {
  const tables = ['c', '1b', '2b', 'ss', '3b', 'rf', 'cf', 'lf', 'of', 'p'];
  return Promise.all(tables.map(name => repo.getTable(name))).then(results => results.reduce((finalResult, value, index) => {
    if (tables[index] === 'p') {
      finalResult['p'] = value.filter((p)=>(p.gs >= 3))
      finalResult['rp'] = value.filter((p)=>((p.g - p.gs) >= 5))
    } else {
      finalResult[tables[index]] = value;
    }
    return finalResult;
  }, {})).then(reply)
}

export const getAll = userController({
  method: 'GET',
  path: '',
  handler: getAllHandler,
  config: {
    auth: false,
  },
});

export default [
  getAll,
];
