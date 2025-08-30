import type { Schema, Struct } from '@strapi/strapi';

export interface CoreHeader extends Struct.ComponentSchema {
  collectionName: 'components_core_headers';
  info: {
    displayName: 'header';
  };
  attributes: {
    title: Schema.Attribute.String;
  };
}

export interface MenusWtMenuItem extends Struct.ComponentSchema {
  collectionName: 'components_menus_wt_menu_items';
  info: {
    displayName: 'WT Menu Item';
  };
  attributes: {
    link: Schema.Attribute.Relation<'oneToMany', 'plugin::webtools.url-alias'> &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface MenusWtMenuSection extends Struct.ComponentSchema {
  collectionName: 'components_menus_wt_menu_sections';
  info: {
    displayName: 'WT Menu Section';
  };
  attributes: {
    menu_item: Schema.Attribute.Component<'menus.wt-menu-item', true>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'core.header': CoreHeader;
      'menus.wt-menu-item': MenusWtMenuItem;
      'menus.wt-menu-section': MenusWtMenuSection;
    }
  }
}
