import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Chat from './page/chat/Chat';
import Login from './page/auth/Login';
import Register from './page/auth/Register';
import { useSelector } from 'react-redux';
import Loader from './common/components/Loader';
import useAuthCheck from './common/hooks/useAuthCheck';

const loaderStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
};

function App() {
  // 인증 상태 감시 Hook
  useAuthCheck();

  const isLoading = useSelector(state => state.auth.isLoading);

  if (isLoading) {
    return (
      <div style={loaderStyle}>
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
