import {
  Combobox, ComboboxOption, Flex, Field,
} from "@strapi/design-system";
import React, { forwardRef, Fragment } from "react";
import { useFetchClient } from "@strapi/strapi/admin";
import { useInfiniteQuery } from "react-query";
import { stringify } from "qs";
import { useIntl } from "react-intl";
import { errorFormatting } from "../../helpers/errorFormatting";
import getTrad from "../../helpers/getTrad";
import { schema } from "./validator";

const PAGE_SIZE = 5;

interface CustomFieldProps {
  attribute: {
    type: string;
    customField: string;
  };
  description: string;
  placeholder: string;
  hint: string;
  name: string;
  label: string;
  labelAction: any;
  onChange: (args: {
    target: {
      name: string;
      value: unknown;
      type: string;
    };
  }) => void;
  contentTypeUID: string;
  type: string; // custom field uid like plugin::color-picker.color
  value?: string;
  required: boolean;
  error: string;
  disabled: boolean;
  initialValue?: string;
}

export const LinkField = forwardRef<HTMLInputElement, CustomFieldProps>(
  (
    {
      name,
      hint,
      disabled,
      required,
      labelAction,
      label,
      attribute,
      onChange,
      value,
      placeholder,
      error,
    },
    ref,
  ) => {
    const { get } = useFetchClient();
    const { formatMessage } = useIntl();

    const {
      data,
      error: queryError,
      fetchNextPage,
      hasNextPage,
      isFetching,
      isFetchingNextPage,
      status,
    } = useInfiniteQuery({
      queryKey: ["webtools", "link"],
      async queryFn({ pageParam = 1 }) {
        const { data: responseData } = await get(
          `webtools/url-alias/findMany${stringify(
            {
              pagination: {
                page: pageParam,
                pageSize: PAGE_SIZE,
              },
            },
            { addQueryPrefix: true, encodeValuesOnly: true },
          )}`,
        );
        const validatedData = await schema.validate(responseData);
        return validatedData;
      },
      getNextPageParam: (lastPage) => (
        lastPage.meta.pagination.page < lastPage.meta.pagination.pageCount
          ? lastPage.meta.pagination.page + 1
          : undefined
      ),
    });
    const handleChange = (e?: string) => {
      onChange({
        target: { name, type: attribute.type, value: e ?? null },
      });
    };

    return (
      <Field.Root name={name} hint={hint} error={error} required={required}>
        <Field.Label action={labelAction}>{label}</Field.Label>
        <Combobox
          ref={ref}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          loading={status === "loading" || isFetching || isFetchingNextPage}
          loadingMessage={formatMessage({
            id: getTrad("loading.message"),
            defaultMessage: "Loading...",
          })}
          disabled={disabled}
          hasMoreItems={hasNextPage}
          onClear={() => handleChange()}
          onLoadMore={() => fetchNextPage()}
          noOptionsMessage={() => (
            status === "error"
              ? formatMessage({
                id: getTrad(errorFormatting(queryError)),
                defaultMessage: "An error occurred",
              })
              : formatMessage({
                id: getTrad("options.notfound"),
                defaultMessage: "No options",
              })
          )}
        >
          {data?.pages?.map((group) => (
            <Fragment key={group.meta.pagination.page}>
              {group.data?.map(({ url_path, locale }) => (
                <ComboboxOption key={url_path} value={url_path} textValue={url_path}>
                  <Flex
                    alignItems="center"
                    justifyContent="space-between"
                    gap={2}
                  >
                    <span>{url_path}</span>
                    <span>
                      <strong>{locale}</strong>
                    </span>
                  </Flex>
                </ComboboxOption>
              ))}
            </Fragment>
          ))}
        </Combobox>
        <Field.Hint />
        <Field.Error />
      </Field.Root>
    );
  },
);
