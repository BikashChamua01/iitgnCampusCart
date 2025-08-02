import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "sonner";

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

export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async (productId, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.post(
        `/api/v1/wishlist/add/${productId}`,
        {},
        { withCredentials: true }
      );
      if (res.data?.success) {
        dispatch(fetchWishlist());
        toast.success(res.data.msg || "Added to wishlist");
        return res.data;
      } else {
        toast.error(res.data?.msg || "Failed");
        return rejectWithValue(res.data);
      }
    } catch (err) {
      toast.error("Server error");
      return rejectWithValue(err);
    }
  }
);

export const deleteFromWishlist = createAsyncThunk(
  "wishlist/deleteFromWishlist",
  async (productId, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `/api/v1/wishlist/delete/${productId}`,
        {
          withCredentials: true,
        }
      );

      if (response.data?.success) {
        dispatch(fetchWishlist()); // refetch updated wishlist
        toast.success(response.data?.msg || "Removed from wishlist");
        return response.data;
      } else {
        toast.error(response.data?.msg || "Failed to remove from wishlist");
        return rejectWithValue(response.data);
      }
    } catch (error) {
      toast.error(error?.message || "Error removing from wishlist");
      return rejectWithValue(error?.response?.data || error.message);
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
