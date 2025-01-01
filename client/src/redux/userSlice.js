import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "userData",
  initialState: { user: {} },
  reducers: {
    storeUserDetails: (state, action) => {
      state.user = action.payload;
      console.log(state.user);
      sessionStorage.setItem("loggedin-user", JSON.stringify(state.user));
    },
    removeUserDetails: (state, action) => {
      state = { user: {} };
      sessionStorage.removeItem("loggedin-user");
    },
  },
});

export const { storeUserDetails, removeUserDetails } = userSlice.actions;
export default userSlice.reducer;
