import React, { useReducer, useEffect } from 'react';
import {
  Page,
  useNotification,
  useFetchClient,
  Layouts,
} from '@strapi/strapi/admin';
import {
  Button,
  Flex,
  SingleSelect,
  SingleSelectOption,
  Typography,
  Field,
} from '@strapi/design-system';
import { Check } from '@strapi/icons';
import isEqual from 'lodash/isEqual';
import { useIntl } from 'react-intl';
import { useMutation, useQuery } from 'react-query';
import { GetSettings, UpdateSettings } from '../../shared/contracts/settings';
import pluginPermissions from '../permissions';
import getTrad from '../helpers/getTrad';
import { init } from './init';
import { initialState, reducer } from './reducer';
import type { InitialState } from './reducer';

export const SettingsPage = () => {
  const { formatMessage } = useIntl();
  const { toggleNotification } = useNotification();
  const { get, put } = useFetchClient();

  const [{ initialData, modifiedData }, dispatch] = useReducer(
    reducer,
    initialState,
    init,
  );

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['link', 'settings'],
    async queryFn() {
      const {
        data: { data: fetchData },
      } = await get<GetSettings.Response['data']>(
        'webtools-addon-link/settings',
      );

      return fetchData;
    },
  });

  useEffect(() => {
    if (data) {
      dispatch({
        type: 'GET_DATA_SUCCEEDED',
        data,
      });
    }
  }, [data]);

  const isSaveButtonDisabled = isEqual(initialData, modifiedData);

  const { mutateAsync, isLoading: isSubmitting } = useMutation<
  UpdateSettings.Response['data'],
  UpdateSettings.Response['error'],
  UpdateSettings.Request['body']
  >(
    async (body) => {
      const { data: postData } = await put<UpdateSettings.Response['data']>(
        'webtools-addon-link/settings',
        body,
      );

      return postData;
    },
    {
      onSuccess() {
        // eslint-disable-next-line no-void
        void refetch();

        toggleNotification({
          type: 'success',
          message: formatMessage({
            id: 'notification.form.success.fields',
            defaultMessage: 'Saved',
          }),
        });
      },
      onError(err) {
        toggleNotification({
          type: 'warning',
          message:
            err.message ??
            formatMessage({
              id: 'notification.form.error.fields',
              defaultMessage: 'An error occurred',
            }),
        });
      },
    },
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSaveButtonDisabled) {
      return;
    }
    // eslint-disable-next-line no-void
    void mutateAsync(modifiedData);
  };

  const handleChange = ({
    target: { name, value },
  }: {
    target: {
      name: keyof NonNullable<InitialState['initialData']>;
      value: string;
    };
  }) => {
    dispatch({
      type: 'ON_CHANGE',
      keys: name,
      value,
    });
  };

  if (isLoading) {
    return <Page.Loading />;
  }

  return (
    <Page.Main>
      <form onSubmit={handleSubmit}>
        <Layouts.Root>
          <Layouts.Header
            title={formatMessage({
              id: getTrad('webtools.settings.header.label'),
              defaultMessage: 'Link',
            })}
            primaryAction={(
              <Button
                disabled={isSaveButtonDisabled}
                loading={isSubmitting}
                type="submit"
                startIcon={<Check />}
                size="S"
              >
                {formatMessage({
                  id: 'global.save',
                  defaultMessage: 'Save',
                })}
              </Button>
            )}
            subtitle={formatMessage({
              id: getTrad('webtools.settings.sub-header.label'),
              defaultMessage:
                'Settings for the Link addon',
            })}
          />
          <Layouts.Content>
            <Flex
              direction="column"
              alignItems="stretch"
              hasRadius
              background="neutral0"
              shadow="tableShadow"
              paddingTop={6}
              paddingBottom={6}
              paddingRight={7}
              paddingLeft={7}
            >
              <Typography variant="delta">
                {formatMessage({
                  id: 'webtools.settings.form.title',
                  defaultMessage: 'Settings',
                })}
              </Typography>
              <Typography variant="pi" textColor="neutral600">
                {formatMessage({
                  id: 'webtools.settings.form.description',
                  defaultMessage: 'Customise the Link Custom Field',
                })}
              </Typography>
              <Flex
                marginTop={4}
                direction="column"
                gap={4}
                alignItems="stretch"
              >
                <Field.Root
                  hint={formatMessage({
                    id: getTrad('webtools.settings.form.sortBy.description'),
                    defaultMessage:
                      'Select the field to sort the links by.',
                  })}
                  name="sortBy"
                >
                  <Field.Label>
                    {formatMessage({
                      id: getTrad('webtools.settings.form.sortBy.label'),
                      defaultMessage: 'Sort By',
                    })}
                  </Field.Label>
                  <SingleSelect
                    value={modifiedData?.sortBy}
                    onChange={(value: string) => {
                      handleChange({
                        target: { name: 'sortBy', value },
                      });
                    }}
                  >
                    <SingleSelectOption value="contenttype">
                      Content Type
                    </SingleSelectOption>
                    <SingleSelectOption value="createdAt">
                      Created At
                    </SingleSelectOption>
                    <SingleSelectOption value="updatedAt">
                      Updated At
                    </SingleSelectOption>
                    <SingleSelectOption value="publishedAt">
                      Published At
                    </SingleSelectOption>
                    <SingleSelectOption value="locale">
                      Locale
                    </SingleSelectOption>
                    <SingleSelectOption value="url_path">
                      URL Path
                    </SingleSelectOption>
                  </SingleSelect>
                  <Field.Hint />
                </Field.Root>
                <Field.Root
                  hint={formatMessage({
                    id: getTrad('webtools.settings.form.sortOrder.description'),
                    defaultMessage:
                      'Select the order to sort the links by.',
                  })}
                  name="sortOrder"
                >
                  <Field.Label>
                    {formatMessage({
                      id: getTrad('webtools.settings.form.jpeg.label'),
                      defaultMessage: 'Sort Order',
                    })}
                  </Field.Label>
                  <SingleSelect
                    value={modifiedData?.sortOrder}
                    onChange={(value: string) => {
                      handleChange({
                        target: { name: 'sortOrder', value },
                      });
                    }}
                  >
                    <SingleSelectOption value="asc">
                      Ascending
                    </SingleSelectOption>
                    <SingleSelectOption value="desc">
                      Descending
                    </SingleSelectOption>
                  </SingleSelect>
                  <Field.Hint />
                </Field.Root>
              </Flex>
            </Flex>
          </Layouts.Content>
        </Layouts.Root>
      </form>
    </Page.Main>
  );
};

export default function page() {
  return (
    <Page.Protect permissions={pluginPermissions.read}>
      <SettingsPage />
    </Page.Protect>
  );
}
