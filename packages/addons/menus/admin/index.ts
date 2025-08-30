/* eslint-disable @typescript-eslint/no-unsafe-call */

import { StrapiApp } from "@strapi/admin/strapi-admin";
import pluginPkg from "../package.json";
import { prefixPluginTranslations, type Translations } from "./helpers/prefixPluginTranslations";
import pluginId from "./helpers/pluginId";
import { Initializer } from "./components/Initializer";
import { type InjectComponent } from "../types/injection-zones";
import App from "./containers/App";
import getTrad from "./helpers/getTrad";
import PluginIcon from "./components/PluginIcon";

const { name } = pluginPkg.strapi;

export default {
  register(app: StrapiApp) {
    app.customFields.register({
      name: 'wt_link',
      pluginId,
      type: 'string',
      intlLabel: {
        id: getTrad('field.name'),
        defaultMessage: 'Webtools Link',
      },
      intlDescription: {
        id: getTrad('field.description'),
        defaultMessage: 'Select a link from the list',
      },
      icon: PluginIcon,
      components: {
        Input: async () => import('./components/LinkField/LinkField').then((module) => ({
          default: module.LinkField,
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
                  defaultMessage: "You won't be able to create an entry if this field is empty",
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
      initializer: Initializer,
      name,
    });
  },

  bootstrap(app: StrapiApp) {
    app.getPlugin("webtools").injectComponent("webtoolsRouter", "route", {
      name: "settings-route",
      label: "Menus",
      path: "/menus",
      Component: App,
    } as unknown as InjectComponent);
  },

  async registerTrads({ locales }: { locales: string[] }) {
    const importedTrads = await Promise.all(
      locales.map((locale) => {
        return import(`./translations/${locale}.json`)
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data as Translations, pluginId),
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

    return Promise.resolve(importedTrads);
  },
};
