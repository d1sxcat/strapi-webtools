import type { Core } from "@strapi/strapi";

const bootstrap = async ({ strapi }: { strapi: Core.Strapi }) => {
  const actions = [
    {
      section: "plugins",
      displayName: "Access the Menus editor",
      uid: "read",
      pluginName: "webtools-addon-menus",
    },
    {
      section: "plugins",
      displayName: "Create and Edit Menus",
      uid: "write",
      pluginName: "webtools-addon-menus",
    },
  ];

  await (strapi.service('admin::permission').actionProvider as { registerMany: (a: typeof actions) => Promise<void> }).registerMany(actions);
};

export default bootstrap;
