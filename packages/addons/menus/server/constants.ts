import menuItem from "./components/menus/wt-menu-item.json";
import menuSection from "./components/menus/wt-menu-section.json";

const ACTIONS = {
  readMenus: "plugin::webtools-addon-menus.settings.read",
  writeMenus: "plugin::webtools-addon-menus.settings.write",
};

export { ACTIONS };

export const MENUCOMPONENTUIDS = {
  "menus.wt-menu-section": { schema: menuSection },
  "menus.wt-menu-item": { schema: menuItem },
};
