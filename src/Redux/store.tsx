import { configureStore } from "@reduxjs/toolkit";
import { themeReducer, bookmarkReducer } from "./redxSlice";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistStore, persistReducer } from "redux-persist";
const persistConfig = {
  key: "root",
  storage: AsyncStorage,
};

const persistedThemeReducer = persistReducer(
  { ...persistConfig, key: "theme" },
  themeReducer
);
const persistedBookmarkReducer = persistReducer(
  { ...persistConfig, key: "bookmark" },
  bookmarkReducer
);
export const store = configureStore({
  reducer: { theme: persistedThemeReducer, bookmark: persistedBookmarkReducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
