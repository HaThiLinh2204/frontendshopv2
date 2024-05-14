import React, { createContext, useContext, useState } from 'react';

const CartItemCountContext = createContext();

export const useCartItemCount = () => useContext(CartItemCountContext);

export const CartItemCountProvider = ({ children }) => {
  const [cartItemCount, setCartItemCount] = useState(0);

  return (
    <CartItemCountContext.Provider value={{ cartItemCount, setCartItemCount }}>
      {children}
    </CartItemCountContext.Provider>
  );
};

export default CartItemCountContext;
