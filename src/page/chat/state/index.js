import { createReducer } from '../../../common/redux-helper';

export const Types = {
  SET_CURRENT_CHAT_ROOM: 'chat/SET_CURRENT_CHAT_ROOM',
};

export const Actions = {
  setCurrentChatRoom: payload => ({
    type: Types.SET_CURRENT_CHAT_ROOM,
    payload,
  }),
};

const INITIAL_STATE = {
  currentChatRoom: null,
};

const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_CURRENT_CHAT_ROOM]: (state, action) => {
    state.currentChatRoom = action.payload;
  },
});

export default reducer;
