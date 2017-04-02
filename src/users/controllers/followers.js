import { before } from '@imp_pat/server-utils/controllerUtils';

import * as services from '../services/followers';

export const create = before((app, req, { user_id }) => {
  const { user } = req;
  return services.create({ follower_id: user_id, user_id: user.id })
	.then(id => ({ entity: id }));
}, { verify: ['loggedIn'] });

export const remove = before((app, req, { id }) => services.remove(id)
	.then(() => ({ entity: {} })), { verify: ['loggedIn'] });

export const getMyFollowing = before((app, req) => {
  const { user = {} } = req;
  return services.getFollowing(user.id)
	.then(users => ({ entity: { users } }));
}, { verify: ['loggedIn'] });

export const getMyFollowers = before((app, req) => {
  const { user = {} } = req;
  return services.getFollowers(user.id)
	.then(users => ({ entity: { users } }));
}, { verify: ['loggedIn'] });
