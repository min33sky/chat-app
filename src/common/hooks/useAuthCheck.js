import firebase from 'firebase';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Actions as AuthActions } from '../../page/auth/state';

/**
 * Firebase 인증을 감시하는 Hook
 */
export default function useAuthCheck() {
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    // ? firebase의 observer를 통해서 인증 상태를 감시한다.
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        dispatch(AuthActions.setAuth(user));
        history.push('/');
      } else {
        dispatch(AuthActions.clearAuth());
        history.push('/login');
      }
    });
  }, [dispatch, history]);
}
