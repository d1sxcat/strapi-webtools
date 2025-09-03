import { errors } from "@strapi/utils";
import { type Schema } from "@strapi/strapi";
import { MENUCOMPONENTUIDS } from "../../server/constants";

type OneOf<T, U> =
  | (T & {
      [K in keyof U]?: never;
    })
  | (U & {
      [K in keyof T]?: never;
    });

export interface Components {
  data: {
    components: {
      uid: keyof typeof MENUCOMPONENTUIDS;
      schema: Schema.Component<keyof typeof MENUCOMPONENTUIDS>;
    }[];
    valid?: boolean;
  };
}

export declare namespace GetComponents {
  export interface Request {
    query?: {};
  }

  export type Response = OneOf<
    {
      data: Components["data"];
    },
    { error?: errors.ApplicationError | errors.ValidationError }
  >;
}

export declare namespace CreateComponents {
  export interface Request {
  }

  export type Response = OneOf<
    {
      data?: {};
    },
    { error?: errors.ApplicationError | errors.ValidationError }
  >;
}

export declare namespace UpdateComponents {
  export interface Request {
    body: Components["data"];
  }

  export type Response = OneOf<
    { data: Components["data"] },
    { error?: errors.ApplicationError | errors.ValidationError }
  >;
}
