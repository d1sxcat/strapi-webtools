import type { Core } from '@strapi/strapi';
import { pluginId } from './util/pluginId';

const register = ({ strapi }: { strapi: Core.Strapi }) => {
  strapi.customFields.register({
    name: 'wt_link',
    plugin: pluginId,
    type: 'string',
    inputSize: {
      // optional
      default: 12,
      isResizable: true,
    },
  });
};

export default register;
