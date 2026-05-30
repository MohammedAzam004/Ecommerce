/* eslint-disable react-refresh/only-export-components */
import {
    createContext,
    useEffect,
    useState,
} from "react";

export const CartContext =
    createContext();

const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] =
        useState(() => {
            const savedCart =
                localStorage.getItem("cartItems");

            return savedCart
                ? JSON.parse(savedCart)
                : [];
        });

    useEffect(() => {
        localStorage.setItem(
            "cartItems",
            JSON.stringify(cartItems)
        );
    }, [cartItems]);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                setCartItems,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export default CartProvider;