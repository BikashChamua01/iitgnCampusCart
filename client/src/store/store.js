import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import productReducer from "./product-slice/index";

const store = configureStore({
  reducer: {
    auth: authReducer,
    shopProducts: productReducer,
  },
});

export default store;
