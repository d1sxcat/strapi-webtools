import { Core } from "@strapi/strapi";
import { getPluginService } from "../utils/getPluginService";
import { type Context } from "koa";

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async createComponents(ctx: Context) {
    const components = await getPluginService("components").createComponents();
    if (!components.componentsExist) {
      ctx.throw(400, "No menu components found or created");
    }
    if (components.reload) {
      setImmediate(() => strapi.reload());
      ctx.status = 200;
    }
    ctx.status = 200;
  },
  async getAllComponents(ctx: Context) {
    const components = getPluginService("components").getAllComponents();
    if (!components) {
      ctx.throw(400, "Not all menu components are created");
    }
    ctx.body = components;
    ctx.status = 200;
  },
  async getComponent(ctx: Context) {
    const { uid } = ctx.params;
    if (!uid) {
      ctx.throw(404, "missing parameter: uid");
    }
    const component = getPluginService("components").getComponent(uid);
    if (!component) {
      ctx.throw(404, "Component not found");
    }
    ctx.body = component;
    ctx.status = 200;
  },
});
