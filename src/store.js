import { configureStore } from "@reduxjs/toolkit";
import objectReducer from "./objectSlice";

const store = configureStore({
  reducer: {
    objects: objectReducer,
  },
});

export default store;
