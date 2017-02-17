import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import { hashHistory } from 'react-router';
import { reducer as formReducer } from 'redux-form'

import ThunkMiddleware from 'redux-thunk';
import rootReducer from './reducers';
import DevTools from './DevTools';

const finalCreateStore = compose(
  applyMiddleware(ThunkMiddleware,routerMiddleware(hashHistory)),
  DevTools.instrument()
)(createStore);

console.log("rootReducer",rootReducer);

const reducer = combineReducers({
  rootReducer,
  routing: routerReducer,
  form: formReducer     // <---- Mounted at 'form'
});

export default function configureStore(initialState) {
  const store = finalCreateStore(reducer, initialState);
  return store;
}
