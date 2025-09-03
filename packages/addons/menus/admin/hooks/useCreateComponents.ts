import { getFetchClient, useNotification } from "@strapi/admin/strapi-admin";
import { useMutation, useQueryClient } from "react-query";
import { type CreateComponents } from "../../shared/contracts/components";

export const useCreateComponents = () => {
  // Importing here to avoid circular dependency
  const { post } = getFetchClient();
  const { toggleNotification } = useNotification();
  const queryClient = useQueryClient();
  return useMutation<
    CreateComponents.Response["data"],
    CreateComponents.Response["error"],
    CreateComponents.Request
  >(
    async () => {
      const { data } = await post("/webtools-addon-menus/components");
      return data;
    },
    {
      onError: (error) => {
        toggleNotification({
          type: "warning",
          message:
            error.message || "An error occurred while creating the components",
        });
      },
      onSuccess: async () => {
        await queryClient.refetchQueries("menu-components");
        toggleNotification({
          type: "success",
          message: "Components created successfully",
        });
      },
    },
  );
};
