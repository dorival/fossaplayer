import { createStore, applyMiddleware, compose } from 'redux';
import reduxImmutableStateInvariant from 'redux-immutable-state-invariant';
import thunk from 'redux-thunk';

import rootReducer from '../reducers';

/**
 * Initialize Redux Store
 */
export default function configureStore() {
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; //add support for Redux dev tools

  return createStore(
    rootReducer,
    /* TODO: reduxImmutableStateInvariant is for DEV ONLY */
    composeEnhancers(applyMiddleware(thunk, reduxImmutableStateInvariant()))
  );
}