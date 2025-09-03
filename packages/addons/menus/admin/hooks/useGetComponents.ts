import { useQuery } from "react-query";
import { getFetchClient } from "@strapi/strapi/admin";
import { type GetComponents } from "../../shared/contracts/components";

export const useGetComponents = () => {
  const { get } = getFetchClient();
  return useQuery<
    GetComponents.Request["query"],
    GetComponents.Response["error"],
    GetComponents.Response["data"]
  >("menu-components", async () => {
    const response = await get("/webtools-addon-menus/components");
    return response.data;
  });
};
