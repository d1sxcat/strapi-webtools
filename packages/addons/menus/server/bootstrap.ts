import type { Core } from "@strapi/strapi";

const bootstrap = async ({ strapi }: { strapi: Core.Strapi }) => {
  const actions = [
    {
      section: "plugins",
      displayName: "Access the Menus editor",
      uid: "settings.read",
      pluginName: "webtools-addon-menus",
    },
    {
      section: "plugins",
      displayName: "Edit Menus",
      uid: "settings.write",
      pluginName: "webtools-addon-menus",
    },
  ];

  await (strapi.service('admin::permission').actionProvider as { registerMany: (a: typeof actions) => Promise<void> }).registerMany(actions);
};

export default bootstrap;
