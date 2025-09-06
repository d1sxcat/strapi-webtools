/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import getTrad from './helpers/getTrad';
import { PluginIcon } from './components/PluginIcon';
import pluginId from './helpers/pluginId';
import { prefixPluginTranslations } from './helpers/prefixPluginTranslations';
import pluginPkg from '../package.json';
import App from './containers/App';

const pluginDescription = pluginPkg.strapi.description || pluginPkg.description;
const { name } = pluginPkg.strapi;

export default {
  register(app: any) {
    app.customFields.register({
      name: 'wt_link',
      pluginId,
      type: 'string',
      intlLabel: {
        id: getTrad('webtools.field.name'),
        defaultMessage: 'Link',
      },
      intlDescription: {
        id: getTrad('webtools.field.description'),
        defaultMessage: 'Select a link from the list',
      },
      icon: PluginIcon,
      components: {
        Input: async () => import('./components/CustomFields/Link').then((m) => ({
          default: m.Input,
        })),
      },
      options: {
        advanced: [
          {
            sectionTitle: {
              id: 'global.settings',
              defaultMessage: 'Settings',
            },
            items: [
              {
                name: 'required',
                type: 'checkbox',
                intlLabel: {
                  id: getTrad('options.advanced.requiredField'),
                  defaultMessage: 'Required field',
                },
                description: {
                  id: getTrad('options.advanced.requiredField.description'),
                  defaultMessage:
                    'You won\'t be able to create an entry if this field is empty',
                },
              },
            ],
          },
        ],
      },
    });
    app.registerPlugin({
      id: pluginId,
      isReady: true,
      name,
      isRequired: pluginPkg.strapi.required || false,
      description: pluginDescription,
    });
  },

  bootstrap(app: any) {
    app.getPlugin('webtools').injectComponent('webtoolsRouter', 'route', {
      name: 'settings-route',
      label: 'Link',
      path: '/link',
      Component: App,
    });
  },

  async registerTrads(app: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { locales } = app;

    const importedTranslations = await Promise.all(
      (locales as string[]).map((locale) => {
        return import(`./translations/${locale}.json`)
          .then(({ default: data }: { default: { [key: string]: string } }) => {
            return {
              data: prefixPluginTranslations(data, pluginId),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      }),
    );

    return importedTranslations;
  },
};
