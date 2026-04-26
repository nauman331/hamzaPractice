import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { PersistGate } from 'redux-persist/integration/react';

// 1. Dummy storage for environments without a browser (like Server-Side Rendering)
const createNoopStorage = () => {
  return {
    getItem(_key) {
      return Promise.resolve(null);
    },
    setItem(_key, value) {
      return Promise.resolve(value);
    },
    removeItem(_key) {
      return Promise.resolve();
    },
  };
};

// 2. Custom wrapper for the browser's standard localStorage
const createLocalStorage = () => {
  return {
    getItem(key) {
      return Promise.resolve(window.localStorage.getItem(key));
    },
    setItem(key, value) {
      window.localStorage.setItem(key, value);
      return Promise.resolve(value);
    },
    removeItem(key) {
      window.localStorage.removeItem(key);
      return Promise.resolve();
    },
  };
};

// 3. Automatically pick the right storage engine
const storage =
  typeof window !== "undefined" 
    ? createLocalStorage() 
    : createNoopStorage();

const authPersistConfig = {
  key: "auth",
  storage,
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export default store;