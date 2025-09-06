import { Schema } from '@strapi/strapi';
import { type Context } from 'koa';

const validateQuery = async (
  ctx: Context,
  contentType: Schema.ContentType,
  auth: unknown,
) => strapi.contentAPI.validate.query(ctx.query, contentType, { auth });

const validateInput = async (
  data: unknown,
  contentType: Schema.ContentType,
  auth: unknown,
) => strapi.contentAPI.validate.input(data, contentType, { auth });

export {
  validateQuery,
  validateInput,
};
