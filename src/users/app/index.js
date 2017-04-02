import { promisify } from 'bluebird';
import jwt from 'jsonwebtoken';
import { jwtSecret } from '../utils';

const verify = promisify(jwt.verify);

export default [
  (app) => {
    app.use((req, res, next) => {
      const token = req.headers['x-access-token'];
      if (token) {
        // verifies secret and checks exp
        verify(token, jwtSecret)
        .then((decoded) => {
          req.user = decoded;
          next();
        }).catch(() => {
          next();
        });
      } else {
        next();
      }
    });
  },
];

