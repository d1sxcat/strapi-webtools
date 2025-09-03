import type { Core } from '@strapi/strapi';
import { pluginId } from './utils/pluginId';
import { getPluginService } from './utils/getPluginService';

const register = ({ strapi }: { strapi: Core.Strapi }) => {

  strapi.customFields.register({
    name: "wt_link",
    plugin: pluginId,
    type: "string",
    inputSize: {
      default: 12,
      isResizable: true,
    },
  });

  getPluginService('components').attachComponentsToContentType();

};

export default register;
