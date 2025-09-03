import { Core } from "@strapi/strapi";
import { type Context } from "koa";
import { getPluginService } from "../utils/getPluginService";

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async createMenu(ctx: Context) {
    await getPluginService("menus").createMenu();
    ctx.status = 200;
  },
});
