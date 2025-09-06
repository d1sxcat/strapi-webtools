/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
import { produce } from 'immer';
import { set } from 'lodash';

export type InitialState = {
  initialData: {
    sortBy: string;
    sortOrder: string;
  } | null;
  modifiedData: {
    sortBy: string;
    sortOrder: string;
  } | null;
};

interface ActionGetDataSucceeded {
  type: 'GET_DATA_SUCCEEDED';
  data: InitialState['initialData'];
}

interface ActionOnChange {
  type: 'ON_CHANGE';
  keys: keyof NonNullable<InitialState['initialData']>;
  value: string;
}

export type Action = ActionGetDataSucceeded | ActionOnChange;

const initialState: InitialState = {
  initialData: {
    sortBy: 'contenttype',
    sortOrder: 'asc',
  },
  modifiedData: {
    sortBy: 'contenttype',
    sortOrder: 'asc',
  },
};

const reducer = (state: InitialState, action: Action) => produce(state, (draftState) => {
  switch (action.type) {
    case 'GET_DATA_SUCCEEDED': {
      draftState.initialData = action.data;
      draftState.modifiedData = action.data;
      break;
    }
    case 'ON_CHANGE': {
      set(
        draftState,
        ['modifiedData', ...action.keys.split('.')],
        action.value,
      );
      break;
    }
    default:
      return state;
  }
});

export { initialState, reducer };
