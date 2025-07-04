import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isAuthenticated: false,
  user: null,
  isLoading: true,
};

export const register = createAsyncThunk("/auth/register", async (formData) => {
  try {
    const response = await axios.post("/api/v1/auth/register", formData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log("Error in registration", error);
  }
});

export const checkAuth = createAsyncThunk("/auth/check-auth", async () => {
  try {
    const response = await axios.get("/api/v1/auth/check-auth", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log("Check auth failed", error);
    throw error;
  }
});

export const login = createAsyncThunk("/auth/login", async (formData) => {
  try {
    const response = await axios.post("/api/v1/auth/login", formData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log("Error in login", error);
    throw error;
  }
});

export const logout = createAsyncThunk("/auth/logout", async () => {
  try {
    const response = await axios.post(
      "/api/v1/auth/logout",
      {},
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.log("Error in logout", error);
    throw error;
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      console.log(state, action);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload?.success ? action.payload.user : null;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.isLoading = false;
      })
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user || null;
        state.isAuthenticated = action.payload.success;
        console.log();
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user || null;
        state.isAuthenticated = action.payload.success;
      })
      .addCase(login.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
