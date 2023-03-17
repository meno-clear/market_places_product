import update from "immutability-helper";
import { createContext, useContext } from "react";
import React, { useState, useEffect } from "react";
import api_client from "../config/api_client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDebouncedCallback } from "use-debounce";
import { set } from "react-native-reanimated";
import { Alert } from "react-native";

const CartContext = createContext({});

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({
    id: null,
    total: 0,
    price_in_cents: 0,
    total_items: 0,
    cart_items: [],
    market_place_partners: [],
  });
  const [loading, setLoading] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const { cart_items } = cart || {};

  const debounced = useDebouncedCallback(
    (type, value) => {
      updateCart(type, value);
    },
    2000,
    { maxWait: 5000 }
  );

  const updateCart = (type, item) => {
    if (!cart.id) return;

    api_client
      .patch(
        `/carts/${cart.id}/cart_items?action_type=${type}&cart_item_id=${item?.id}`,
        { cart_item: item }
      )
      .then(({ data }) => {
        setCart((state) => ({ ...state, ...data }));
      })
      .catch(() => {
        Alert.alert("Error", "Something went wrong, please try again later");
      })
      .finally(() => {
        setLoading(false);
        setActiveItem(null);
      });
  };

  const getItemIndex = (id) => {
    return cart_items.findIndex((item) => item.product_id === id);
  };

  const getItem = (id) => {
    return cart_items.find((item) => item.product_id === id);
  };

  const addToCart = (item) => {
    let product = {
      product_id: item.id,
      product_name: item.name,
      product_price_in_cents: item.price_in_cents,
      market_place_partner_id: item.market_place_partner_id,
      quantity: 1,
    };
    const cartUpdated = update(cart, {
      total_items(v) {
        return v + 1;
      },
      cart_items(v) {
        return [
          ...v,
          {
            ...product,
          },
        ];
      },
    });
    setCart(cartUpdated);
    updateCart("create_item", { ...product });
  };

  const removeFromCart = (index) => {
    setLoading(true);
    let item_deleted = cart_items[index];
    const cartUpdated = update(cart, {
      total_items(v) {
        return v - cart_items[index].quantity;
      },
      cart_items: {
        $splice: [[index, 1]],
      },
    });
    setCart(cartUpdated);
    debounced("remove_item", item_deleted);
  };

  const increment = async (index) => {
    if (!loading) {
      setLoading(true);
    }
    const cartUpdated = update(cart, {
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
    setActiveItem(index);
    setCart(cartUpdated);
    debounced("handle_quantity", cartUpdated["cart_items"][index]);
  };

  const decrement = async (index) => {
    if (!loading) {
      setLoading(true);
      setActiveItem(index);
    }

    if (cart_items[index].quantity === 1) {
      removeFromCart(index);
      return;
    }

    const cartUpdated = update(cart, {
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

    setActiveItem(index);
    setCart(cartUpdated);
    debounced("handle_quantity", cartUpdated["cart_items"][index]);
  };

  const clearCart = () => {
    api_client
      .post("/carts")
      .then(async ({ data }) => {
        await AsyncStorage.setItem("@cart", JSON.stringify({ id: data.id }));
        setCart(() => ({
          total: 0,
          price_in_cents: 0,
          total_items: 0,
          cart_items: [],
          market_place_partners: [],
          id: data.id,
        }));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const createCart = async () => {
    let cart_saved = await AsyncStorage.getItem("@cart");
    cart_saved = JSON.parse(cart_saved);

    if (!cart_saved?.id) {
      const { data } = await api_client
        .post("/carts")
        .catch(() =>
          Alert.alert("Error", "Something went wrong, please try again later")
        );
      await AsyncStorage.setItem("@cart", JSON.stringify({ id: data.id }));
      setCart((state) => ({ ...state, id: data.id }));
      return;
    }

    const { data } = await api_client
      .get(`/carts/${cart_saved.id}`)
      .catch(() =>
        Alert.alert("Error", "Something went wrong, please try again later")
      );

    if (data) setCart((state) => ({ ...state, ...data }));
  };

  useEffect(() => {
    createCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        addToCart,
        removeFromCart,
        increment,
        decrement,
        clearCart,
        getItemIndex,
        getItem,
        activeItem,
        loading,
      }}
    >
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
