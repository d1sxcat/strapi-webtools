import { pluginId } from './pluginId';
import type config from '..';

type Config = typeof config;
type Services = Config['services'];

export const getPluginService = <ServiceName extends keyof Services>(name: ServiceName) => {
  const service = strapi.service(`plugin::${pluginId}.${name}`);
  return service as ReturnType<Services[ServiceName]>;
};
