// @flow
import repo from '../repositories/followers';

export const create = repo.insert;

export const remove = repo.remove;

export function getFollowing(userId?: number = 0) {
  return repo.following(userId);
}

export function getFollowers(userId?: number = 0) {
  return repo.followers(userId);
}
