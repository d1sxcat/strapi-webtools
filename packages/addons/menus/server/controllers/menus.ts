import { Core } from "@strapi/strapi";
import { getPluginService } from "../utils/getPluginService";
import { type Context } from "koa";

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async createMenu(ctx: Context) {
    const menu = await getPluginService("menus").createMenu();
    return;
  },
});
