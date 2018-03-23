// @flow
import Repo, { db, squel } from '@ps/hapi-utils/repos';

class UserRepo extends Repo {
  getTable = (table: string) => {
    const query = `SELECT t.*, additional.notes from "${table}" as t LEFT JOIN additional ON additional.playerid = t.playerid ORDER BY adp asc`;
    return db.many(query);
  };
}

export default new UserRepo('users');
