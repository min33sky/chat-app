import React from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import Chat from './page/chat/Chat';
import Login from './page/auth/Login';
import Register from './page/auth/Register';
import { useEffect } from 'react';
import firebase from './firebase';
import { useDispatch, useSelector } from 'react-redux';
import { Actions as AuthActions } from './page/auth/state';
import Loader from './common/components/Loader';

function App() {
  const history = useHistory();
  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.auth.isLoading);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        dispatch(AuthActions.setAuth(user));
        history.push('/');
      } else {
        dispatch(AuthActions.clearAuth());
        history.push('/login');
      }
    });
  });

  if (isLoading) {
    return (
      <div
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <Loader />
      </div>
    );
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
