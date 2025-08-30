import { Core } from "@strapi/strapi";
import { getPluginService } from "../utils/getPluginService";
import { type Context } from "koa";

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async getComponents(ctx: Context) {
    const components = await getPluginService("components").createComponents();
    if (!components.componentsExist) {
      ctx.throw(500, "No menu components found or created");
    }
    if (components.reload) {
      setImmediate(() => strapi.reload());
      ctx.status = 200;
    }
    ctx.status = 200;
  },
});
