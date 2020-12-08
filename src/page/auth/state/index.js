import { createReducer } from '../../../common/redux-helper';

export const Types = {
  Set_Auth: 'auth/Set_Auth',
};

export const Actions = {
  setAuth: payload => ({
    type: Types.Set_Auth,
    payload,
  }),
};

const INITIAL_STATE = {
  currentUser: null,
  isLoading: true,
};

const reducer = createReducer(INITIAL_STATE, {
  [Types.Set_Auth]: (state, action) => {
    state.currentUser = action.payload;
    state.isLoading = false;
  },
});

export default reducer;
