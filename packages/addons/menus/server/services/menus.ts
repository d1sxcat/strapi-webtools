import { type Core } from "@strapi/strapi";

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async createMenu() {
    await strapi.documents("plugin::webtools-addon-menus.menu").create({
      data: { name: "New Menu", menu_components: [] },
    });
  },
});
