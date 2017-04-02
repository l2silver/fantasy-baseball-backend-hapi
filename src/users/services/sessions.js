// @flow
import jwt from 'jsonwebtoken';
import { promisify } from 'bluebird';
import { JWT_SECRET } from '@ps/hapi-utils/auth';

const sign = promisify(jwt.sign);
export function create({ id, email }: Object) {
  return sign({ id, email }, JWT_SECRET, {
    expiresIn: '1 day',
  });
}
