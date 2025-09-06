import { errors } from '@strapi/utils';
import * as yup from 'yup';

export const linkResponseSchema = yup.object({
  data: yup.array().of(
    yup.object({
      contentType: yup.string().nullable(),
      createdAt: yup.date().nullable(),
      documentId: yup.string(),
      generated: yup.boolean(),
      id: yup.number(),
      locale: yup.string(),
      publishedAt: yup.date().nullable(),
      updatedAt: yup.date().nullable(),
      url_path: yup.string().required(),
    }),
  ),
  meta: yup.object({
    pagination: yup.object({
      page: yup.number(),
      pageSize: yup.number(),
      pageCount: yup.number(),
      total: yup.number(),
    }),
  }),
});

type OneOf<T, U> =
  | (T & {
    [K in keyof U]?: never;
  })
  | (U & {
    [K in keyof T]?: never;
  });

export type Links = yup.InferType<typeof linkResponseSchema>;

export declare namespace GetLinks {
  export type Response = OneOf<
  { data: Links },
  { error?: errors.ApplicationError | errors.ValidationError }
  >;
}
