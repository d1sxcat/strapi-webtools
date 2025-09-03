import React from "react";
import { Tr, Td, Typography, Accordion } from "@strapi/design-system";
import { type Components } from "../../../shared/contracts/components";

export const TableRow = ({ uid, schema }: Components['data']['components'][number]) => {
  return (
    <Tr>
      <Td>
        <Accordion.Root>
          <Accordion.Trigger>
            
          </Accordion.Trigger>
        </Accordion.Root>
        <Typography>{schema.info.displayName ?? 'unknown'}</Typography>
      </Td>
      <Td>
        <Typography>{schema.uid}</Typography>
      </Td>
      <Td>
        <Typography>{}</Typography>
      </Td>
    </Tr>
  );
};
