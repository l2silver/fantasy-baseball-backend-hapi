type $required<X> = ()=>X;
type $optional<X> = ()=>X | void;

type Joi = {
  string: ()=>{
    required: $required<string>;
    optional: $optional<string>;
  },
  number: ()=>{
    required: $required<number>;
    optional: $optional<number>;
  },
}
declare module 'joi' {
  declare var exports: Joi;
}
