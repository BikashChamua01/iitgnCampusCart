import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: true,
  products: [],
  myListing: [],
  myListingLoading: true,
};

export const fetchAllProducts = createAsyncThunk(
  "/shop/products",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "/api/v1/products",
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.log("Error in fetching the products", error);
      return rejectWithValue(error.message || error.msg);
    }
  }
);

export const fetchMyListing = createAsyncThunk(
  "/shop/my-listings",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `/api/v1/products/my-listings/${userId}`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.log(error, "Error in myListing store");
      return rejectWithValue(error.message || error.msg);
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.products;
      })
      .addCase(fetchAllProducts.rejected, (state) => {
        state.isLoading = false;
        state.products = [];
      })
      .addCase(fetchMyListing.pending, (state) => {
        state.myListing = [];
        state.myListingLoading = true;
      })
      .addCase(fetchMyListing.fulfilled, (state, action) => {
        state.myListingLoading = false;
        state.myListing = action.payload.success ? action.payload.products : [];
      })
      .addCase(fetchMyListing.rejected, (state) => {
        (state.myListing = []), (state.myListingLoading = false);
      });
  },
});

export const { setUser } = productSlice.actions;
export default productSlice.reducer;
