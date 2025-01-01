import { configureStore } from "@reduxjs/toolkit";
import Table from "./tableSlice";
import Search from "./searchSlice";
import User from "./userSlice";

const store = configureStore({
  reducer: {
    tableData: Table,
    searchData: Search,
    userData: User,
  },
});

export default store;
