export default {
  type: "admin",
  routes: [
    {
      method: "GET",
      path: "/components",
      handler: "components.getComponents",
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
