import { createSlice } from "@reduxjs/toolkit";

function initUserData() {
  const user = sessionStorage.getItem("loggedin-user");
  // console.log("user - ", user);
  if (!user) return { user: null };
  return { user: JSON.parse(user) };
}

const userSlice = createSlice({
  name: "userData",
  initialState: initUserData,
  reducers: {
    storeUserDetails: (state, action) => {
      state.user = action.payload;
      console.log(state.user);
      sessionStorage.setItem("loggedin-user", JSON.stringify(state.user));
    },
    removeUserDetails: (state, action) => {
      state.user = action.payload;
      sessionStorage.removeItem("loggedin-user");
    },
  },
});

export const { storeUserDetails, removeUserDetails } = userSlice.actions;
export default userSlice.reducer;
