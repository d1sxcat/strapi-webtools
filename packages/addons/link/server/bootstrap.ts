import { Core } from '@strapi/strapi';
import { has } from 'lodash';
import { pluginId } from './util/pluginId';

export default ({ strapi }: { strapi: Core.Strapi }) => {
  try {
    // Register permission actions.
    const actions = [
      {
        section: 'plugins',
        displayName: 'Access the link settings',
        uid: 'settings.read',
        pluginName: 'webtools-addon-link',
      },
    ];

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (strapi.admin.services.permission.actionProvider.registerMany as (a: any) => void)(actions);

    const defaultConfig = {
      settings: {
        sortBy: 'contenttype',
        sortOrder: 'asc',
        showDrafts: false,
      },
    };

    Object.entries(defaultConfig).forEach(([key, defaultValue]) => {
      const configurator = strapi.store({
        type: 'plugin',
        name: pluginId,
        key,
      });

      const checkConfig = async () => {
        const config = await configurator.get({});
        if (
          config &&
          Object.keys(defaultValue).every((keys) => has(config, keys))
        ) {
          return;
        }
        await configurator.set({
          value: Object.assign(defaultValue, config || {}),
        });
      };
      // eslint-disable-next-line no-void
      checkConfig().catch((err) => {
        strapi.log.error(
          `Unable to set default configuration for ${pluginId} plugin: ${String(
            err,
          )}`,
        );
      });
    });
  } catch (error) {
    strapi.log.error(`Bootstrap failed. ${String(error)}`);
  }
};
