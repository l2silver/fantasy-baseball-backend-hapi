// @flow
// import RPC from '@imp_pat/server-utils/rpcUtils';
import { defaultController } from '@ps/hapi-utils/controllers';
import joi from 'joi';
import { generateDigest } from '../utils';
import * as services from '../services';

const userController = options => defaultController('users', options);

export function getAllHandler(request: *, reply: *) {
  reply(services.getAll());
}

export const getAll = userController({
  method: 'GET',
  path: '',
  handler: getAllHandler,
  config: {
    auth: false,
  },
});

export function checkEmailHandler(request: *, reply: *) {
  const { email } = request.payload;
  return services.doesEmailAlreadyExist(email).then(() => reply(false))
  .catch(() => reply(true));
}

export const checkEmail = userController({
  method: 'POST',
  path: '/check_email',
  handler: checkEmailHandler,
  config: {
    auth: false,
    validate: {
      payload: {
        email: joi.string().required().email(),
      },
    },
  },
});

export default [
  getAll,
  checkEmail,
];
