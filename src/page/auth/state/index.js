import { createReducer } from '../../../common/redux-helper';

export const Types = {
  Set_Auth: 'auth/Set_Auth',
  Clear_Auth: 'auth/Clear_Auth',
};

export const Actions = {
  setAuth: payload => ({
    type: Types.Set_Auth,
    payload,
  }),

  clearAuth: () => ({
    type: Types.Clear_Auth,
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

  [Types.Clear_Auth]: (state, action) => {
    state.currentUser = null;
    state.isLoading = false;
  },
});

export default reducer;
