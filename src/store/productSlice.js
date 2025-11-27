import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk to fetch data from API
export const fetchProducts = createAsyncThunk("products/fetchProducts", async () => {
  const res = await fetch("/api/products");
  const data = await res.json();
  if (data.success) {
    return data.result;
  }
  return [];
});

const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default productSlice.reducer;
