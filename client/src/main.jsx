import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import CartProvider from "./context/CartContext";
import {
  ToastContainer,
} from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartProvider>
      <App />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        pauseOnHover={true}
        closeOnClick={true}
      />
    </CartProvider>
  </StrictMode>,
)
