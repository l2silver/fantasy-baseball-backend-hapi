// @flow
import plugins from '@ps/hapi-utils/plugins';
import users from './users/controllers';
import pkg from '../package.json';

function register(server: Object, options: Object, ready: Function) {
  [
    ...users,
  ].forEach(route => server.route(route));
  server.register(plugins);
  ready();
}
register.attributes = {
  pkg,
};

module.exports = register;
