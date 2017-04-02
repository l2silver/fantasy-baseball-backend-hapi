// @flow
type $method = 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE';

type $request<$payload, $query, $params> = {
  payload: $payload,
  query: $query,
  params: $params,
};

type $options<$payload, $query, $params> = {
  method: $method,
  path: string,
  handler: (request: $request<$payload, $query, $params>, reply: Function)=>any,
  config?: {
    description?: string,
    notes?: string,
    tags?: string[],
    validate?: {
      payload?: $payload,
      query?: $query,
      params?: $params,
    }
  },
};

export default function controller<$payload, $query, $params>(
  options: $options<$payload, $query, $params>,
  defaultOptions?: {[key: string]: Function} = {}): Object {
  const result = Object.keys(defaultOptions).reduce((finalResult, key) => {
    finalResult[key] = defaultOptions[key](options[key]);
    return finalResult;
  },
  options);
  // console.log('result', result);
  return result;
}


export const defaultController = (pathPrefix: string, options: Object) => controller(
  options,
  {
    path(path) {
      return `/${pathPrefix}${path}`;
    },
    config(config = {}) {
      // return config;
      return { ...config, tags: ['api'].concat(config.tags || []) };
    },
  },
);
