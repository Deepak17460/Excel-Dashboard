import { configureStore } from "@reduxjs/toolkit";
import Table from "./tableSlice";
import Search from "./searchSlice";

const store = configureStore({
  reducer: {
    tableData: Table,
    searchData: Search,
  },
});

export default store;
