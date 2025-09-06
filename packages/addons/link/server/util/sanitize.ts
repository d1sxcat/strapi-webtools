import { Schema } from '@strapi/strapi';
import { type Context } from 'koa';

const sanitizeQuery = async (
  ctx: Context,
  contentType: Schema.ContentType,
  auth: unknown,
) => strapi.contentAPI.sanitize.query(ctx.query, contentType, { auth });

const sanitizeInput = async (
  data: unknown,
  contentType: Schema.ContentType,
  auth: unknown,
) => strapi.contentAPI.sanitize.input(data, contentType, { auth });

const sanitizeOutput = async (
  data: unknown,
  contentType: Schema.ContentType,
  auth: unknown,
) => strapi.contentAPI.sanitize.output(data, contentType, { auth });

export {
  sanitizeQuery,
  sanitizeInput,
  sanitizeOutput,
};
