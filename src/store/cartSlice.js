import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk to fetch data from API
export const fetchCart = createAsyncThunk("cart/fetchCart", async (userid) => {
  const res = await fetch(`/api/cart?userId=${userid}`);
  const data = await res.json();
  if (data.success) {
    return data.result.products;
  }
  return [];
});


const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
   setCart: (state, action) => {
      state.cartItems = action.payload;
    },
});

export default cartSlice.reducer;
