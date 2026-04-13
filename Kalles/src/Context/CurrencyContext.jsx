import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

export const useCurrency = () => useContext(CurrencyContext);

const exchangeRates = {
    'AED': 1.0, // Base currency is AED as per Dhs.
    'AUD': 0.41,
    'EUR': 0.25,
    'CAD': 0.37,
    'CZK': 6.27,
    'DKK': 1.86,
    'HKD': 2.12,
    'ILS': 0.99,
    'JPY': 39.80,
    'MYR': 1.28,
    'NZD': 0.44,
    'USD': 0.27,
    'GBP': 0.21,
    'INR': 22.50,
};

export const CurrencyProvider = ({ children }) => {
    const [selectedCurrency, setSelectedCurrency] = useState(() => {
        const saved = localStorage.getItem('currency');
        return saved ? JSON.parse(saved) : { code: 'AED', symbol: 'Dhs.', flag: 'ae' };
    });

    useEffect(() => {
        localStorage.setItem('currency', JSON.stringify(selectedCurrency));
    }, [selectedCurrency]);

    const formatPrice = (priceInAED) => {
        const rate = exchangeRates[selectedCurrency.code] || 1;
        const converted = (parseFloat(priceInAED) * rate).toFixed(2);
        
        // Fallback for symbol if it's missing from old localStorage or previous bug
        const symbol = selectedCurrency.symbol || selectedCurrency.code || 'Dhs.';
        
        // Return standard formatted string based on currency code
        return `${symbol} ${converted}`;
    };

    const getConvertedPrice = (priceInAED) => {
        const rate = exchangeRates[selectedCurrency.code] || 1;
        return parseFloat((parseFloat(priceInAED) * rate).toFixed(2));
    };

    return (
        <CurrencyContext.Provider value={{ selectedCurrency, setSelectedCurrency, formatPrice, getConvertedPrice }}>
            {children}
        </CurrencyContext.Provider>
    );
};
