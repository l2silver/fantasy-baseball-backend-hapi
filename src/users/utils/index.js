// @flow
import validate from 'validate.js';


const hash = ()=>Promise.resolve('randomDigest')

const emailAndPasswordConstraints = {
  email: {
    presence: true,
    email: true,
  },
  password: {
    presence: true,
    length: {
      minimum: 6,
    },
  },
};

export function isEmailAndPasswordValid(params: {email: string; password: string}): void | Object {
  return validate(params, emailAndPasswordConstraints);
}

export const jwtSecret = 'the secret to life is ...';

export function getTokenFromHeaders(req: Object) {
  return req.headers.authorization;
}

export function generateDigest(password: string) {
  return hash(password, 10);
}

export function getUserFromAuth(req: Object) {
  return req.auth.credentials;
}
