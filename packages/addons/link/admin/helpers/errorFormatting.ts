import * as yup from 'yup';
import { isFetchError } from '@strapi/strapi/admin';

const errorFormatting = (error: unknown) => {
  if (isFetchError(error)) {
    return 'fetch.error';
  }
  if (yup.ValidationError.isError(error)) {
    return 'validation.error';
  }
  return 'unknown.error';
};

export default errorFormatting;
