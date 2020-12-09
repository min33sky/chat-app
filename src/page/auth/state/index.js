export const Types = {
  Set_Auth: 'auth/Set_Auth',
  Clear_Auth: 'auth/Clear_Auth',
  Set_Photo_Url: 'auth/Set_Photo_Url',
};

export const Actions = {
  setAuth: payload => ({
    type: Types.Set_Auth,
    payload,
  }),

  clearAuth: () => ({
    type: Types.Clear_Auth,
  }),

  setPhotoURL: payload => ({
    type: Types.Set_Photo_Url,
    payload,
  }),
};

const INITIAL_STATE = {
  currentUser: null,
  isLoading: true,
};

/**
 * 인증 관련 리듀서
 *
 * ? 파이어베이스에서 응답하는 객체가 특수객체라
 * ? immer에서 에러가 발생해서 순수 리듀서로 변경했다.
 * @param {object} state 상태
 * @param {object} action 액션 객체
 */
const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case Types.Set_Auth:
      return {
        ...state,
        currentUser: action.payload,
        isLoading: false,
      };

    case Types.Clear_Auth: {
      return {
        ...state,
        currentUser: null,
        isLoading: false,
      };
    }

    case Types.Set_Photo_Url: {
      return {
        ...state,
        currentUser: { ...state.currentUser, photoURL: action.payload },
        isLoading: false,
      };
    }

    default:
      return state;
  }
};

export default reducer;
