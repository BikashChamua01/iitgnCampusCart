import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import productReducer from "./product-slice/index";
import usersReducers from "./users";
import wishlistReducer from "./wishlist-slice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    shopProducts: productReducer,
    adminUsers: usersReducers,
    wishlist: wishlistReducer,
  },
});

export default store;
