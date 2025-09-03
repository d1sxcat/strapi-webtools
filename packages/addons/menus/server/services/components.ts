import { type Schema, type Core } from "@strapi/strapi";
import { MENUCOMPONENTUIDS } from "../constants";
import { set, get, isEqual } from "lodash";

const MENUCOMPONENTKEYS = Object.keys(MENUCOMPONENTUIDS);

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  getComponent(componentUid: string) {
    const component = strapi.components[componentUid];
    if (!component) {
      return null;
    }
    return component;
  },
  checkExistingComponents() {
    const existingComponents = MENUCOMPONENTKEYS.filter(
      (uid) => !!this.getComponent(uid),
    );
    return existingComponents;
  },
  getAllComponents(): {
    components: {
      uid: string;
      schema: Schema.Component<keyof typeof MENUCOMPONENTUIDS>;
    }[];
    valid: boolean;
  } {
    const strapiComponents = Object.entries(strapi.components)
      .filter(([uid, _]) => MENUCOMPONENTKEYS.includes(uid))
      .map(([uid, schema]) => ({ uid, schema }));
    if (
      !isEqual(
        MENUCOMPONENTKEYS.sort(),
        strapiComponents.map((c) => c.uid).sort(),
      )
    ) {
      return { components: [], valid: false };
    }
    return { components: strapiComponents, valid: true };
  },
  attachComponentsToContentType() {
    const contentType =
      strapi.contentTypes["plugin::webtools-addon-menus.menu"];
    if (!contentType) {
      return;
    }
    const { attributes } = contentType;
    const existingComponents = this.checkExistingComponents();
    if (existingComponents.length !== MENUCOMPONENTKEYS.length) {
      return;
    }
    const currentComponents =
      get(attributes.menu_components, "components") || [];
    if (
      currentComponents.length !== MENUCOMPONENTKEYS.length ||
      !currentComponents.every((uid: string) => MENUCOMPONENTKEYS.includes(uid))
    ) {
      set(attributes.menu_components, "components", MENUCOMPONENTKEYS);
    }
    return;
  },
  async createComponents() {
    const existingComponents = this.checkExistingComponents();
    if (existingComponents.length === MENUCOMPONENTKEYS.length) {
      return { componentsExist: true, reload: false };
    }
    try {
      strapi.reload.isWatching = false;
      await Promise.all(
        existingComponents.map((uid) =>
          this.deleteComponent(uid as keyof typeof MENUCOMPONENTUIDS),
        ),
      );
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
      return { componentsExist: true, reload: true };
    } catch (error) {
      strapi.log.error("Failed to create menu components:", error);
      return { componentsExist: false, reload: false };
    }
  },

  async updateComponent(
    uid: keyof typeof MENUCOMPONENTUIDS,
    newAttributes: Schema.Attributes,
  ) {
    const existingComponent = strapi.components[uid];
    if (existingComponent) {
      return {
        componentsExist: false,
        componentsUpdated: false,
        reload: false,
      };
    }
    try {
      strapi.reload.isWatching = false;
      await strapi
        .plugin("content-type-builder")
        .services.components.editComponent(uid, {
          attributes: { ...existingComponent.attributes, ...newAttributes },
        });
      return { componentsExist: true, componentsUpdated: true, reload: true };
    } catch (error) {
      strapi.log.error(`Failed to update component ${uid}:`, error);
      return { componentsExist: true, componentsUpdated: false, reload: false };
    }
  },

  async deleteComponent(uid: string) {
    await strapi
      .plugin("content-type-builder")
      .services.components.deleteComponent(uid);
  },
});
