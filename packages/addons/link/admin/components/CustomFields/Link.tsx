import React, { forwardRef, Fragment } from 'react';
import {
  Combobox, ComboboxOption, Flex, Field,
} from '@strapi/design-system';
import { useFetchClient } from '@strapi/strapi/admin';
import { useInfiniteQuery } from 'react-query';
import { useIntl } from 'react-intl';
import { stringify } from 'qs';
import errorFormatting from '../../helpers/errorFormatting';
import getTrad from '../../helpers/getTrad';
import { type GetLinks } from '../../../shared/contracts/link';

interface CustomFieldProps {
  attribute: {
    type: string;
    customField: string;
  };
  placeholder: string;
  hint: string;
  name: string;
  label: string;
  labelAction: React.ReactNode;
  onChange: (args: {
    target: {
      name: string;
      value: unknown;
      type: string;
    };
  }) => void;
  type: string;
  value?: string;
  required: boolean;
  error: string;
  disabled: boolean;
}

const PAGE_SIZE = 25;

const Input = forwardRef<HTMLInputElement, CustomFieldProps>(
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

    const fetchLinks = async ({ pageParam = 1 }) => {
      const data = await get<GetLinks.Response['data']>(
        `webtools-addon-link/link/findAll${stringify(
          {
            pagination: {
              page: pageParam,
              pageSize: PAGE_SIZE,
            },
          },
          { addQueryPrefix: true, encodeValuesOnly: true },
        )}`,
      );
      return data.data;
    };

    const {
      data,
      error: queryError,
      fetchNextPage,
      hasNextPage,
      isFetching,
      isFetchingNextPage,
      status,
    } = useInfiniteQuery<GetLinks.Response['data'], GetLinks.Response['error']>(
      'link',
      fetchLinks,
      {
        getNextPageParam: (lastPage) => (
          lastPage.meta.pagination.page < lastPage.meta.pagination.pageCount
            ? lastPage.meta.pagination.page + 1
            : undefined),
      },
    );
    const handleChange = (e?: string) => {
      onChange({
        target: { name, type: attribute.type, value: e ?? null },
      });
    };

    const handleFetchNextPage = (entry: IntersectionObserverEntry) => {
      if (entry.isIntersecting) {
        // Note: we are using void to explicitly ignore the Promise returned by fetchNextPage
        // This is to avoid unhandled promise rejections in case of errors
        // since we are not using the result of the Promise here
        // eslint-disable-next-line no-void
        void fetchNextPage();
      }
    };

    return (
      <Field.Root name={name} hint={hint} error={error} required={required}>
        <Field.Label action={labelAction}>{label}</Field.Label>
        <Combobox
          ref={ref}
          value={value}
          disabled={disabled}
          onChange={handleChange}
          placeholder={placeholder}
          loading={status === 'loading' || isFetching || isFetchingNextPage}
          loadingMessage={formatMessage({
            id: getTrad('loading.message'),
            defaultMessage: 'Loading...',
          })}
          hasMoreItems={hasNextPage}
          onClear={() => handleChange()}
          onLoadMore={handleFetchNextPage}
          noOptionsMessage={() => (
            status === 'error'
              ? formatMessage({
                id: getTrad(errorFormatting(queryError)),
                defaultMessage: 'An error occurred',
              })
              : formatMessage({
                id: getTrad('options.notfound'),
                defaultMessage: 'No options',
              })
          )}
        >
          {data?.pages?.map((group) => (
            <Fragment key={group.meta.pagination.page}>
              {group.data?.map(({ url_path, locale }) => (
                <ComboboxOption key={url_path} textValue={url_path} value={url_path}>
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

export { Input };
