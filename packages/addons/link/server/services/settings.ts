import type { Core } from '@strapi/strapi';
import type { Settings } from '../../shared/contracts/settings';
import { pluginId } from '../util/pluginId';

export default ({ strapi }: { strapi: Core.Strapi }) => {
  async function getSettings() {
    const res = await strapi.store({ type: 'plugin', name: pluginId, key: 'settings' }).get(
      {},
    );

    return res as Settings['data'] | null;
  }

  function setSettings(value: Settings): Promise<void> {
    return strapi.store({
      type: 'plugin',
      name: pluginId,
      key: 'settings',
    }).set({ value });
  }

  return {
    getSettings,
    setSettings,
  };
};
