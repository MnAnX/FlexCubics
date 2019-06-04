import { createStore, applyMiddleware, compose } from "redux";
import { persistStore, autoRehydrate } from 'redux-persist';
import { AsyncStorage } from 'react-native';
import thunkMiddleware from "redux-thunk";
import createLogger from "redux-logger";
import rootReducer from "../reducers";
import config from "../config";

const loggerMiddleware = createLogger({colors: false});

export default function configureStore() {
  let middleware = [thunkMiddleware];
  if (config.env === 'dev') {
    middleware = [thunkMiddleware, loggerMiddleware];
  }

  const store = createStore(rootReducer, undefined, compose(
      applyMiddleware(...middleware),
      autoRehydrate()
    )
  );

  persistStore(store, { storage: AsyncStorage });

  return store;
};
