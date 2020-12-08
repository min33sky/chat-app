import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import { all } from 'redux-saga/effects';
import authReducer from '../page/auth/state';

const sagaMiddleware = createSagaMiddleware();

const reducer = combineReducers({
  auth: authReducer,
});

const store = createStore(reducer, composeWithDevTools(applyMiddleware(sagaMiddleware)));

function* rootSaga() {
  yield all([]);
}

sagaMiddleware.run(rootSaga);

export default store;
