import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: true,
  products: [],
};



export const fetchAllProducts = createAsyncThunk("/shop/products", async () => {
  try {
    const response = await axios.get("/api/v1/products", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log("Error in fetching the products", error);
  }
});

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.isLoading = true;
      }).addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.products
      }).addCase(fetchAllProducts.rejected, (state) => {
        state.isLoading = false;
        state.products = []
      })
      
  },
});

export const { setUser } = productSlice.actions;
export default productSlice.reducer;
