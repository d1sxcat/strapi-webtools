import type { Context } from 'koa';
import { getPluginService } from '../util/getPluginService';
import pluginPerminssions from '../util/permissions';
import { validateSettings } from '../../shared/contracts/settings';

export default () => ({
  async updateSettings(ctx: Context) {
    const {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      request: { body },
      state: { userAbility },
    } = ctx;
    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    if (userAbility.cannot(pluginPerminssions.read)) {
      ctx.forbidden();
    }
    const data = await validateSettings(body);
    await getPluginService('settings').setSettings(data);
    ctx.body = { data };
  },
  async getSettings(ctx: Context) {
    const {
      state: { userAbility },
    } = ctx;
    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    if (userAbility.cannot(pluginPerminssions.read)) {
      ctx.forbidden();
    }
    const data = await getPluginService('settings').getSettings();
    ctx.body = { data };
  },
});
