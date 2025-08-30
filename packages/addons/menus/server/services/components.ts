import { type Core } from "@strapi/strapi";
import { MENUCOMPONENTUIDS } from "../constants";

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  getComponent(componentUid: string) {
    return !!strapi.components[componentUid];
  },

  async createComponents() {
    const existingComponents = this.getComponent("menus.wt-menu-section");
    if (existingComponents) {
      return { componentsExist: true, reload: false}
    }

    try {
      strapi.reload.isWatching = false;
      await strapi
        .plugin("content-type-builder")
        .services.components.createComponent({
          component: {
            category: "menus",
            displayName:
              MENUCOMPONENTUIDS["menus.wt-menu-section"].schema.info
                .displayName,
            attributes:
              MENUCOMPONENTUIDS["menus.wt-menu-section"].schema.attributes,
          },
          components: [
            {
              tmpUID: "menus.wt-menu-item",
              category: "menus",
              displayName:
                MENUCOMPONENTUIDS["menus.wt-menu-item"].schema.info.displayName,
              attributes:
                MENUCOMPONENTUIDS["menus.wt-menu-item"].schema.attributes,
            },
          ],
        });

      return { componentsExist: true, reload: true}
    } catch (error) {
      strapi.log.error("Failed to create menu components:", error);
      return { componentsExist: false, reload: false}
    }
  },
});
