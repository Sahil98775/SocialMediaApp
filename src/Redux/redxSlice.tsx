import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/* ---------------- BOOKMARK SLICE ---------------- */

interface BookmarkState {
  bookmarks: string[];
}

const bookmarkInitialState: BookmarkState = {
  bookmarks: [],
};

const bookmarkSlice = createSlice({
  name: "bookmark",
  initialState: bookmarkInitialState,
  reducers: {
    addBookmark: (state, action: PayloadAction<string>) => {
      if (!state.bookmarks.includes(action.payload)) {
        state.bookmarks.push(action.payload);
      }
    },
    removeBookmark: (state, action: PayloadAction<string>) => {
      state.bookmarks = state.bookmarks.filter((id) => id !== action.payload);
    },
  },
});

/* ---------------- THEME SLICE ---------------- */

interface ThemeState {
  mode: "light" | "dark";
}

const themeInitialState: ThemeState = {
  mode: "light",
};

const themeSlice = createSlice({
  name: "theme",
  initialState: themeInitialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
  },
});

/* ---------------- EXPORTS ---------------- */

export const { addBookmark, removeBookmark } = bookmarkSlice.actions;
export const bookmarkReducer = bookmarkSlice.reducer;

export const { toggleTheme } = themeSlice.actions;
export const themeReducer = themeSlice.reducer;
