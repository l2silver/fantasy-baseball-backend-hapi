// @flow
import Repo, { db, squel } from '@ps/hapi-utils/repos';

class UserRepo extends Repo {
  getTable = (table: string) => db.many(`SELECT * from "${table}" ORDER BY adp asc`);
}

export default new UserRepo('users');
