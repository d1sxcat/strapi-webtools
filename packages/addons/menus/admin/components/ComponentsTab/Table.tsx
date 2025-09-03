import React from "react";
import { Typography, Accordion, Grid, Flex } from "@strapi/design-system";
import { WarningCircle } from "@strapi/icons";
import { useIntl } from "react-intl";
import { useGetComponents } from "../../hooks/useGetComponents";

export const ComponentsTable = () => {
  const { formatMessage } = useIntl();
  const { data } = useGetComponents();
  return (
    <Flex direction="column" alignItems="stretch" gap={4}>
      <Flex
        direction="column"
        padding={8}
        justifyContent="space-between"
        alignItems="center"
        gap={2}
      >
        <Flex
          direction="row"
          justifyContent="center"
          alignItems="center"
          gap={2}
        >
          <WarningCircle />
          <Typography variant="delta">
            {formatMessage({
              id: "webtools.settings.page.list.table.title",
              defaultMessage: "Components",
            })}
          </Typography>
        </Flex>
        <Typography variant="omega" textColor="neutral600">
          {formatMessage({
            id: "webtools.settings.page.list.table.description",
            defaultMessage:
              "These are the components that are used to build menus and menu items.",
          })}
        </Typography>
      </Flex>
      <Accordion.Root>
        {data.components.map((component) => (
          <Accordion.Item key={component.uid} value={component.uid}>
            <Accordion.Header>
              <Accordion.Trigger
                description={component.schema.info.displayName}
              >
                {component.schema.info.displayName}
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>
              <Flex direction="column" gap={4}>
                {Object.entries(component.schema.attributes).map(
                  ([key, attribute]) => (
                    <Flex direction="row" key={key}>
                      <Typography variant="pi" fontWeight="bold">
                        {key}
                      </Typography>
                      <Typography variant="pi">{attribute.type}</Typography>
                    </Flex>
                  ),
                )}
              </Flex>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </Flex>
  );
};
