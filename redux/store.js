import { configureStore } from '@reduxjs/toolkit'
import AsyncStorage from '@react-native-async-storage/async-storage'
import userReducer from './userSlice.js'
import { combineReducers } from '@reduxjs/toolkit'

import domainReducer from './domainSlice.js'
import menuReducer from './menuSlice.js'
import moduleReducer from './moduleSlice.js'
import appReducer from './appSlice.js'
import listReducer from './listSlice.js'
import languageReducer from './languageSlice.js'

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

const persistConfig = {
  key: "root",
  version: 1, 
  storage: AsyncStorage,
};
const rootReducer = combineReducers({lang: languageReducer, app: appReducer,list: listReducer, domain: domainReducer, user: userReducer, menu: menuReducer,module: moduleReducer });
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store)