export default {
  type: "admin",
  routes: [
    {
      method: "GET",
      path: "/components",
      handler: "components.getAllComponents",
      config: {
        policies: [],
      },
    },
    {
      method: "GET",
      path: "/component/:uid",
      handler: "components.getComponent",
      config: {
        policies: [],
      },
    },
    {
      method: "POST",
      path: "/components",
      handler: "components.createComponents",
      config: {
        policies: [],
      },
    },
    {
      method: "POST",
      path: "/menus",
      handler: "menus.createMenu",
      config: {
        policies: [],
      },
    }
  ],
};
