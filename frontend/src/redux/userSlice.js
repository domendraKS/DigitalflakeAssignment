import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currUser: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInSuccess: (state, action) => {
      state.currUser = action.payload;
    },
    signOut: (state) => {
      state.currUser = null;
    },
  },
});

export const { signInSuccess, signOut } = userSlice.actions;

export default userSlice.reducer;
