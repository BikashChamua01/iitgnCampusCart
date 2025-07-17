import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import productReducer from "./product-slice/index";
import usersReducers from "./users";

const store = configureStore({
  reducer: {
    auth: authReducer,
    shopProducts: productReducer,
    adminUsers: usersReducers,
  },
});

export default store;
