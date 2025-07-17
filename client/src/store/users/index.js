import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const initialState = {
  isUsersLoading: true,
  users: [],
  totalPages: Number(0),
};

// configure the limit and initial page

export const fetchAllUsers = createAsyncThunk(
  "/users/fetch-users",
  async ({ pageNumber, limit }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `/api/v1/users/fetch-users?page=${pageNumber}&limit=${limit}`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.message || error.msg);
    }
  }
);

const usersSlice = createSlice({
  name: "users-slice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.isUsersLoading = true;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.isUsersLoading = false;
        state.users = action.payload?.success ? action.payload?.users : [];
        state.totalPages = action.payload?.success
          ? Number(action.payload.totalPages)
          : Number(0);
      })
      .addCase(fetchAllUsers.rejected, (state) => {
        state.isUsersLoading = false;
        state.users = [];
        state.totalPages = Number(0);
      });
  },
});

export default usersSlice.reducer;
