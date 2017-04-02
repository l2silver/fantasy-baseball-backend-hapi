// @flow
import Repo, { db } from '@ps/hapi-utils/repos';

class FollowerRepo extends Repo {
  following = (userId: number) => {
    const query = `
      SELECT u.id, u.email
      FROM followers
      LEFT JOIN users u ON u.id = followers.follower_id
      WHERE u.id = $1
    `;
    return db.manyOrNone(query, [userId]);
  }

  followers = (userId: number) => {
    const query = `
      SELECT u.id, u.email
      FROM followers
      LEFT JOIN users u ON u.id = followers.user_id
      WHERE u.id = $1
    `;
    return db.manyOrNone(query, [userId]);
  };
}

export default new FollowerRepo('followers');
