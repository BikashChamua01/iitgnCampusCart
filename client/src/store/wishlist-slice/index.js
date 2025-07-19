import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isWishlistLoading: true,
  wishlist: [],
};

export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/v1/wishlist/get-wishlist`, {
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      console.log("Error in fetchWishlist", error);
      return rejectWithValue(error?.response?.data?.msg || error.message);
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.isWishlistLoading = true;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.isWishlistLoading = false;
        state.wishlist = action.payload.wishlistProducts;
      })
      .addCase(fetchWishlist.rejected, (state) => {
        state.isWishlistLoading = false;
      });
  },
});

export default wishlistSlice.reducer;
