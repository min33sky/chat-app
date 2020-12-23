import { createReducer } from '../../../common/redux-helper';

export const Types = {
  SET_CURRENT_CHAT_ROOM: 'chat/SET_CURRENT_CHAT_ROOM',
  SET_PRIVATE_CHAT_ROOM: 'chat/SET_PRIVATE_CHAT_ROOM',
  SET_USER_POSTS: 'chat/SET_USER_POSTS',
};

export const Actions = {
  setCurrentChatRoom: payload => ({
    type: Types.SET_CURRENT_CHAT_ROOM,
    payload,
  }),

  /**
   * 비공개 채팅방 설정 액션 함수
   * @param {boolean} payload 비공개방 설정 유무
   */
  setPrivateChatRoom: payload => ({
    type: Types.SET_PRIVATE_CHAT_ROOM,
    payload,
  }),

  setUserPosts: payload => ({
    type: Types.SET_USER_POSTS,
    payload,
  }),
};

const INITIAL_STATE = {
  currentChatRoom: null,
  isPrivateChatRoom: false,
  userPosts: null,
};

const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_CURRENT_CHAT_ROOM]: (state, action) => {
    state.currentChatRoom = action.payload;
  },

  [Types.SET_PRIVATE_CHAT_ROOM]: (state, action) => {
    state.isPrivateChatRoom = action.payload;
  },

  [Types.SET_USER_POSTS]: (state, action) => {
    state.userPosts = action.payload;
  },
});

export default reducer;
