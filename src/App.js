import React from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import Chat from './page/chat/Chat';
import Login from './page/auth/Login';
import Register from './page/auth/Register';
import { useEffect } from 'react';
import firebase from './firebase';
import { useDispatch, useSelector } from 'react-redux';
import { Actions as AuthActions } from './page/auth/state';

function App() {
  const history = useHistory();
  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.auth.isLoading);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      console.log('user', user);
      if (user) {
        history.push('/');
        dispatch(AuthActions.setAuth(user));
      } else {
        history.push('/login');
      }
    });
  }, [history, dispatch]);

  if (isLoading) {
    return <div>로딩중</div>;
  } else {
    return (
      <Switch>
        <Route exact path='/' component={Chat} />
        <Route path='/login' component={Login} />
        <Route path='/register' component={Register} />
      </Switch>
    );
  }
}

export default App;
