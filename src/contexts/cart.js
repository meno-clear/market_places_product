import update from "immutability-helper";
import { createContext, useContext } from "react";
import React, { useState } from "react";
import api_client from '../config/api_client';
import { set } from "react-native-reanimated";
const CartContext = createContext({})

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({
    total: 0,
    price_in_cents: 0,
    total_items: 0,
    cart_items: [],
  })

  const getItemIndex = (id) => {
    const { cart_items } = cart;
    return cart_items.findIndex((item) => item.product_id === id);
  }

  const getItem = (id) => {
    const { cart_items } = cart;
    return cart_items.find((item) => item.product_id === id);
  }

  const addToCart = (item) => {

    const cartUpdated = update(cart, {
        total(v) {
          return v + item.price_in_cents/100;
        },
        price_in_cents(v) {
          return v + item.price_in_cents;
        },
        total_items(v) {
          return v + 1;
        },
        cart_items(v) {
          return [
            ...v,
            {
              product_id: item.id,
              product_name: item.name,
              product_price_in_cents: item.price_in_cents,
              quantity: 1,
            },
          ];
        } 
    });
    setCart(cartUpdated);
  };

  const removeFromCart = (index) => {
    const { cart_items } = cart;

    const cartUpdated = update(cart, {
      total(v) {
        return v - cart_items[index].product_price_in_cents/100;
      },
      price_in_cents(v) {
        return v - cart_items[index].product_price_in_cents;
      },
      total_items(v) {
        return v - cart_items[index].quantity;
      },
      cart_items: {
        $splice: [[index, 1]],
      },
    });
    setCart(cartUpdated);
  }

  const increment = async (index) => {
    const { cart_items } = cart;
    if (cart_items[index]?.id) {
      const response = await api_client.patch(`/cart_items/${cart_items[index].id}`, {
        quantity: cart_items[index].quantity + 1
      })

      if (!response) return;
    }

    const cartUpdated = update(cart, {
      total(v) {
        return +v + cart_items[index].product_price_in_cents/100;
      },
      price_in_cents(v) {
        return v + cart_items[index].product_price_in_cents;
      },
      total_items(v) {
        return v + 1;
      },
      cart_items: {
        [index]: {
          quantity: {
            $set: cart_items[index].quantity + 1,
          },
        },
      },
    });
    setCart(cartUpdated);
  }

  const decrement = async (index) => {
    const { cart_items } = cart;
    
    if (cart_items[index].quantity === 1) {
      removeFromCart(index);
      return;
    }

    if (cart_items[index]?.id) {
      const response = await api_client.patch(`/cart_items/${cart_items[index].id}`, {
        quantity: cart_items[index].quantity - 1
      })

      if (!response) return;
    }

    const cartUpdated = update(cart, {
      total(v) {
        return v - cart_items[index].product_price_in_cents/100;
      },
      price_in_cents(v) {
        return v - cart_items[index].product_price_in_cents;
      },
      total_items(v) {
        return v - 1;
      },
      cart_items: {
        [index]: {
          quantity: {
            $set: cart_items[index].quantity - 1,
          },
        },
      },
    });
    setCart(cartUpdated);
  }

  const clearCart = () => {
    setCart({
      total: 0,
      price_in_cents: 0,
      total_items: 0,
      cart_items: [],
    });
  }

  return (
    <CartContext.Provider value={{ cart, setCart, addToCart, removeFromCart, increment, decrement, clearCart, getItemIndex, getItem }}>
      {children}
    </CartContext.Provider>
  );
};

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("Cart must be used within an CartContext");
  }

  return context;
}