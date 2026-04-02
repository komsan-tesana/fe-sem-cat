import { useState, useCallback, useEffect } from "react";
import { CartContext } from "./cart-context";
import { useAuth } from "@/app/providers/auth";
import { notification } from "antd";
import { uniq } from "lodash";

export function CartProvider({ children }) {
  const { getCurrentEmail } = useAuth();
  const [cartItems, setCartItems] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cartItems");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = useCallback((productId, donateType, cat) => {
    if (!donateType) {
      notification.error({
        title: "Error",
        description: "Please Selected Gift.",
      });
      return;
    }

    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === productId);

      if (existing) {
        return prevItems.map((item) =>
          item.id === productId
            ? {
                ...item,
                cat,
                food: donateType === 1 ? item.food + 10 : item.food,
                medical: donateType === 2 ? item.medical + 10 : item.medical,
                supplies: donateType === 3 ? item.supplies + 10 : item.supplies,
                users: uniq([...item.users, getCurrentEmail()]),
              }
            : item,
        );
      }

      return [
        ...prevItems,
        {
          id: productId,
          cat,
          food: donateType === 1 ? 10 : 0,
          medical: donateType === 2 ? 10 : 0,
          supplies: donateType === 3 ? 10 : 0,
          users: [getCurrentEmail()],
        },
      ];
    });
  }, [getCurrentEmail]);

  const removeFromCart = useCallback((productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const productInCart = useCallback((id) => {
    return cartItems.find((item) => item.id === id);
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        productInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
