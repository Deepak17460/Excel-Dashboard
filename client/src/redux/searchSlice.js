import { createSlice } from "@reduxjs/toolkit";

const searchSlice = createSlice({
  name: "searchData",
  initialState: { key: "" },
  reducers: {
    updateSearchKey: (state, action) => {
      state.key = action.payload;
    },
  },
});

export const { updateSearchKey } = searchSlice.actions;
export default searchSlice.reducer;
