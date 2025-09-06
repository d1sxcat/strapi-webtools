export default {
  type: 'admin',
  routes: [
    {
      method: 'GET',
      path: '/link/findAll',
      handler: 'link.findAll',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/settings',
      handler: 'settings.getSettings',
      config: {
        policies: [
          'admin::isAuthenticatedAdmin',
          {
            name: 'admin::hasPermissions',
            config: {
              actions: ['plugin::webtools-addon-link.settings.read'],
            },
          },
        ],
      },
    },
    {
      method: 'PUT',
      path: '/settings',
      handler: 'settings.updateSettings',
      config: {
        policies: [
          'admin::isAuthenticatedAdmin',
          {
            name: 'admin::hasPermissions',
            config: {
              actions: ['plugin::webtools-addon-link.settings.read'],
            },
          },
        ],
      },
    },
  ],
};
