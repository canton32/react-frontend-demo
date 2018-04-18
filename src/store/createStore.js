import { applyMiddleware, compose, createStore as createReduxStore } from 'redux'
import thunk from 'redux-thunk'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import makeRootReducer from './reducers'

import { loadState } from '../services/localStorage'

const initialState = loadState() || window.__INITIAL_STATE__

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['ui']
}

const persistedReducer = persistReducer(persistConfig, makeRootReducer())
const middleware = [thunk]

// ======================================================
// Store Enhancers
// ======================================================
const enhancers = []
let composeEnhancers = compose

if (__DEV__) {
  if (typeof window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ === 'function') {
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  }
}

// ======================================================
// Store Instantiation and HMR Setup
// ======================================================

const store = createReduxStore(
  persistedReducer,
  initialState,
  composeEnhancers(
    applyMiddleware(...middleware),
    ...enhancers
  )
)
if (module.hot) {
  module.hot.accept('./reducers', () => store.replaceReducer(require('./reducers')))
}
const persistor = persistStore(store, null, null)

export default {
  store, persistor
}
