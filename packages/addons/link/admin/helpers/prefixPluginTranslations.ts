type Translations = {
  [key: string]: string;
};


const prefixPluginTranslations = (trad: Translations, pluginId: string) => {
  if (!pluginId) {
    throw new TypeError('pluginId can not be empty');
  }
  return Object.keys(trad).reduce((acc, current) => {
    acc[`${pluginId}.${current}`] = trad[current];
    return acc;
  }, {});
};

export { prefixPluginTranslations };
