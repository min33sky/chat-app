import { BrowserRouter, Route } from 'react-router-dom';
import Chat from './page/chat/Chat';
import Login from './page/auth/Login';
import Register from './page/auth/Register';

function App() {
  return (
    <BrowserRouter>
      <Route exact path='/' component={Chat} />
      <Route path='/login' component={Login} />
      <Route path='/register' component={Register} />
    </BrowserRouter>
  );
}

export default App;
