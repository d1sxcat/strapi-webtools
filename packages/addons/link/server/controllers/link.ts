import type { Core, UID } from '@strapi/strapi';
import { type Context } from 'koa';
import { clone } from 'lodash';
import { stringify, parse } from 'qs';
import { linkResponseSchema } from '../../shared/contracts/link';
import { validateQuery } from '../util/validate';
import { sanitizeOutput, sanitizeQuery } from '../util/sanitize';
import { getPluginService } from '../util/getPluginService';

const contentTypeUid = 'plugin::webtools.url-alias';

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async findAll(ctx: Context) {
    const settings = await getPluginService('settings').getSettings();
    const clonedCtx = clone(ctx);
    clonedCtx.querystring = stringify({
      ...parse(clonedCtx.querystring),
      sort: { [settings.sortBy]: settings.sortOrder },
    });
    const model = strapi.getModel(contentTypeUid);
    if (!model) {
      ctx.throw(400, 'Content type not found.');
    }
    const { auth } = ctx.state;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await strapi.auth.verify(auth, { scope: [`${contentTypeUid}.find`] });
    await validateQuery(clonedCtx, model, auth);
    const sanitizedQuery = await sanitizeQuery(clonedCtx, model, auth);
    if (!strapi.services?.[contentTypeUid]?.find) {
      ctx.throw(
        500,
        'The find method is not implemented for this content type.',
      );
    }
    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const { results, pagination } = await strapi
      .service(contentTypeUid)
      .find(sanitizedQuery);
    const sanitizedResults = await sanitizeOutput(results, model, auth);
    ctx.body = linkResponseSchema.validateSync(
      strapi
        .controller(contentTypeUid as UID.Controller)
        // @ts-expect-error
        // The strapi object is typed in a way that the following is expected to be a controller.
        // In fact that is not true, as this also exposes the helper functions of the controller.
        // That is the reason we put a ts-expect-error here.
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        .transformResponse(sanitizedResults, { pagination }),
    );
  },
});
