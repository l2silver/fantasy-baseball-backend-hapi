// @flow
import joi from 'joi';
import { defaultController } from '@ps/hapi-utils/controllers';
import { loginWithPassword } from '../services';
import { getTokenFromHeaders, getUserFromAuth } from '../utils';

const sessionController = options => defaultController('sessions', options);

export function createHandler(request: Object, reply: Function) {
  const { email, password } = request.payload;
  return loginWithPassword({ email, password })
  .then(({ token, user }) => {
    reply({ token, user });
  });
}

const create = sessionController({
  method: 'POST',
  path: '',
  config: {
    validate: {
      payload: {
        email: joi.string().email().required(),
        password: joi.string().min(6),
      },
    },
    auth: false,
  },
  handler: createHandler,
});

export function getHandler(req: Object, reply: Function) {
  const token = getTokenFromHeaders(req);
  const user = getUserFromAuth(req);
  console.log('token', token);
  reply({ token, user });
  return Promise.resolve({ entity: { token, user } });
}

const index = sessionController({
  method: 'GET',
  path: '',
  handler: getHandler,
});

export default [create, index];
