export interface Addon {
  name: string;
  description: string;
  packageName: string;
}

export const AVAILABLE_ADDONS: Addon[] = [
  {
    name: 'sitemap',
    description: 'Generate a sitemap for your Strapi content',
    packageName: 'webtools-addon-sitemap',
  },
  {
    name: 'link',
    description: 'Adds a custom link field type',
    packageName: 'webtools-addon-link',
  },
];

export const PREMIUM_ADDONS: Addon[] = [
  {
    name: 'redirects',
    description: 'Manage redirects for your Strapi content',
    packageName: '@pluginpal/webtools-addon-redirects',
  },
  {
    name: 'links',
    description: 'Advanced link management for your Strapi content',
    packageName: '@pluginpal/webtools-addon-links',
  },
];
