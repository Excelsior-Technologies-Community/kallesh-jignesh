import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CartProvider } from './Context/CartContext'
import { WishlistProvider } from './Context/WishlistContext'
import { CurrencyProvider } from './Context/CurrencyContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CurrencyProvider>
      <CartProvider>
        <WishlistProvider>
          <App />
        </WishlistProvider>
      </CartProvider>
    </CurrencyProvider>
  </StrictMode>,
)
