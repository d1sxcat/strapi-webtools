import React from "react";
import { getFetchClient, Page, Layouts } from "@strapi/strapi/admin";
import { useQuery, useQueryClient } from "react-query";
import { useIntl } from "react-intl";
import { Button } from "@strapi/design-system";

// import pluginPermissions from '../../permissions';

const App = () => {
  const { formatMessage } = useIntl();
  const { get } = getFetchClient();
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery("components", async () => {
    const response = await get("/webtools-addon-menus/components");
    return response.data;
  });

  return (
    <Page.Main>
      <Layouts.Header
        title={formatMessage({
          id: "webtools.settings.page.overview.title",
          defaultMessage: "Overview",
        })}
        subtitle={formatMessage({
          id: "webtools.settings.page.overview.description",
          defaultMessage: "Webtools global information",
        })}
        primaryAction={
          <Button>
            {formatMessage({
              id: "webtools.settings.button.generate_paths",
              defaultMessage: "Bulk generate",
            })}
          </Button>
        }
      />
      <Layouts.Content>
        <div>poop</div>
      </Layouts.Content>
    </Page.Main>
  );
};

export default App;
