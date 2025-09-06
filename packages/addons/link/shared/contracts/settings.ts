import { yup, validateYupSchema, errors } from '@strapi/utils';

enum SortBy {
  contenttype = 'contenttype',
  createdAt = 'createdAt',
  locale = 'locale',
  publishedAt = 'publishedAt',
  updatedAt = 'updatedAt',
  url_path = 'url_path',
}

enum SortOrder {
  asc = 'asc',
  desc = 'desc',
}

export const settingsSchema = yup.object({
  data: yup.object({
    sortBy: yup
      .string()
      .oneOf(Object.values(SortBy))
      .default(SortBy.contenttype),
    sortOrder: yup
      .string()
      .oneOf(Object.values(SortOrder))
      .default(SortOrder.asc),
  }),
});

export const validateSettings = validateYupSchema(settingsSchema);

type OneOf<T, U> =
  | (T & {
    [K in keyof U]?: never;
  })
  | (U & {
    [K in keyof T]?: never;
  });

export type Settings = yup.InferType<typeof settingsSchema>;

export declare namespace GetSettings {
  export interface Request {
    query?: {};
  }

  export interface Response {
    data: Settings;
  }
}

export declare namespace UpdateSettings {
  export interface Request {
    body: Settings['data'];
  }

  export type Response = OneOf<
  { data: Settings['data'] },
  { error?: errors.ApplicationError | errors.ValidationError }
  >;
}
