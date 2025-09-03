import React, { useState } from "react";
import {
  getFetchClient,
  Page,
  Layouts,
  useNotification,
} from "@strapi/strapi/admin";
import { useIntl } from "react-intl";
import { Button, EmptyStateLayout, Tabs, Box } from "@strapi/design-system";
import { PERMISSIONS } from "../../permissions";
import { ComponentsTable } from "../../components/ComponentsTab/Table";
import { useGetComponents } from "../../hooks/useGetComponents";
import { useCreateComponents } from "../../hooks/useCreateComponents";

const App = () => {
  const { formatMessage } = useIntl();
  const { toggleNotification } = useNotification();
  const { get, post } = getFetchClient();
  const { data, error, isLoading } = useGetComponents();
  const { mutateAsync, isLoading: isSubmitting } = useCreateComponents()
  const [isCreating, setIsCreating] = useState(false);

  const handleComponentsCreate = async () => {
    setIsCreating(true);
    await mutateAsync({});
  };
  if (isLoading || isSubmitting) {
    return <Page.Loading />;
  }

  if (error) {
    return <Page.Error />;
  }

  return (
    <Page.Protect permissions={PERMISSIONS.read}>
      <Layouts.Header
        title={formatMessage({
          id: "webtools.settings.page.overview.title",
          defaultMessage: "Overview",
        })}
        subtitle={formatMessage({
          id: "webtools.settings.page.overview.description",
          defaultMessage: "Webtools global information",
        })}
      />
      <Layouts.Content>
        {isSubmitting || !data.valid ? (
          <EmptyStateLayout
            content={formatMessage({
              id: "webtools.settings.page.list.table.empty",
              defaultMessage: "You don't have any URL paths yet.",
            })}
            shadow="tableShadow"
            hasRadius
            action={
              <Button
                disabled={isCreating}
                onClick={() => handleComponentsCreate()}
              >
                {formatMessage({
                  id: "webtools.settings.button.generate_paths",
                  defaultMessage: "Bulk generate",
                })}
              </Button>
            }
          />
        ) : (
          <Box>
            <Tabs.Root defaultValue="url-bundles">
              <Tabs.List>
                <Tabs.Trigger value="url-bundles">
                  {formatMessage({
                    id: "sitemap.Settings.CollectionTitle",
                    defaultMessage: "URL bundles",
                  })}
                </Tabs.Trigger>
                <Tabs.Trigger value="custom-urls">
                  {formatMessage({
                    id: "sitemap.Settings.CustomTitle",
                    defaultMessage: "Custom URLs",
                  })}
                </Tabs.Trigger>
                <Tabs.Trigger value="settings">
                  {formatMessage({
                    id: "sitemap.Settings.SettingsTitle",
                    defaultMessage: "Settings",
                  })}
                </Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content value="url-bundles">
                <ComponentsTable />
              </Tabs.Content>
            </Tabs.Root>
          </Box>
        )}
      </Layouts.Content>
    </Page.Protect>
  );
};

export default App;
