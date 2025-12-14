export const addToGuestCart = (product) => {
  return (dispatch, getState) => {
    const { cartItems } = getState().cart;
    const existingItem = cartItems.find((item) => item._id === product._id);

    let updatedCart;
    if (existingItem) {
      updatedCart = cartItems.map((item) =>
        item._id === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [...cartItems, { ...product, quantity: 1 }];
    }

    localStorage.setItem("guestCart", JSON.stringify(updatedCart));
    dispatch({ type: "cart/setCart", payload: updatedCart });
  };
};
